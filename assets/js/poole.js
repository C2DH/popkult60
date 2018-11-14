(function() {
  "use strict"

  function Poole() {
    var _self = this;
    this.docs = {};

    this.relativePath = '';
    this.language = 'en';

    this.log = function() {
      var args = Array.prototype.slice.call(arguments);
      console.log.apply(console, ['%cPoole', 'color:cyan; background-color: magenta'].concat(args));
    }
    this.enrich = function(docs, namespace) {
      this.log('enrich()', 'n. docs:', docs.length, 'from:', namespace)
      for (var i = 0, l = docs.length; i < l; i++) {
        if (!docs[i])
          continue; // skip undefined
        var id = docs[i].slug || docs[i].id || 'poole-doc-'+i;
        this.log('enrich() - doc: ', id, 'ok');
        this.docs[id] = docs[i];
      }
    }

    this.setRelativePath = function(path) {
      this.relativePath = path;
      this.log('setRelativePath() with: ', path);
    }

    this.setLanguage = function(lang) {
      this.language = lang;
      this.log('setLanguage() with: ', lang);
    }

    this.transformLinks = function() {
      var aTags = d3.selectAll('a');
      var c = 0;

      this.log('transformLinks(). Checking: ', aTags.size(), ' links');

      aTags.each(function() {
        var href = this.getAttribute('href');


        if (href && href.indexOf('/') === -1 && href.indexOf('http') === -1 && href.indexOf('#') !== 0) {
          // increment count
          c = c + 1;

          if (_self.docs[href]) {
            var doc = _self.docs[href];

            switch (this.innerHTML) {
              case 'ref':
                var ref = _self.createRef(doc);
                this.parentNode.insertBefore(ref.node(), this);
                this.remove();
                break;
              case 'cit':
                d3.select(this)
                  .html('(' + _self.refAuthorTitleYear(doc) + ')')
                  .attr('href', _self.refUrl(doc))
                  .attr('target', '_blank');
                break;
              case 'lit':
                d3.select(this)
                  .html(_self.refAuthorYear(doc, false))
                  .attr('href', _self.refUrl(doc))
                  .attr('target', '_blank');
                break;
              case 'block':
                var block = _self.createBlock(doc);
                this.parentNode.insertBefore(block.node(), this);
                this.remove()
                break;
              case 'card':
              case 'half-card':
                var card = _self.createCard(doc);
                this.parentNode.insertBefore(card.node(), this);
                this.remove()
                if(this.innerHTML === 'half-card') {
                  card.classed('half', true);
                }
                break;
              case 'media':
                var card = _self.createMedia(doc);
                this.parentNode.insertBefore(card.node(), this);
                this.remove()
                break;
              default:
                break;
            }
            //console.log(attr, _self.docs[attr]);
          } else {
            console.error('document', href, 'has not been found. Please make sure you correctly added it...')
          }
        }
      });

      this.log('transformLinks(). Found: ', c, 'out of', aTags.size(), 'links to transform.');

    }

    this.refAuthorYear = function(doc, withParenthesis) {
      var authoryear = [doc.data.author, doc.data.year]
        .filter(function(d) {
          return typeof d !== 'undefined';
        })
        .map(function(d) {
          return ('' + d).replace(/\s*,\s*$/, '').trim();
        })
        .join(', ')
      if(withParenthesis) {
        return '(' + authoryear + ')';
      }
      return authoryear;
    }

    this.refAuthorTitleYear = function(doc) {
      return [(doc.data.author || '').replace(/[\s,]$/, ''), '<em>' + doc.title.replace(/[\s,]$/, '') + '</em>', doc.data.year]
        .filter(function(d) {
          return typeof d !== 'undefined';
        })
        .map(function(d) {
          return ('' + d).replace(/\s*,\s*$/, '');
        })
        .join(', ');
    }

    this.refUrl = function(doc) {
      if(doc.url){
        return doc.url;
      } else if (doc.attachment) {
        return '' + _self.relativePath + doc.attachment;
      }
      return '';
    }

    this.createRef = function(doc) {
      var ref = d3.select(document.createElement("div"));

      if (doc.data && doc.data.reference) {
        ref
          .html(doc.data.reference + '<br>')
          .append('a')
            .html('&rarr;&nbsp;' + _self.refAuthorYear(doc))
            .attr('href', _self.refUrl(doc))
            .attr('target', '_blank');
      } else {
        ref
          .html(_self.refAuthorTitleYear(doc) + '<br>')
          .append('a')
            .html('&rarr;&nbsp;' + _self.refAuthorYear(doc))
            .attr('href', _self.refUrl(doc))
            .attr('target', '_blank');
      }

      return ref;
    }

    this.createMedia = function(doc) {
      var card = d3.select(document.createElement("div"))

      card.classed('media ml-3', true);

      var thumbnailUrl;
      // create image wrapper
      if (doc.data && doc.data.embed && doc.data.embed.thumbnail_url) {
        thumbnailUrl = doc.data.embed.thumbnail_url;
        if(doc.data.embed.thumbnail_url.indexOf('/assets/') === 0) {
          thumbnailUrl =  _self.relativePath + doc.data.embed.thumbnail_url;
        }
      } else if(doc.thumbnail) {
        thumbnailUrl = doc.thumbnail;
        if(thumbnailUrl.indexOf('/assets/') === 0) {
          thumbnailUrl =  _self.relativePath + thumbnailUrl;
        }
      }

      if(thumbnailUrl) {
        card.append('div')
          .classed('mr-3', true)
          .append('a')
          .attr('href', doc.url)
          .classed('media-image', true)
          .style('background-image', 'url('+ thumbnailUrl + ')');
      }
      // create body
      var cardBody = card
        .append('div')
        .classed('media-body', true);

      // title
      cardBody
        .append('h5').html('<a href="'+ doc.url +'" target="_blank">' + doc.title + '</a>');
      if (doc.data && doc.data.author && doc.data.author.length) {
        cardBody.append('p')
          .text(_self.refAuthorYear(doc));
      } else if (doc.data && doc.data.embed && doc.data.embed.author_name) {
        cardBody.append('p')
          .text(doc.data.embed.author_name+ ', ' + doc.data.year);
      }
      return card
    }

    this.createCard = function(doc) {
      var card = d3.select(document.createElement("div"))

      card.classed('card', true);

      var thumbnailUrl;
      // create image wrapper
      if (doc.data && doc.data.embed && doc.data.embed.thumbnail_url) {
        thumbnailUrl = doc.data.embed.thumbnail_url;
        if(doc.data.embed.thumbnail_url.indexOf('/assets/') === 0) {
          thumbnailUrl =  _self.relativePath + doc.data.embed.thumbnail_url;
        }
      } else if(doc.thumbnail) {
        thumbnailUrl = doc.thumbnail;
        if(thumbnailUrl.indexOf('/assets/') === 0) {
          thumbnailUrl =  _self.relativePath + thumbnailUrl;
        }
      }

      if(thumbnailUrl) {
        card.append('img')
          .classed('card-img-top', true)
          .attr('src', thumbnailUrl);
      }
      // create body
      var cardBody = card
        .append('div')
        .classed('card-body', true);

      // title
      if(doc.url) {
        cardBody
          .append('h5').html('<a href="'+ doc.url +'" target="_blank">' + doc.title + '</a>');
      }
      if (doc.data && doc.data.author && doc.data.author.length) {
        cardBody.append('p')
          .text(_self.refAuthorYear(doc));
      } else if (doc.data && doc.data.embed && doc.data.embed.author_name) {
        cardBody.append('p')
          .text(doc.data.embed.author_name+ ', ' + doc.data.year);
      } else if (doc.title){
        cardBody.append('p')
          .classed('card-text', true)
          .text(doc.title)
      }
      return card
    }

    this.createBlock = function(doc) {
      var card = d3.select(document.createElement("div"))

      card.classed('media media-block ml-3', true);

      // create image wrapper
      if (doc.data) {
        var blockImage = card.append('div')
          .classed('mr-3', true)
          .append('a')
          .attr('href', doc.url)
          .classed('media-image', true);

        if(doc.attachment) {
          blockImage.style('background-image', 'url('+ _self.relativePath + doc.attachment + ')');
        }

      }
      // create body
      var cardBody = card
        .append('div')
        .classed('media-body', true);

      // title
      cardBody
        .append('h5').html('<a href="'+ doc.url +'" target="_blank">' + doc.title + '</a>');
      if (doc.data && doc.data.embed && doc.data.embed.author_name) {
        cardBody.append('p')
          .text(doc.data.embed.author_name+ ', ' + doc.data.year);

      } else if (doc.author) {
        cardBody.append('p')
          .text(doc.author+ ', ' + doc.data.year);
      }
      return card
    }
  }

  window.poole = new Poole();
  poole.log('new Poole() ready');
})();
