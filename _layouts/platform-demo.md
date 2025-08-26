---
# Mr. Green Jekyll Theme (https://github.com/MrGreensWorkshop/MrGreen-JekyllTheme)
# Copyright (c) 2022 Mr. Green's Workshop https://www.MrGreensWorkshop.com
# Licensed under MIT

layout: default
# platform-demo page
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}

{%- assign platform_data = page.page_data | default: site.data.content.platform-demo[lng].page_data -%}

{%- assign platform_container_style = nil -%}
{%- if platform_data.main.img -%}
  {%- capture platform_container_style -%} style="background-image:url('{{ platform_data.main.img }}');" {%- endcapture -%}
{%- elsif platform_data.main.back_color %}
  {%- capture platform_container_style -%} style="background-color:{{ platform_data.main.back_color }};" {%- endcapture -%}
{%- endif %}

<div class="multipurpose-container project-heading-container" {{platform_container_style}}>
{%- assign color_style = nil -%}
{%- if platform_data.main.text_color -%}
  {%- capture color_style -%} style="color:{{ platform_data.main.text_color }};" {%-endcapture-%}
{%- endif %}
  <h1 {{ color_style }}>{{ platform_data.main.header | default: "Platform Demo" }}</h1>
  <p {{ color_style }}>{{ platform_data.main.info | default: "Live MLOps platform demonstration" }}</p>
  {% if platform_data.main.github_link %}
  <div class="multipurpose-button-wrapper" style="margin-bottom: 20px;">
    <a href="{{ platform_data.main.github_link }}" target="_blank" role="button" class="multipurpose-button" style="background-color:#28a745; color: white; text-decoration: none;">{{ platform_data.main.github_text | default: "View GitHub Repository" }}</a>
  </div>
  {% endif %}
  <div class="multipurpose-button-wrapper">
  {% for category in platform_data.category %}
    <a href="#{{ category.type }}" role="button" class="multipurpose-button project-buttons" style="background-color:{{ category.color }};">{{ category.title }}</a>
  {% endfor %}
  </div>
</div>

{% for category in platform_data.category -%}
  {%- capture first_category_id -%} id="{{ category.type }}" {%-endcapture-%}
  {% for list in platform_data.list -%}
    {%- if list.type != category.type %}{% continue %}{% endif -%}
    <div class="multipurpose-container project-container" {{ first_category_id }}>
      {%-assign first_category_id=nil -%}
      <div class="row">
        <div class="col-md-12 project-header">
          {% if list.ansible_role_url %}
            <h1><a href="{{ list.ansible_role_url }}" target="_blank" style="color: inherit; text-decoration: none;">{{ list.component_name }}</a></h1><h2>{{ list.component_excerpt }}</h2>
          {% else %}
            <h1>{{ list.component_name }}</h1><h2>{{ list.component_excerpt }}</h2>
          {% endif %}
          <div class="meta-container">
            <p class="category">#{{ category.title }}</p>
          </div>
          <hr>
          {% if category.type != 'id_architecture' %}
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <div class="read-more"><i class="fa fa-angle-double-down fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].platform-demo.read_more_text }}</div>
            <div class="read-less"><i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].platform-demo.read_less_text }}</div>
          </a>
          {% endif %}
        </div>
      </div>
      <div class="row">
        <div class="markdown-style"{% if category.type == 'id_architecture' %} style="display: block;"{% endif %}>
          {{ list.post | markdownify }}
          {% if category.type != 'id_architecture' %}
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].platform-demo.read_less_text }}
          </a>
          {% endif %}
        </div>
      </div>
    </div>
  {% endfor -%}
{% endfor %}