---
# Mr. Green Jekyll Theme (https://github.com/MrGreensWorkshop/MrGreen-JekyllTheme)
# Copyright (c) 2022 Mr. Green's Workshop https://www.MrGreensWorkshop.com
# Licensed under MIT

layout: default
# About page
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}

{%- assign about_container_style = nil -%}
{%- if page.img -%}
  {%- capture about_container_style -%} style="background-image:url('{{ page.img }}');" {%- endcapture -%}
{%- endif %}

<div class="multipurpose-container project-heading-container" {{about_container_style}}>
  <h1 style="color:white;">{{ site.data.owner[lng].brand }}</h1>
  <p style="color:white;">MLOps Engineer specializing in production-ready machine learning infrastructure and applications</p>
  <div style="margin-top: 20px;">
    <span style="background-color: #dc3545; color: white; padding: 10px 20px; border-radius: 25px; font-weight: bold; margin: 5px; display: inline-block; border: 2px solid white;">🛡️ SECURITY CLEARED</span>
    <span style="background-color: #28a745; color: white; padding: 10px 20px; border-radius: 25px; font-weight: bold; margin: 5px; display: inline-block; border: 2px solid white;">🎓 CARNEGIE MELLON</span>
    <span style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 25px; font-weight: bold; margin: 5px; display: inline-block; border: 2px solid white;">☁️ AWS CERTIFIED</span>
    <span style="background-color: #6f42c1; color: white; padding: 10px 20px; border-radius: 25px; font-weight: bold; margin: 5px; display: inline-block; border: 2px solid white;">🚀 AI/ML EXPERT</span>
  </div>
</div>

<div class="multipurpose-container">
  <div class="row">
    <div class="col-md-12">
      <div class="markdown-style">
        {{ content }}
        {%- if site.data.conf.main.contact_form.enable and site.data.conf.others.about.show_contact_form_button %}
          <a href="javascript:void(0);" class="btn-base " onclick="ContactForm.show();" role="button">{{ site.data.lang[lng].contact_form.button_name }}</a>
        {% endif -%}
      </div>
    </div>
  </div>
</div>
