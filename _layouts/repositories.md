---
# Mr. Green Jekyll Theme (https://github.com/MrGreensWorkshop/MrGreen-JekyllTheme)
# Copyright (c) 2022 Mr. Green's Workshop https://www.MrGreensWorkshop.com
# Licensed under MIT

layout: default
# repositories page
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}

{%- assign repo_data = page.page_data | default: site.data.content.repositories[lng].page_data -%}

{%- assign repo_container_style = nil -%}
{%- if repo_data.main.img -%}
  {%- capture repo_container_style -%} style="background-image:url('{{ repo_data.main.img }}');" {%- endcapture -%}
{%- elsif repo_data.main.back_color %}
  {%- capture repo_container_style -%} style="background-color:{{ repo_data.main.back_color }};" {%- endcapture -%}
{%- endif %}

<div class="multipurpose-container project-heading-container" {{repo_container_style}}>
{%- assign color_style = nil -%}
{%- if repo_data.main.text_color -%}
  {%- capture color_style -%} style="color:{{ repo_data.main.text_color }};" {%-endcapture-%}
{%- endif %}
  <h1 {{ color_style }}>{{ repo_data.main.header | default: "Repositories" }}</h1>
  <p {{ color_style }}>{{ repo_data.main.info | default: "GitHub repositories and code projects" }}</p>
  {% if repo_data.main.github_profile %}
  <div class="multipurpose-button-wrapper" style="margin-bottom: 20px;">
    <a href="{{ repo_data.main.github_profile }}" target="_blank" role="button" class="multipurpose-button" style="background-color:#333; color: white; text-decoration: none;">{{ repo_data.main.github_text | default: "View GitHub Profile" }}</a>
  </div>
  {% endif %}
  <div class="multipurpose-button-wrapper">
  {% for category in repo_data.category %}
    <a href="#{{ category.type }}" role="button" class="multipurpose-button project-buttons" style="background-color:{{ category.color }};">{{ category.title }}</a>
  {% endfor %}
  </div>
</div>

{% for category in repo_data.category -%}
  {%- capture first_category_id -%} id="{{ category.type }}" {%-endcapture-%}
  {% for list in repo_data.list -%}
    {%- if list.type != category.type %}{% continue %}{% endif -%}
    <div class="multipurpose-container project-container" {{ first_category_id }}>
      {%-assign first_category_id=nil -%}
      {%- include multi_lng/get-localized-long-date-format.liquid date = list.date -%}
      <div class="row">
        <div class="col-md-12 project-header">
          <h1>{{ list.repo_name }}</h1><h2>{{ list.repo_excerpt }}</h2>
          <div class="meta-container">
            <p class="date"><i class="fa fa-calendar fa-fw" aria-hidden="true"></i>&nbsp;{{ list.date | date: out_date_format }}</p>
            <p class="category">#{{ category.title }}</p>
          </div>
          <hr>
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <div class="read-more"><i class="fa fa-angle-double-down fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].repositories.read_more_text }}</div>
            <div class="read-less"><i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].repositories.read_less_text }}</div>
          </a>
        </div>
      </div>
      <div class="row">
        <div class="markdown-style">
          {{ list.post | markdownify }}
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].repositories.read_less_text }}
          </a>
        </div>
      </div>
    </div>
  {% endfor -%}
{% endfor %}