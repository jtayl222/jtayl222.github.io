---
# Mr. Green Jekyll Theme (https://github.com/MrGreensWorkshop/MrGreen-JekyllTheme)
# Copyright (c) 2022 Mr. Green's Workshop https://www.MrGreensWorkshop.com
# Licensed under MIT

layout: default
# certifications page
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}

{%- assign cert_data = page.page_data | default: site.data.content.certifications[lng].page_data -%}

{%- assign cert_container_style = nil -%}
{%- if cert_data.main.img -%}
  {%- capture cert_container_style -%} style="background-image:url('{{ cert_data.main.img }}');" {%- endcapture -%}
{%- elsif cert_data.main.back_color %}
  {%- capture cert_container_style -%} style="background-color:{{ cert_data.main.back_color }};" {%- endcapture -%}
{%- endif %}

<div class="multipurpose-container project-heading-container" {{cert_container_style}}>
{%- assign color_style = nil -%}
{%- if cert_data.main.text_color -%}
  {%- capture color_style -%} style="color:{{ cert_data.main.text_color }};" {%-endcapture-%}
{%- endif %}
  <h1 {{ color_style }}>{{ cert_data.main.header | default: "Certifications" }}</h1>
  <p {{ color_style }}>{{ cert_data.main.info | default: "Professional certifications and credentials" }}</p>
  {% if cert_data.main.credly_profile %}
  <div class="multipurpose-button-wrapper" style="margin-bottom: 20px;">
    <a href="{{ cert_data.main.credly_profile }}" target="_blank" role="button" class="multipurpose-button" style="background-color:#ff6b00; color: white; text-decoration: none;">{{ cert_data.main.credly_text | default: "View Credly Profile" }}</a>
  </div>
  {% endif %}
  <div class="multipurpose-button-wrapper">
  {% for category in cert_data.category %}
    <a href="#{{ category.type }}" role="button" class="multipurpose-button project-buttons" style="background-color:{{ category.color }};">{{ category.title }}</a>
  {% endfor %}
  </div>
</div>

{% for category in cert_data.category -%}
  {%- capture first_category_id -%} id="{{ category.type }}" {%-endcapture-%}
  {% for list in cert_data.list -%}
    {%- if list.type != category.type %}{% continue %}{% endif -%}
    <div class="multipurpose-container project-container" {{ first_category_id }}>
      {%-assign first_category_id=nil -%}
      {%- include multi_lng/get-localized-long-date-format.liquid date = list.date -%}
      <div class="row">
        <div class="col-md-12 project-header">
          <h1>{{ list.cert_name }}</h1><h2>{{ list.cert_excerpt }}</h2>
          <div class="meta-container">
            <p class="date"><i class="fa fa-calendar fa-fw" aria-hidden="true"></i>&nbsp;{{ list.date | date: out_date_format }}</p>
            <p class="category">#{{ category.title }}</p>
          </div>
          <hr>
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <div class="read-more"><i class="fa fa-angle-double-down fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].certifications.read_more_text }}</div>
            <div class="read-less"><i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].certifications.read_less_text }}</div>
          </a>
        </div>
      </div>
      <div class="row">
        <div class="markdown-style">
          {{ list.post | markdownify }}
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].certifications.read_less_text }}
          </a>
        </div>
      </div>
    </div>
  {% endfor -%}
{% endfor %}