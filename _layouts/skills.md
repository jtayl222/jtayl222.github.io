---
# Mr. Green Jekyll Theme (https://github.com/MrGreensWorkshop/MrGreen-JekyllTheme)
# Copyright (c) 2022 Mr. Green's Workshop https://www.MrGreensWorkshop.com
# Licensed under MIT

layout: default
# skills page
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}

{%- assign skills_data = page.page_data | default: site.data.content.skills[lng].page_data -%}

{%- assign skills_container_style = nil -%}
{%- if skills_data.main.img -%}
  {%- capture skills_container_style -%} style="background-image:url('{{ skills_data.main.img }}');" {%- endcapture -%}
{%- elsif skills_data.main.back_color %}
  {%- capture skills_container_style -%} style="background-color:{{ skills_data.main.back_color }};" {%- endcapture -%}
{%- endif %}

<div class="multipurpose-container project-heading-container" {{skills_container_style}}>
{%- assign color_style = nil -%}
{%- if skills_data.main.text_color -%}
  {%- capture color_style -%} style="color:{{ skills_data.main.text_color }};" {%-endcapture-%}
{%- endif %}
  <h1 {{ color_style }}>{{ skills_data.main.header | default: "Technical Skills" }}</h1>
  <p {{ color_style }}>{{ skills_data.main.info | default: "Technical skills and expertise" }}</p>
  {% if skills_data.main.linkedin_profile %}
  <div class="multipurpose-button-wrapper" style="margin-bottom: 20px;">
    <a href="{{ skills_data.main.linkedin_profile }}" target="_blank" role="button" class="multipurpose-button" style="background-color:#0077b5; color: white; text-decoration: none;">{{ skills_data.main.linkedin_text | default: "View LinkedIn Profile" }}</a>
  </div>
  {% endif %}
  <div class="multipurpose-button-wrapper">
  {% for category in skills_data.category %}
    <a href="#{{ category.type }}" role="button" class="multipurpose-button project-buttons" style="background-color:{{ category.color }};">{{ category.title }}</a>
  {% endfor %}
  </div>
</div>

{% for category in skills_data.category -%}
  {%- capture first_category_id -%} id="{{ category.type }}" {%-endcapture-%}
  {% for list in skills_data.list -%}
    {%- if list.type != category.type %}{% continue %}{% endif -%}
    <div class="multipurpose-container project-container" {{ first_category_id }}>
      {%-assign first_category_id=nil -%}
      <div class="row">
        <div class="col-md-12 project-header">
          <h1>{{ list.skill_name }}</h1><h2>{{ list.skill_excerpt }}</h2>
          <div class="meta-container">
            <p class="category">#{{ category.title }}</p>
          </div>
          <hr>
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <div class="read-more"><i class="fa fa-angle-double-down fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].skills.read_more_text }}</div>
            <div class="read-less"><i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].skills.read_less_text }}</div>
          </a>
        </div>
      </div>
      <div class="row">
        <div class="markdown-style">
          {{ list.post | markdownify }}
          <a href="javascript:void(0);" class="read-more-less" role="button" rel="nofollow">
            <i class="fa fa-angle-double-up fa-fw" aria-hidden="true"></i>{{ site.data.lang[lng].skills.read_less_text }}
          </a>
        </div>
      </div>
    </div>
  {% endfor -%}
{% endfor %}