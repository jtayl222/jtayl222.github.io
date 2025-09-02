---
# Mr. Green Jekyll Theme (https://github.com/MrGreensWorkshop/MrGreen-JekyllTheme)
# Copyright (c) 2022 Mr. Green's Workshop https://www.MrGreensWorkshop.com
# Licensed under MIT

layout: default
# new page
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}

{%- assign new_data = page.page_data | default: site.data.content.new[lng].page_data -%}

{%- assign new_container_style = nil -%}
{%- if new_data.main.img -%}
  {%- capture new_container_style -%} style="background-image:url('{{ new_data.main.img }}');" {%- endcapture -%}
{%- elsif new_data.main.back_color %}
  {%- capture new_container_style -%} style="background-color:{{ new_data.main.back_color }};" {%- endcapture -%}
{%- endif %}

<div class="multipurpose-container project-heading-container" {{new_container_style}}>
  <div class="header-content">
    <div class="header-main">
      <div class="download-resume-button-container">
        <a href="/assets/files/resume/Jeff_Taylor_July_24.pdf" target="_blank" class="download-resume-button">Download PDF Resume</a>
      </div>
      <h1 style="color:{{ new_data.main.text_color | default: 'white' }}">{{ new_data.main.header | default: "Title Placeholder" }}</h1>
      <p style="color:{{ new_data.main.text_color | default: 'white' }}">{{ new_data.main.title | default: "Subtitle placeholder" }}</p>
    </div>
    <div class="header-contacts">
      <ul>
      {% for contact in new_data.main.contacts %}
        <li>
          {% if contact.url %}
            <a href="{{ contact.url }}">{{ contact.label }}: {{ contact.value }}</a>
          {% else %}
            {{ contact.label }}: {{ contact.value }}
          {% endif %}
        </li>
      {% endfor %}
      </ul>
    </div>
  </div>
</div>

 
<div class="multipurpose-container resume-container">
  <div class="resume-body">
    <div class="resume-column resume-column-left markdown-style">
      {{ new_data.left_column | markdownify }}
    </div>
    <div class="resume-column resume-column-right markdown-style">
      {{ new_data.right_column | markdownify }}
    </div>
  </div>
  <div class="markdown-style" style="text-align: center; padding-top: 20px;">
    {{ new_data.footer_links | markdownify }}
  </div>
</div>