---
# Mr. Green Jekyll Theme (https://github.com/MrGreensWorkshop/MrGreen-JekyllTheme)
# Copyright (c) 2022 Mr. Green's Workshop https://www.MrGreensWorkshop.com
# Licensed under MIT

layout: default
# publications page
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}

{%- assign publications_data = page.page_data | default: site.data.content.publications[lng].page_data -%}

{%- assign publications_container_style = nil -%}
{%- if publications_data.main.img -%}
  {%- capture publications_container_style -%} style="background-image:url('{{ publications_data.main.img }}');" {%- endcapture -%}
{%- elsif publications_data.main.back_color %}
  {%- capture publications_container_style -%} style="background-color:{{ publications_data.main.back_color }};" {%- endcapture -%}
{%- endif %}

<div class="multipurpose-container project-heading-container" {{publications_container_style}}>
{%- assign color_style = nil -%}
{%- if publications_data.main.text_color -%}
  {%- capture color_style -%} style="color:{{ publications_data.main.text_color }};" {%-endcapture-%}
{%- endif %}
  <h1 {{ color_style }}>{{ publications_data.main.header | default: "Publications" }}</h1>
  <p {{ color_style }}>{{ publications_data.main.info | default: "Published articles and technical writing" }}</p>
  {% if publications_data.main.medium_profile %}
  <div class="multipurpose-button-wrapper" style="margin-bottom: 20px;">
    <a href="{{ publications_data.main.medium_profile }}" target="_blank" role="button" class="multipurpose-button" style="background-color:#00ab6c; color: white; text-decoration: none;">{{ publications_data.main.medium_text | default: "View Medium Profile" }}</a>
  </div>
  {% endif %}
  <div class="multipurpose-button-wrapper">
  {% for category in publications_data.category %}
    <a href="#{{ category.type }}" role="button" class="multipurpose-button project-buttons" style="background-color:{{ category.color }};">{{ category.title }}</a>
  {% endfor %}
  </div>
</div>

{% for category in publications_data.category -%}
  {%- capture first_category_id -%} id="{{ category.type }}" {%-endcapture-%}
  {% for list in publications_data.list -%}
    {%- if list.type != category.type %}{% continue %}{% endif -%}
    <div class="multipurpose-container project-container" {{ first_category_id }}>
      {%-assign first_category_id=nil -%}
      {%- include multi_lng/get-localized-long-date-format.liquid date = list.date -%}
      <div class="row">
        <div class="col-md-12 project-header">
          {% if list.medium_url %}
            <h1><a href="{{ list.medium_url }}" target="_blank" style="color: inherit; text-decoration: none;">{{ list.article_name }}</a></h1><h2>{{ list.article_excerpt }}</h2>
          {% else %}
            <h1>{{ list.article_name }}</h1><h2>{{ list.article_excerpt }}</h2>
          {% endif %}
          <div class="meta-container">
            <p class="date"><i class="fa fa-calendar fa-fw" aria-hidden="true"></i>&nbsp;{{ list.date | date: out_date_format }}</p>
            <p class="category">#{{ category.title }}</p>
          </div>
          <hr>
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <div class="read-more"><i class="fa fa-angle-double-down fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].publications.read_more_text }}</div>
            <div class="read-less"><i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].publications.read_less_text }}</div>
          </a>
        </div>
      </div>
      <div class="row">
        <div class="markdown-style">
          {{ list.post | markdownify }}
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].publications.read_less_text }}
          </a>
        </div>
      </div>
    </div>
  {% endfor -%}
{% endfor %}