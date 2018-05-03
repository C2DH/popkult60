---
layout: post
title:  "First post"
category: event
activelink: /blog/
date: 2018-03-26
figure:
  - src: posts/coronet1953february2a.jpg
    caption: Example of a look into the future with a tangible interface
  - src: posts/coronet1953february2a.jpg
    caption: Example of a look into the future with a tangible interface

---

**First post**

This is an example of what a blog post will look like on the blog page of the website.
<!-- more -->

It can be on any topics and is an easy way to share information.

{% assign figure=page.figure[0] %}{% include figure.html %}

Figure 1:

{% assign figure=page.figure[1] %}{% include figure.html %}
