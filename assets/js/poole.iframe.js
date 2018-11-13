(function(poole, d3) {
  "use strict"
  poole.plugins = poole.plugins || {};

  poole.plugins.iframe = function (id, src, type) {
    var iframeWrapper = d3.select(id);
    var iframeWrapperToggler = iframeWrapper.select('.iframe-wrapper--toggler');
    var vimeoPlayer;
    var ready = false;

    poole.log('plugins.iframe() ready:\n     id:',id,'\n     src:',src, '\n     type:', type, '\n     valid:', !!iframeWrapper.size());

    iframeWrapper.on('click', function() {
      poole.log('plugins.iframe() @click');
      if(ready) {
        // do play
        return;
      }
      ready = true;
      iframeWrapperToggler.style('display', 'none');
      var _iframe = iframeWrapper.append('iframe')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('frameborder', '0')
        .attr('webkitallowfullscreen', true)
        .attr('mozallowfullscreen', true)
        .attr('allowfullscreen', true)
        .attr('src', src);

      if(type == 'vimeo') {
        vimeoPlayer = new Vimeo.Player(_iframe.node());
        // player.setVolume(0);
        vimeoPlayer.play().then(function() {
          poole.log('video playing...')// the video was played
        }).catch(function(err) {
          console.error(err);
        });

      } else {
        _iframe.attr('src', src);
      }

    });
  };

})(window.poole, window.d3);
