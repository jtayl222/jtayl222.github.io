/*! Mr. Green Jekyll Theme (https://github.com/MrGreensWorkshop/MrGreen-JekyllTheme)
 *  Copyright (c) 2022 Mr. Green's Workshop https://www.MrGreensWorkshop.com
 *  Licensed under MIT
*/

 

 

(function () {
  'use strict';

  $(function () {
    $(document).click(function (e) {
      var $navbar = $(".top-nav-buttons");
      var _opened = $navbar.hasClass("in");

      if (_opened === true && $(e.target).parents('.top-nav-buttons').length == 0) {
        $navbar.collapse('hide');
      }
    });
  });

})();

 

(function () {
  'use strict';

  $(function () {
     
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover',
      delay: { show: 500, hide: 100 }
    });

     
    var tooltipHideTmr;
    $('[data-toggle="tooltip"]:not([data-tooltip-no-hide])').on('inserted.bs.tooltip', function () {
      clearTimeout(tooltipHideTmr);
      tooltipHideTmr = setTimeout(function () {
        $('[data-toggle="tooltip"]').tooltip('hide');
      }, 2000);
    });
  });

})();

 

(function () {
  'use strict';

  var globals = {
    showToolTip: showToolTip
  };

  function showToolTip(targetElement, str) {
    if (targetElement === null) return;
    if (!str || str.length === 0) return;
    let elm = $(targetElement);
     
    let oldTooltip = elm.attr('data-original-title');
     
    elm.attr('data-original-title', str).tooltip('show');
     
    elm.attr('data-original-title', oldTooltip);
  }

  (function (window) {
    window.showToolTip = globals.showToolTip;
  })(window);

})();


 

 

(function () {
  'use strict';

   
  function themeToSwitch(checkBox) {
    if (checkBox == null) return;
     
    const colorSetting = localStorage.getItem(colorScheme.storageKey) || document.body.getAttribute(colorScheme.modeAttr);
     
    checkBox.checked = ((colorSetting == null) || (colorSetting == colorScheme.mode.light)) ? false : true;
     
    checkBox.addEventListener("change", switchToTheme);
  }

   
  function switchToTheme(e) {
    const colorSetting = e.target.checked ? colorScheme.mode.dark : colorScheme.mode.light;
    document.body.setAttribute(colorScheme.modeAttr, colorSetting);
    localStorage.setItem(colorScheme.storageKey, colorSetting);
    synchronizeCheckBoxes(e.target);
  }

   
  function synchronizeCheckBoxes(checkBox) {
    if (switches == null) return;
    switches.forEach(function (item) {
      if (item == checkBox) return;
      item.checked = checkBox.checked;
    });
  }

  function initColorSchemeSwitch() {
    switches = document.querySelectorAll('.checkbox_color_switch');
    if (switches == null || switches == "undefined" || switches?.length == 0) return;
     
    switches.forEach(themeToSwitch);
  }

  var switches;
  document.addEventListener("DOMContentLoaded", initColorSchemeSwitch);

})();


 

(function () {
  'use strict';

  let rootElement = document.querySelector(':root');
  let sideNavElement = document.getElementById('side-nav-container');
  let closeButton =  document.querySelector('.side-nav-close');
  let sideNavHr = document.querySelector('.side-nav > hr:first-of-type');
  let topNavToggleElement = document.querySelector('.top-nav-menu-toggle');
  let sideNav = document.querySelector('.side-nav');
  let sideNavWidthVar = '--side-nav-width';
  let sideNavWidthDefVar = '--side-nav-width-def';
  let sideNavHeightVar = '--side-nav-bottom-buttons-container-height';

  function ToggleShowHide() {
    let topNavOn = parseInt(window.getComputedStyle(rootElement).getPropertyValue(sideNavWidthVar)) == 0 ? true : false;
    if (topNavOn == true) {
      let sideNavOn = parseInt(window.getComputedStyle(sideNavElement).getPropertyValue('left')) == 0 ? true : false;
      let sideNavWidth = parseInt(window.getComputedStyle(rootElement).getPropertyValue(sideNavWidthDefVar));
      let sideNavHeight = parseInt(window.getComputedStyle(rootElement).getPropertyValue(sideNavHeightVar));
       
      if ( sideNavOn == false ) {
        sideNavElement.style.left = '0px';
        if (closeButton) {
           
          closeButton.style.display = 'inherit';
          let middleOfButton = parseInt(window.getComputedStyle(closeButton).getPropertyValue('height')) / 2;
          closeButton.style.top = (sideNavHr.getBoundingClientRect().y - middleOfButton)  + 'px';
           
        }
         
        if (navigator.userAgent.toLowerCase().match(/mobile/i)) {
          sideNav.style.minHeight = (window.innerHeight - sideNavHeight) + 'px';
        }
       
      } else {
        sideNavElement.style.left = (sideNavWidth * -1) + 'px';
        if (closeButton) {
          closeButton.style.display = 'none';
        }
      }
    }
  }

   
  topNavToggleElement.addEventListener('click', ToggleShowHide);

   
  window.addEventListener('click', function(e) {
    let outsideClicked = (sideNavElement.contains(e.target) == false);
    let sideNavOn = parseInt(window.getComputedStyle(sideNavElement).getPropertyValue('left')) == 0 ? true : false;
    let topNavOn = parseInt(window.getComputedStyle(rootElement).getPropertyValue(sideNavWidthVar)) == 0 ? true : false;
    if (outsideClicked && sideNavOn && topNavOn) {
      ToggleShowHide();
    }
  });

   
  if (closeButton) {
    closeButton.addEventListener('click', ToggleShowHide);
  }

   
  window.addEventListener('resize', function(e) {
    sideNavElement.style.removeProperty('left');
    if (closeButton) {
      let topNavOn = parseInt(window.getComputedStyle(rootElement).getPropertyValue(sideNavWidthVar)) == 0 ? true : false;
      if ( topNavOn == false ) {
        closeButton.style.removeProperty('display');
        closeButton.style.removeProperty('left');
      }
    }
  });

})();


 

 

(function () {
  'use strict';

   
  $.easing.easeInOutCubic = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  };

  $(function () {
    const stat = { on: 1, off: 2 };
    let status = stat.off;
    const button = $("#scroll-to-top");

    button.on("click keypress", function (e) {
      $('html,body').animate(
        { scrollTop: 0 }
        , 600
        , 'easeInOutCubic'
      );
      return false;
    });

    button.hover(function () {
      $(this).animate({ 'opacity': '1' }, 300);
    }, function () {
      $(this).animate({ 'opacity': '0.4' }, 300);
    });

    $(window).scroll(function () {
      if ($(this).scrollTop() > 10) {
        if (status == stat.off) {
          status = stat.on;
          button.css({
            'display': 'block'
            , 'opacity': '0.4'
          });
        }
      } else {
        if (status == stat.on) {
          status = stat.off;
          button.fadeOut();
        }
      }
    });
  });

})();





   

(function () {
  'use strict';

  var globals = {
    isLocalStorageAvailable: isLocalStorageAvailable
    , isSessionStorageAvailable: isSessionStorageAvailable
  };

  function isLocalStorageAvailable() {
    return storageAvailable('localStorage');
  }

  function isSessionStorageAvailable() {
    return storageAvailable('sessionStorage');
  }

  function storageAvailable(type) {
    var storage;
    try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  }

  (function (window) {
    window.storageChk = globals;
  })(window);

})();

   

(function () {
  'use strict';

  var globals = {
    currentPageLng: ""
    , supportedLngList: []
    , existLng: []
    , disableExtTranslationOffer: false
    , saveAndClose: saveAndClose
    , storageKey: "doNotOfferLanguages"
    , slidingBoxId: "lang-offer-id"
    , slideType: ""
    , styleClass: "lang-offer"
  };

  function saveAndClose() {
    localStorage.setItem(globals.storageKey, true);
    if (globals.disableExtTranslationOffer) toggleExtTranslationOffer(false);
    SlidingMsgBox.hide(globals.slidingBoxId);
  }

   
  function toggleExtTranslationOffer(toggle) {
    if (toggle) {
      $('html').attr('translate', 'no');
      $('html').attr('class', 'notranslate');
      $('head').append('<meta name="google" content="notranslate" />');
    } else {
      $('html').removeAttr('translate');
      $('html').removeAttr('class');
      $('head > meta[name="google"][content="notranslate"]').remove();
    }
  }

  $(function () {
    let msgHtml = null;
     
     
    if (storageChk.isLocalStorageAvailable() && !localStorage.getItem(globals.storageKey)) {
      let userLangMatch = null;

      for (let browserLng of navigator.languages) {
        if (browserLng.startsWith(globals.currentPageLng)) {
          userLangMatch = true;
          break;
        }
      }

      var exists = function (arr, search) {
        return arr.some(row => row.includes(search));
      };

      let userLngMatchList = [];
      for (let browserLng of navigator.languages) {
        for (let supportedLng of globals.supportedLngList) {
          if (browserLng.startsWith(supportedLng[0])) {
            if (!exists(userLngMatchList, supportedLng[0])) userLngMatchList.push(supportedLng);
          }
        }
      }

      if (userLangMatch == null && userLngMatchList.length > 0) {
        if (globals.disableExtTranslationOffer) toggleExtTranslationOffer(true);

         
        let title = '<h5>';
        for (let i = 0; i < userLngMatchList.length; i++) {
          title += userLngMatchList[i][5];
          if (i != userLngMatchList.length - 1) title += ', ';
        }
        title += '</h5><br>';
        msgHtml = title;

        for (let i = 0; i < userLngMatchList.length; i++) {
          let matchLng = userLngMatchList[i];
          let foundMatch = null;
          for (let item of globals.existLng) {
            if (matchLng[0] == item[0]) {
              msgHtml += '&nbsp;<a href="' + item[2] + '" onclick="LangOfferMsgBox.saveAndClose();">' + matchLng[3] + '</a>';
              foundMatch = true;
            }
          }
          if (foundMatch == null) {
            msgHtml += '&nbsp;<a href="' + matchLng[2] + '" onclick="LangOfferMsgBox.saveAndClose();">' + matchLng[4] + '</a>';
          }

          if (i != userLngMatchList.length - 1) msgHtml += '<br><br>';
        };

        msgHtml = '<div class="' + globals.styleClass + '">' + msgHtml + '</div>';
        SlidingMsgBox.init(globals.slidingBoxId, msgHtml, saveAndClose, globals.slideType);
        SlidingMsgBox.show(globals.slidingBoxId);
      }
    }
  });

  (function (window) {
    window.LangOfferMsgBox = globals;
  })(window);

})();





   

(function () {
  'use strict';

  var globals = {
    msgBoxSelector: ".slideBox"
    , msgBoxMsgClass: "msg"
    , msgBoxCloseClass: "close-button"
    , slideEndSelector: "slideBoxEnd"
    , html: ""
    , show: show
    , hide: hide
    , init: init
    , setMsgHtml: setMsgHtml
    , setCloseCallBack: setCloseCallBack
    , slideTypes: { TopToDown: "slideBoxTopToDown", BottomToUp: "slideBoxBottomToUp" }
  };

  function getMsgBoxSelector(id) {
    return '#' + id + ' > ' + globals.msgBoxSelector;
  }

  function getMsgBoxElement(id) {
    return document.querySelector(getMsgBoxSelector(id));
  }

  function init(id, msgHtml, closeCallBack, slideType) {
     
    let holderElement = document.getElementById(id);
    if (holderElement) holderElement.remove();

    setBoxHtml(id);
    setMsgHtml(id, msgHtml, slideType);
    setCloseCallBack(id, closeCallBack);
  }

  function setMsgHtml(id, msgHtml, slideType) {
    let msgBoxElement = getMsgBoxElement(id);
     
    msgBoxElement.classList.toggle(slideType);
     
    let oldMsgElement = msgBoxElement.getElementsByClassName(globals.msgBoxMsgClass)[0];
    if (oldMsgElement) oldMsgElement.remove();
     
    let newMsgElement = document.createElement("div");
    newMsgElement.className = globals.msgBoxMsgClass;
    newMsgElement.innerHTML = msgHtml;
     
    msgBoxElement.appendChild(newMsgElement);
  }

  function setCloseCallBack(id, callBack) {
    let msgBoxElement = getMsgBoxElement(id);
    let closeButton = msgBoxElement.getElementsByClassName(globals.msgBoxCloseClass)[0];
    closeButton.addEventListener('click', callBack);
  }

  function show(id) {
    let msgBoxElement = getMsgBoxElement(id);
    msgBoxElement.style.display = 'inherit';
    setTimeout(function () { msgBoxElement.classList.toggle(globals.slideEndSelector); }, 50);
  }

  function hide(id) {
    let msgBoxElement = getMsgBoxElement(id);
    msgBoxElement.classList.toggle(globals.slideEndSelector);
    setTimeout(function () { msgBoxElement.style.display = 'none'; }, 400);
  }

  function setBoxHtml(id) {
    let boxHolderDiv = document.createElement("div");
    boxHolderDiv.id = id;
    boxHolderDiv.innerHTML = globals.html;
    document.body.appendChild(boxHolderDiv);
  }

  (function (window) {
    window.SlidingMsgBox = globals;
  })(window);

})();



   

(function () {
  'use strict';

  const debug = 0;
  let logger = function () { };
  if (debug == 1) {
    logger = function (str) { console.log(str); };
  }

  var globals = {
    consent_items: {}
    , consentBarHtml: ""
    , consentSettingHtml: ""
    , hideConsentBarWithSaveButton: false
    , consentSettingSlideType: ""
    , gtag: function () { }
    , getConsentSettings: getConsentSettings
    , hideConsentBar: hideConsentBar
    , consentSettingDone: consentSettingDone
    , consentBarDone: consentBarDone
    , showSettings: showSettings
  };

  const consentBarSelector = '.consent-bar';
  const footerHeight = '--footer-height';
  const footerSelector = '.footer-container';
  const storageKey = "cookieConsentDone";
  const slidingBoxId = "cookie-consent-id";
  const cookieNamePrefix = "cookieConsent";
  let settingsVisible = false;

  function getConsentSettings() {
    let consent_settings = {};
    for (const key of Object.keys(globals.consent_items)) {
      let items = globals.consent_items[key];
      let local_val = localStorage.getItem(cookieNamePrefix + key);
      if (local_val) items.value = local_val;
      for (const sub_key of Object.keys(items)) {
        if (sub_key == "value" || sub_key == "no_check_box" ) continue;
        let sub_items = items[sub_key];
        if (sub_key == "group") {
          for (const lst of sub_items) {
            Object.assign(consent_settings, { [lst]: items.value });
          }
        } else {
          Object.assign(consent_settings, { [sub_key]: sub_items });
        }
      }
    }
    return consent_settings;
  }

  function showConsentBar() {
    if (localStorage.getItem(storageKey)) return;
    let box = document.querySelector(consentBarSelector);
    let footerElement = document.querySelector(footerSelector);
    let rootElement = document.querySelector(':root');
    let position = window.getComputedStyle(footerElement).getPropertyValue('position');
    let offset = parseInt(window.getComputedStyle(rootElement).getPropertyValue(footerHeight));

    if (position == "fixed" || position == "sticky") {
      box.style.bottom = offset + 'px';
    }
    box.style.display = 'inherit';
  }

  function hideConsentBar() {
    let box = document.querySelector(consentBarSelector);
    box.style.bottom = (-1 * box.offsetHeight) + 'px';
    setTimeout(function () { box.style.display = 'none'; }, 400);
  }

  function consentSettingDone(button) {
    switch (button) {
      case "accept":
        acceptDenyAll(true);
        break;
      case "save":
        setConsents();
        break;
      case "deny":
        acceptDenyAll(false);
        break;
      default: logger("consentSettingDone undefined parameter");
    }
    hideSettings();
  }

  function consentBarDone(button) {
    switch (button) {
      case "accept":
        acceptDenyAll(true);
        break;
      case "settings":
        showSettings();
        break;
      case "deny":
        acceptDenyAll(false);
        break;
      default: logger("consentBarDone undefined parameter");
    }
    hideConsentBar();
  }

  function showSettings() {
    if (settingsVisible) return;
    initSwitches();
    SlidingMsgBox.show(slidingBoxId);
    settingsVisible = true;
  }

  function hideSettings() {
    SlidingMsgBox.hide(slidingBoxId);
    showConsentBar();
    settingsVisible = false;
  }

  function acceptDenyAll(value) {
    let consent_diff = {};
    const set_value = (value == true) ? "granted" : "denied";
    for (const key of Object.keys(globals.consent_items)) {
      let items = globals.consent_items[key];
      if (items.no_check_box == true) continue;
      for (const lst of items.group) {
        Object.assign(consent_diff, { [lst]: set_value });
      }
      localStorage.setItem(cookieNamePrefix + key, set_value);
      items.value = set_value;
    }
    logger(consent_diff);
    globals.gtag('consent', 'update', consent_diff);
    localStorage.setItem(storageKey, true);
  }

  function setConsents() {
    let consent_diff = {};
    let switches = document.querySelectorAll('.checkbox_switch[data-consent]');
    if (switches?.length == 0) return;
    for (const checkBox of switches) {
      const chk_key = checkBox.getAttribute('data-consent');
      const chk_val = (checkBox.checked == true) ? "granted" : "denied";
      let items = globals.consent_items[chk_key];
      if (chk_val != items.value) {
        for (const key of items.group) {
          Object.assign(consent_diff, { [key]: chk_val });
        }
        localStorage.setItem(cookieNamePrefix + chk_key, chk_val);
        items.value = chk_val;
      }
    }
    if (Object.keys(consent_diff).length > 0) {
      logger(consent_diff);
      globals.gtag('consent', 'update', consent_diff);
      localStorage.setItem(storageKey, true);
    }
    if (globals.hideConsentBarWithSaveButton) localStorage.setItem(storageKey, true);
  }

  function initSwitches() {
    let switches = document.querySelectorAll('.checkbox_switch[data-consent]');
    if (switches?.length > 0) {
      for (const checkBox of switches) {
        const chk_key = checkBox.getAttribute('data-consent');
        let local_val = localStorage.getItem(cookieNamePrefix + chk_key);
        if (local_val) checkBox.checked = (local_val == "granted") ? true : false;
      }
    }
  }

  function initConsent() {
     
    let barHolderDiv = document.createElement("div");
     
    barHolderDiv.innerHTML = globals.consentBarHtml;
    document.body.appendChild(barHolderDiv);

     
    SlidingMsgBox.init(slidingBoxId, globals.consentSettingHtml, hideSettings, globals.consentSettingSlideType);

    showConsentBar();
  }

  document.addEventListener("DOMContentLoaded", initConsent);

  (function (window) {
    window.CookieConsent = globals;
  })(window);

})();


 

















   

(function () {
  'use strict';

  $(function () {
    let home_heading = $(".home-heading");

    if (home_heading.length > 0) {
      home_heading.hide();
      home_heading.fadeIn("slow");
    }
  });

})();




   

(function () {
  'use strict';

  $(function () {
    let readMoreLess = $(".read-more-less");

    if (readMoreLess.length > 0) {
      readMoreLess.click(function () {
        let element = $(this).parent().parent().parent().find('.markdown-style');

        let read_more = $(this).parent().parent().parent().find('.read-more-less').children('.read-more');
        let read_less = $(this).parent().parent().parent().find('.read-more-less').children('.read-less');

        if (element.css('display') == 'none') {
          read_more.hide();
          read_less.show();
        } else {
          read_more.show();
          read_less.hide();
        }
        element.slideToggle();
      });
    }
  });

})();

 

 
function copyToClipboard(text, success_msg) {
  let tooltipElm = '#copytoclipboard';
  if (!text || text.length === 0) return;

   
  if (typeof (navigator.clipboard) != 'undefined') {
    navigator.clipboard.writeText(text).then(function () {
      showToolTip(tooltipElm, success_msg);
    }, function (err) {
      showToolTip(tooltipElm, 'Copy Error!');
    });
  } else {
     
    const $obj = $("<input>");
    $("body").append($obj);
    $obj.val(text).select();
    document.execCommand("copy");
    $obj.remove();
    showToolTip(tooltipElm, success_msg);
  }
}
 

(function () {
  'use strict';

  let panelSelector = '.movable';
  let panelHeaderSelector = '.panel-heading';

  function mouseEventInit(panel, header) {
    if (panel == null || header == null) return;
    let currentX = 0, currentY = 0;

    function mouseDownEvent(e) {
      e.preventDefault();
      currentX = e.offsetX;
      currentY = e.offsetY;
      document.onmouseup = mouseUpEvent;
      document.onmousemove = mouseMoveEvent;
    }

    function mouseMoveEvent(e) {
      e.preventDefault();
      let limitX = e.clientX - currentX;
      let limitY = e.clientY - currentY;

      if (limitX < 0) limitX = 0;
      if (limitY < 0) limitY = 0;
      if (panel.offsetWidth > window.innerWidth - e.clientX + currentX) {
        limitX = window.innerWidth - panel.offsetWidth;
      }
      let headerOffset = panel.offsetHeight - header.offsetHeight;
      if (panel.offsetHeight > window.innerHeight - e.clientY + currentY + headerOffset) {
        limitY = window.innerHeight - panel.offsetHeight + headerOffset;
      }

      panel.style.left = limitX + "px";
      panel.style.top = limitY + "px";
    }

    function mouseUpEvent(e) {
      document.onmouseup = null;
      document.onmousemove = null;
    }

    header.onmousedown = mouseDownEvent;
  }

  function touchEventToMouseEvent(event) {
    let touch = event.changedTouches[0];
    touch.target.dispatchEvent(
      new MouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
      }[event.type], {
        bubbles: true, cancelable: true, view: window, detail: 1,
        screenX: touch.screenX, screenY: touch.screenY, clientX: touch.clientX, clientY: touch.clientY,
        ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, button: 0, relatedTarget: null
      })
    );
  }

  function touchEventToMouseEventInit(panel) {
    if (panel == null) return;
    panel.addEventListener("touchstart", touchEventToMouseEvent);
    panel.addEventListener("touchmove", touchEventToMouseEvent);
    panel.addEventListener("touchend", touchEventToMouseEvent);
    panel.addEventListener("touchcancel", touchEventToMouseEvent);
  }

  function movablePanelsInit() {
     
    let panel_list = document.querySelectorAll(panelSelector);
    if (panel_list == null || panel_list == "undefined") return;

    panel_list.forEach(function (panel) {
       
      panel.addEventListener('touchmove', function (e) {
        e.preventDefault();
      });

       
      touchEventToMouseEventInit(panel);

       
      mouseEventInit(panel, panel.querySelector(panelHeaderSelector));
    });
  }

  document.addEventListener("DOMContentLoaded", movablePanelsInit);

})();
 

(function () {
  'use strict';

  $(function () {
    let tocContainer = $("#toc-container");

    if (tocContainer.length > 0) {
      function InitToc() {
         
        if (typeof Toc === "undefined") return false;

        const tocNavSelector = '#table-of-contents';
        const tocOutputTarget = $(tocNavSelector);
        const tocInputSource = $(".main-container");

         
        if (Toc.helpers.getTopLevel(tocInputSource) <= 1) return false;
        Toc.init({
          $nav: tocOutputTarget
          , $scope: tocInputSource
        });
        $('body').scrollspy({
          target: tocNavSelector
        });

         
        let tocViewId = $("#toc-view-top");
        if (tocViewId.length > 0) {
           
          let tocViewIdBottom = (tocViewId.offset().top - $(window).scrollTop()) + tocViewId.outerHeight();
           
          tocContainer.css({ top: tocViewIdBottom + 'px' });
        }
        return true;
      }

      let ret = InitToc();
       
      if (ret == false) tocContainer.hide();
    }
  });

})();

  
     

 
(function () {
  'use strict';

  const debug = 0;
  let logger = function () { };
  if (debug == 1) {
    logger = function (str) { console.log(str); };
  }

  var globals = {
    setProperties: setProperties
    , buttonClick: buttonClick
  };

   
  const properties = {};
  properties.paginatorListContainerName = "";
   
  properties.pageCountLimit = 5;
   
  properties.autoLimit = true;
  properties.refreshDelay = 300;
  properties.pageList = [];
  properties.pageLinkHtml = '<li><a href=""></a></li>';
   
  properties.firstButtonName = " ";
  properties.lastButtonName = " ";
  properties.prevButtonName = " ";
  properties.nextButtonName = " ";
  properties.approxButtonWidth = 90;

  var activeNo = 0;
  var pageList = [];

  function isEmpty(value) {
    if (value === "" || value === null || typeof value === "undefined") return true;
    return false;
  }

  function setProperties(_properties) {
    for (var key in properties) {
      if (_properties.hasOwnProperty(key)) {
        properties[key] = _properties[key] || properties[key];
      } else if (isEmpty(properties[key])) {
        logger("Paginator Page Numbers, property key " + key + " doesn't have default value and not set in setProperties");
        continue;
      }
       
      if (isEmpty(properties[key])) {
        logger("Paginator Page Numbers, property is not set: " + key);
        continue;
      }
    }
     
    pageList = properties.pageList.slice();
  }

  function getPaginatorContainer(clean = false) {
    let resultList = $(properties.paginatorListContainerName);
     
    if (resultList.length == 1) {
       
      if (clean == true) resultList.empty();
      return resultList;
    } else {
      logger(properties.paginatorListContainerName + " > resultList obj not found.");
      return null;
    }
  }

  function addButton(text, url, addDisable, addActive = false) {
    if (text == " ") return "";
    let linkObj = $($.parseHTML(properties.pageLinkHtml)[0]);
    if (addDisable == true) linkObj.addClass("disabled");
    if (addActive == true) {
      linkObj.addClass("active");
       
      url = "javascript:void(0);";
    }
     
    linkObj.find("a").text(text).attr("href", url);
    linkObj.find("a").text(text).attr("role", "button");
    if (addActive == false && addDisable == false) {
      linkObj.find("a").attr("onclick", 'PagerPageNumbers.buttonClick(this);');
    }
    return linkObj;
  }

  function doAdjust() {
    let resultList = getPaginatorContainer(true);
    if (resultList == null) return;
    if (pageList.length <= 1) { logger("pageList.length <= 1"); return; }
    setPage(resultList);
    if (resultList.css('opacity') == 0) {
      resultList.animate({ opacity: '1' }, 100);
    }
  }

  function setPage(resultList) {
    if (activeNo <= 0) { activeNo = pageList.indexOf(window.location.pathname) + 1; logger("activeNo1 <= 0"); }
    if (activeNo <= 0) { logger("activeNo2 <= 0"); return; }

     
    resultList.append(addButton(properties.firstButtonName, pageList[0], (activeNo == 1)));

     
    let pageNo = activeNo - 1;
    pageNo = (pageNo <= 1) ? 1 : pageNo;
    resultList.append(addButton(properties.prevButtonName, pageList[pageNo - 1], (activeNo == 1)));

    let pageCountLimit = properties.pageCountLimit;

    if (properties.autoLimit === true) {
      pageCountLimit = ($(document).width() / properties.approxButtonWidth);
      pageCountLimit = Math.ceil(pageCountLimit);
    }

    if (pageCountLimit > pageList.length) pageCountLimit = pageList.length;
    let startIndex = activeNo;
    let endIndex = startIndex + pageCountLimit - 1;
    if (endIndex > pageList.length) {
       
      startIndex = startIndex - (endIndex - pageList.length);
      endIndex = startIndex + pageCountLimit - 1;
    }

    for (let i = startIndex; i <= endIndex; i++) {
      resultList.append(addButton(i, pageList[i - 1], false, (activeNo == i)));
    }

     
    pageNo = activeNo + 1;
    pageNo = (pageNo >= pageList.length) ? pageList.length : pageNo;
    resultList.append(addButton(properties.nextButtonName, pageList[pageNo - 1], (activeNo == pageList.length)));

     
    resultList.append(addButton(properties.lastButtonName, pageList[pageList.length - 1], (activeNo == pageList.length)));

     
  }

  $(function () {
    var resizeTmrId;
    var pageWidth = $(window).width();
    var pContainer = getPaginatorContainer();

    if (pContainer != null) {
      var objHeight = pContainer.height();

      $(window).resize(function () {
        if ($(this).width() !== pageWidth) {
           
          if (getPaginatorContainer().height() > objHeight) {
            getPaginatorContainer().css('opacity', '0');
          }
          clearTimeout(resizeTmrId);
          pageWidth = $(this).width();
          resizeTmrId = setTimeout(doAdjust, properties.refreshDelay);
        }
      });

      doAdjust();
      logger("PagerPageNumbers Debug");
    }
  });

  $(window).bind('post-query-done', function () {
    let page_cnt = PostQuery.getPageCount();
    pageList.length = 0;
    if (page_cnt > 0) {
      for (let i = 1; i < page_cnt + 1; i++) {
        pageList.push("javascript:PostQuery.pagerShow(" + i + ");");
      }
      activeNo = 1;
      doAdjust();
    } else if (page_cnt == -1) {
       
       
      pageList = properties.pageList.slice();
      activeNo = 0;
      doAdjust();
    } else {
      logger("page_cnt: " + page_cnt);
    }
  });

  function buttonClick(e) {
    activeNo = pageList.indexOf(e.href) + 1;
    if (activeNo > 0) doAdjust();
  }

  (function (window) {
    window.PagerPageNumbers = globals;
  })(window);

}());

 
