# Popkult60.eu
Welcome to the Jekyll powered website of the research project "Transnational popular
culture – Europe in the long 1960s". The project is supported by the Deutsche Forschungsgemeinschaft
(DFG) in Germany and the National Research Fund (FNR) in Luxembourg.

## development
We now use docker to sanely develop:
```
docker run --rm \
 -t -i  --volume="$PWD:/srv/jekyll" \
  --publish 4000:4000 \
  jekyll/jekyll \
  jekyll serve
```

You can use the [editor on GitHub](https://github.com/C2DH/popkult60/edit/master/README.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages, from the content in your Markdown files.


### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/C2DH/popkult60/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.
