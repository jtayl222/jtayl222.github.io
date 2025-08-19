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

<style>
  .cert-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px;
    margin-bottom: 40px;
  }
  
  .cert-item {
    position: relative;
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    background: white;
    display: flex;
    flex-direction: column;
  }
  
  .cert-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.2);
  }
  
  .cert-thumbnail-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 250px;
    background-color: white;
    padding: 10px;
    box-sizing: border-box;
  }
  
  .cert-thumbnail {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
  
  .cert-info {
    padding: 15px;
    background: white;
    text-align: center;
  }
  
  .cert-title {
    font-size: 14px;
    font-weight: bold;
    margin: 0;
    line-height: 1.4;
    color: #333;
  }
  
  .cert-date {
    font-size: 12px;
    opacity: 0.9;
    margin-top: 4px;
  }
  
  .cert-modal {
    display: none;
    position: fixed;
    z-index: 9999;
    padding-top: 50px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.9);
  }
  
  .cert-modal-content {
    margin: auto;
    display: block;
    max-width: 90%;
    max-height: 90vh;
  }
  
  .cert-modal-caption {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
    text-align: center;
    color: #ccc;
    padding: 10px 0;
  }
  
  .cert-modal-close {
    position: absolute;
    top: 15px;
    right: 35px;
    color: #f1f1f1;
    font-size: 40px;
    font-weight: bold;
    transition: 0.3s;
    cursor: pointer;
  }
  
  .cert-modal-close:hover,
  .cert-modal-close:focus {
    color: #bbb;
  }
  
  .cert-section {
    margin-bottom: 50px;
  }
  
  .cert-section-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    padding: 10px 20px;
    border-left: 4px solid;
  }
  
  .cert-download-btn {
    position: absolute;
    top: 15px;
    left: 35px;
    color: #f1f1f1;
    font-size: 18px;
    padding: 8px 16px;
    background-color: rgba(0,0,0,0.5);
    border: 1px solid #f1f1f1;
    border-radius: 4px;
    text-decoration: none;
    transition: 0.3s;
  }
  
  .cert-download-btn:hover {
    background-color: rgba(255,255,255,0.1);
    color: #bbb;
  }
  
  @media only screen and (max-width: 700px) {
    .cert-modal-content {
      width: 100%;
    }
    .cert-gallery {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
</style>

<div class="multipurpose-container project-heading-container" {{cert_container_style}}>
{%- assign color_style = nil -%}
{%- if cert_data.main.text_color -%}
  {%- capture color_style -%} style="color:{{ cert_data.main.text_color }};" {%-endcapture-%}
{%- endif %}
  <h1 {{ color_style }}>{{ cert_data.main.header | default: "Certifications" }}</h1>
  <p {{ color_style }}>{{ cert_data.main.info | default: "Professional certifications and credentials" }}</p>
  <div class="multipurpose-button-wrapper">
  {% for category in cert_data.category %}
    <a href="#{{ category.type }}" role="button" class="multipurpose-button project-buttons" style="background-color:{{ category.color }};">{{ category.title }}</a>
  {% endfor %}
  </div>
</div>

<!-- Modal for displaying full certificates -->
<div id="certModal" class="cert-modal" onclick="closeCertModal(event)">
  <span class="cert-modal-close" onclick="closeCertModal(event)">&times;</span>
  <a id="certDownloadBtn" class="cert-download-btn" href="#" download target="_blank">
    <i class="fa fa-download"></i> Download
  </a>
  <img class="cert-modal-content" id="certModalImg">
  <div class="cert-modal-caption" id="certModalCaption"></div>
</div>

<!-- Certificate Gallery Sections -->
{% for category in cert_data.category -%}
<div class="cert-section" id="{{ category.type }}">
  <h2 class="cert-section-title" style="border-color: {{ category.color }};">{{ category.title }}</h2>
  <div class="cert-gallery">
    {% for cert in cert_data.list -%}
      {%- if cert.type != category.type %}{% continue %}{% endif -%}
      <div class="cert-item" onclick="openCertModal('{{ cert.certificate }}', '{{ cert.cert_name }}', '{{ cert.pdf | default: cert.certificate }}')">
        <div class="cert-thumbnail-wrapper">
          <img src="{{ cert.thumbnail }}" alt="{{ cert.cert_name }}" class="cert-thumbnail" loading="lazy">
        </div>
        <div class="cert-info">
          <p class="cert-title">{{ cert.cert_name }}</p>
        </div>
      </div>
    {% endfor -%}
  </div>
</div>
{% endfor %}

<script>
function openCertModal(imagePath, certName, downloadPath) {
  var modal = document.getElementById("certModal");
  var modalImg = document.getElementById("certModalImg");
  var captionText = document.getElementById("certModalCaption");
  var downloadBtn = document.getElementById("certDownloadBtn");
  
  modal.style.display = "block";
  
  // Always show the image (either the original PNG or converted from PDF)
  modalImg.style.display = "block";
  modalImg.src = imagePath;
  
  // Update caption based on whether there's a PDF version
  if (downloadPath !== imagePath && downloadPath.toLowerCase().endsWith('.pdf')) {
    captionText.innerHTML = certName + '<br><small>PDF version available for download</small>';
  } else {
    captionText.innerHTML = certName;
  }
  
  // Set download link
  downloadBtn.href = downloadPath;
  var fileExt = downloadPath.toLowerCase().endsWith('.pdf') ? '.pdf' : '.png';
  downloadBtn.download = certName.replace(/[^a-z0-9]/gi, '_') + fileExt;
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden";
}

function closeCertModal(event) {
  // Only close if clicking on modal background or close button
  if (event.target.id === "certModal" || event.target.className === "cert-modal-close") {
    var modal = document.getElementById("certModal");
    modal.style.display = "none";
    // Re-enable body scroll
    document.body.style.overflow = "auto";
  }
}

// Close modal with ESC key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    var modal = document.getElementById("certModal");
    if (modal.style.display === "block") {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }
});
</script>