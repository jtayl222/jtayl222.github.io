---
# Mr. Green Jekyll Theme (https://github.com/MrGreensWorkshop/MrGreen-JekyllTheme)
# Copyright (c) 2022 Mr. Green's Workshop https://www.MrGreensWorkshop.com
# Licensed under MIT

layout: default
# ml-lifecycle page
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}

{%- assign lifecycle_data = page.page_data | default: site.data.content.ml-lifecycle[lng].page_data -%}

{%- assign lifecycle_container_style = nil -%}
{%- if lifecycle_data.main.img -%}
  {%- capture lifecycle_container_style -%} style="background-image:url('{{ lifecycle_data.main.img }}');" {%- endcapture -%}
{%- elsif lifecycle_data.main.back_color %}
  {%- capture lifecycle_container_style -%} style="background-color:{{ lifecycle_data.main.back_color }};" {%- endcapture -%}
{%- endif %}

<div class="multipurpose-container project-heading-container" {{lifecycle_container_style}}>
{%- assign color_style = nil -%}
{%- if lifecycle_data.main.text_color -%}
  {%- capture color_style -%} style="color:{{ lifecycle_data.main.text_color }};" {%-endcapture-%}
{%- endif %}
  <h1 {{ color_style }}>{{ lifecycle_data.main.header | default: "ML Life Cycle" }}</h1>
  <p {{ color_style }}>{{ lifecycle_data.main.info | default: "End-to-End MLOps Pipeline Implementation" }}</p>
  {% if lifecycle_data.main.github_link %}
  <div class="multipurpose-button-wrapper" style="margin-bottom: 20px;">
    <a href="{{ lifecycle_data.main.github_link }}" target="_blank" role="button" class="multipurpose-button" style="background-color:#28a745; color: white; text-decoration: none;">{{ lifecycle_data.main.github_text | default: "View GitHub Repository" }}</a>
  </div>
  {% endif %}
  <div class="multipurpose-button-wrapper">
  {% for category in lifecycle_data.category %}
    <a href="#{{ category.type }}" role="button" class="multipurpose-button project-buttons" style="background-color:{{ category.color }};">{{ category.title }}</a>
  {% endfor %}
  </div>
</div>

<!-- Architecture Overview - Always Visible -->
{%- for stage in lifecycle_data.lifecycle_stages -%}
  {%- if stage.type == 'id_overview' %}
  <div class="multipurpose-container project-container" id="{{ stage.type }}">
    <div class="row">
      <div class="col-md-12 project-header">
        <h1>{{ stage.stage_name }}</h1>
        <h2>{{ stage.stage_excerpt }}</h2>
        <div class="meta-container">
          <p class="category">#Overview</p>
        </div>
        <hr>
      </div>
    </div>
    <div class="row">
      <div class="markdown-style" style="display: block;">
        {{ stage.content | markdownify }}
      </div>
    </div>
  </div>
  {%- endif -%}
{%- endfor %}

<!-- ML Lifecycle Stages with Expand/Collapse -->
{% for category in lifecycle_data.category -%}
  {%- if category.type == 'id_overview' %}{% continue %}{% endif -%}
  {%- capture first_category_id -%} id="{{ category.type }}" {%-endcapture-%}
  {% for stage in lifecycle_data.lifecycle_stages -%}
    {%- if stage.type != category.type %}{% continue %}{% endif -%}
    <div class="multipurpose-container project-container" {{ first_category_id }}>
      {%-assign first_category_id=nil -%}
      <div class="row">
        <div class="col-md-12 project-header">
          <h1>{{ stage.stage_name }}</h1>
          <h2>{{ stage.stage_excerpt }}</h2>
          <div class="meta-container">
            <p class="category">#{{ category.title }}</p>
            {% if stage.technologies %}
            <div style="margin-top: 10px;">
              {% for tech in stage.technologies %}
              <span style="display: inline-block; background-color: #f0f0f0; padding: 3px 8px; margin: 2px; border-radius: 3px; font-size: 0.9em;">{{ tech }}</span>
              {% endfor %}
            </div>
            {% endif %}
          </div>
          <hr>
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <div class="read-more"><i class="fa fa-angle-double-down fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].ml-lifecycle.read_more_text | default: "Read more" }}</div>
            <div class="read-less"><i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].ml-lifecycle.read_less_text | default: "Read less" }}</div>
          </a>
        </div>
      </div>
      <div class="row">
        <div class="markdown-style">
          {{ stage.content | markdownify }}
          {% if stage.links %}
          <h3>📚 Related Resources</h3>
          <ul>
          {% for link in stage.links %}
            <li><a href="{{ link.url }}" target="_blank">{{ link.text }}</a></li>
          {% endfor %}
          </ul>
          {% endif %}
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].ml-lifecycle.read_less_text | default: "Read less" }}
          </a>
        </div>
      </div>
    </div>
  {% endfor -%}
{% endfor %}