---
# Mr. Green Jekyll Theme (https://github.com/MrGreensWorkshop/MrGreen-JekyllTheme)
# Copyright (c) 2022 Mr. Green's Workshop https://www.MrGreensWorkshop.com
# Licensed under MIT

layout: default
# resume page
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}

{%- assign resume_data = page.page_data | default: site.data.content.resume[lng].page_data -%}

{%- assign resume_container_style = nil -%}
{%- if resume_data.main.img -%}
  {%- capture resume_container_style -%} style="background-image:url('{{ resume_data.main.img }}');" {%- endcapture -%}
{%- elsif resume_data.main.back_color %}
  {%- capture resume_container_style -%} style="background-color:{{ resume_data.main.back_color }};" {%- endcapture -%}
{%- endif %}

<div class="multipurpose-container project-heading-container" {{resume_container_style}}>
{%- assign color_style = nil -%}
{%- if resume_data.main.text_color -%}
  {%- capture color_style -%} style="color:{{ resume_data.main.text_color }};" {%-endcapture-%}
{%- endif %}
  <h1 {{ color_style }}>{{ resume_data.main.header | default: "Resume" }}</h1>
  <p {{ color_style }}>{{ resume_data.main.info | default: "Professional experience and qualifications" }}</p>
  {% if resume_data.main.download_pdf %}
  <div class="multipurpose-button-wrapper" style="margin-bottom: 20px;">
    <a href="{{ resume_data.main.download_pdf }}" target="_blank" role="button" class="multipurpose-button" style="background-color:#007bff; color: white; text-decoration: none;">{{ resume_data.main.download_text | default: "Download PDF" }}</a>
  </div>
  {% endif %}
</div>

<div class="multipurpose-container project-container">
  <div class="row">
    <div class="col-md-12">
      <div class="markdown-style">
        {{ resume_data.content | markdownify }}
      </div>
    </div>
  </div>
</div>