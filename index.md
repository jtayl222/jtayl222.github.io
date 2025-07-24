---
layout: home
# multilingual page pair id, this must pair with translations of this page. (This name must be unique)
lng_pair: id_home

# image for page specific usage
img: ":home-heading.jpg"
# publish date (used for seo)
# if not specified, site.time will be used.
#date: 2022-03-03 12:32:00 +0000

# for override items in _data/lang/[language].yml
#title: My title
#button_name: "My button"
# for override side_and_top_nav_buttons in _data/conf/main.yml
#icon: "fa fa-bath"

# seo
# if not specified, date will be used.
#meta_modify_date: 2022-03-03 12:32:00 +0000
# check the meta_common_description in _data/owner/[language].yml
#meta_description: ""

# optional
# please use the "image_viewer_on" below to enable image viewer for individual pages or posts (_posts/ or [language]/_posts folders).
# image viewer can be enabled or disabled for all posts using the "image_viewer_posts: true" setting in _data/conf/main.yml.
#image_viewer_on: true
# please use the "image_lazy_loader_on" below to enable image lazy loader for individual pages or posts (_posts/ or [language]/_posts folders).
# image lazy loader can be enabled or disabled for all posts using the "image_lazy_loader_posts: true" setting in _data/conf/main.yml.
#image_lazy_loader_on: true
# exclude from on site search
#on_site_search_exclude: true
# exclude from search engines
#search_engine_exclude: true
# to disable this page, simply set published: false or delete this file
# don't forget that this is root index.html. If you disable this, there will be no index.html page to open
#published: false
---

<div class="multipurpose-container" style="padding: 40px 0;">
  <div class="row">
    <div class="col-md-12 text-center">
      <h2 style="margin-bottom: 30px; color: #333;">MLOps Engineer & AI Infrastructure Specialist</h2>
      
      <div class="row" style="margin-bottom: 40px;">
        <div class="col-md-4">
          <div class="highlight-card" style="padding: 25px; margin: 10px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
            <h4 style="color: #007bff; margin-bottom: 15px;">🚀 Live Production Platform</h4>
          </div>
        </div>
        <div class="col-md-4">
          <div class="highlight-card" style="padding: 25px; margin: 10px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
            <h4 style="color: #28a745; margin-bottom: 15px;">📊 Proven Results</h4>
          </div>
        </div>
        <div class="col-md-4">
          <div class="highlight-card" style="padding: 25px; margin: 10px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #dc3545;">
            <h4 style="color: #dc3545; margin-bottom: 15px;">🎓 Enterprise Ready</h4>
          </div>
        </div>
      </div>
      
      <div class="row" style="margin-bottom: 30px;">
        <div class="col-md-8 mx-auto">
          <p style="font-size: 1.1em; color: #555; line-height: 1.6;">
            Building production-ready machine learning infrastructure with Kubernetes, Seldon Core, and automated MLOps workflows. 
            Specializing in fraud detection systems, model serving architectures, and scalable AI platforms.
          </p>
        </div>
      </div>
      
      <div class="action-buttons" style="margin-bottom: 40px;">
        <a href="{{ site.baseurl }}/tabs/platform-demo.html" class="btn btn-primary" style="margin: 10px; padding: 12px 25px; font-size: 1.1em; border-radius: 25px;">
          🔥 View Live Platform
        </a>
        <a href="{{ site.baseurl }}/tabs/publications.html" class="btn btn-success" style="margin: 10px; padding: 12px 25px; font-size: 1.1em; border-radius: 25px;">
          📚 Technical Articles
        </a>
        <a href="{{ site.baseurl }}/tabs/repositories.html" class="btn btn-info" style="margin: 10px; padding: 12px 25px; font-size: 1.1em; border-radius: 25px;">
          💻 GitHub Projects
        </a>
      </div>
    </div>
  </div>
</div>
