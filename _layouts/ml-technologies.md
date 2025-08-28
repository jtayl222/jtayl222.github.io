---
# Mr. Green Jekyll Theme (https://github.com/MrGreensWorkshop/MrGreen-JekyllTheme)
# Copyright (c) 2022 Mr. Green's Workshop https://www.MrGreensWorkshop.com
# Licensed under MIT

layout: default
# ml-technologies page
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}

{%- assign tech_data = page.page_data | default: site.data.content.ml-technologies[lng].page_data -%}

{%- assign tech_container_style = nil -%}
{%- if tech_data.main.img -%}
  {%- capture tech_container_style -%} style="background-image:url('{{ tech_data.main.img }}');" {%- endcapture -%}
{%- elsif tech_data.main.back_color %}
  {%- capture tech_container_style -%} style="background-color:{{ tech_data.main.back_color }};" {%- endcapture -%}
{%- endif %}

<div class="multipurpose-container project-heading-container" {{tech_container_style}}>
{%- assign color_style = nil -%}
{%- if tech_data.main.text_color -%}
  {%- capture color_style -%} style="color:{{ tech_data.main.text_color }};" {%-endcapture-%}
{%- endif %}
  <h1 {{ color_style }}>{{ tech_data.main.header | default: "ML Technologies Stack" }}</h1>
  <p {{ color_style }}>{{ tech_data.main.info | default: "Complete technology inventory" }}</p>
  {% if tech_data.main.namespace_count %}
  <div style="text-align: center; margin: 20px 0;">
    <span style="background-color: rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 5px; display: inline-block;">
      <strong {{ color_style }}>{{ tech_data.main.namespace_count }}</strong>
    </span>
  </div>
  {% endif %}
</div>

<div class="multipurpose-container">
  <div class="row">
    <div class="col-md-12">
      <div class="markdown-style" style="padding: 30px;">
        {{ tech_data.content | markdownify }}
      </div>
    </div>
  </div>
</div>