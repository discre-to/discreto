/**    _ _                 _
 *  __| (_)___ __ _ _ ___ | |_ ___
 * / _` | (_-</ _| '_/ -_)|  _/ _ \
 * \__,_|_/__/\__|_| \___(_)__\___/
 *
 * Copyright (c) 2022 - MIT License
 * Greg Deback <greg@discre.to>
 * <https://discre.to>
 *
 * Services
 */
'use strict'

export const js = {}

let
  w = window,
  d = document

/**
 * @warning Don't use lambda function () => {} to queue arguments (gtag, fbq,
 * twq, uetq, mt...), as trackers are expecting items to be of type Object or
 * Arguments (arguments is of type Arguments, ...args of type... Array).
 */

/**
 * Nothing (embedded iframes, DOM, script, images)
 */
js.nil = {}

/**
 * Custom script.
 * Load custom scripts in async mode
 */
js.script = {

  // Load scripts
  start: (srcs) => {
    srcs.forEach((src) => {
      let script = d.createElement('script')
      script.setAttribute('async', true)
      script.src = src
      js.box.appendChild(script)
    })
  }

}

/**
 * Custom HTML.
 * Inject custom HTML in discreto container (`<aside id="discreto">`)
 * or in container specified by its ID (`ids: { html: "containerId" }`)
 */
js.html = {

  // Select container
  init: (id) => {
    if (id) js.html.box = d.getElementById(id)
    if (!js.html.box) js.html.box = js.box
    return null
  },

  // Inject HTML
  start: (htmls) => {
    htmls.forEach((html) => {
      let template = d.createElement('template'),
          div      = d.createElement('div'),
          scripts  = []
      html = html.replace(/<script>(.*)<\/script>/g, (line, code) => {
        scripts.push(code)
        return ''
      })
      template.innerHTML = html
      div.appendChild(template.content)
      scripts.forEach((code) => {
        let script = d.createElement('script')
        script.innerHTML = code
        div.appendChild(script)
      })
      js.html.box.appendChild(div)
    })
  }

}

/**
 * iFrame loader
 * Append hidden iframe in document body & set up a communication link
 * using `postMessage/onmessage`
 */
js.iframe = {

  // iFrames
  frames: [],

  // iFrame template
  init: (id) => {
    js.iframe.template = d.createElement('iframe')
    js.iframe.template.className = 'noscript'
    return null
  },

  // Start
  start: (srcs) => {
    srcs.forEach((src) => {
      let iframe = js.iframe.template.cloneNode(true)
      iframe.src = src
      js.iframe.frames.push(iframe)
      js.box.appendChild(iframe)
    })
  },
  send: (evt) => {
    // @todo restrict to same origin as origin
    js.iframe.frames.forEach((frame) => {
      frame.contentWindow.postMessage(evt, '*')
    })
  }

}

/**
 * Google Tag Manager
 *
 * @version gtm.js
 * @see     https://developers.google.com/tag-manager/quickstart
 *
 * @exclude gtag
 *
 * (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
 * new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
 * j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
 * 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
 * })(window,document,'script','dataLayer','GTM-XXXX');</script>
 */
js.gtm = {

  // Init
  init: (id) => {
    let now = new Date().getTime()
    w.dataLayer = w.dataLayer = []
    w.dataLayer.push({ event: 'gtm.js', 'gtm.start': now })
    // @warning don't define gtag() here: gtag/js !== gtm.js
    // if (!w.gtag) w.gtag = function () { w.dataLayer.push(arguments) }
    return "https://www.googletagmanager.com/gtm.js?id=" + id
  },

  // Start services
  start: (services) => {
    w.dataLayer.push({
      event: 'discreto',
      service: '|' + services.join('|') + '|'
    })
  }

}

/**
 * Google Tag (GTag)
 *
 * @version gtag.js
 * @see     analytics
 * @see     adwords
 */
js.gtag = {

  anon: false,

  // Init
  init: (id, anon) => {
    if (anon) js.gtag.anon = true
    if (w.gtag) return null // load only once
    w.dataLayer = w.dataLayer || [];
    let n = w.gtag = function () { w.dataLayer.push(arguments) }
    n('js', new Date())
    return "https://www.googletagmanager.com/gtag/js?id=" + id
  },

  // Start
  start: (tracks) => {
    tracks.forEach((track) => {
      let o = js.gtag.anon ? { anonymize_ip: true } : {}
      w.gtag('config', track, o)
    })
  },

  // Track events
  track: (action, label, value) => {
    w.gtag('event', action, {
      event_category: 'discreto',
      event_label:    label,
      value
    })
  }

}

/**
 * Google Analytics
 *
 * @api     ga()
 * @version analytics.js
 * @see     https://developers.google.com/analytics/devguides/collection/analyticsjs/
 *
 * (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
 * (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
 * m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
 * })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
 * ga('create', 'UA-XXXXX-Y', 'auto');
 * ga('send', 'pageview');
 */
js.analyticsGA = {

  // Init
  init: (id, anon) => {
    if (w.ga) return null
    w.GoogleAnalyticsObject = 'ga'
    let n = w.ga = function () { n.q.push(arguments) }
    n.q = []
    n.l = 1*new Date()
    n('create', id, 'auto')
    if (anon) n('set', 'anonymizeIp', true)
    return "https://www.google-analytics.com/analytics.js"
  },

  // Start
  start: (tracks) => {
    tracks.forEach((track) => w.ga('send', track))
  },

  // Track events
  track: (action, label, value) => {
    w.ga('send', 'event', 'discreto', action, label, value)
  }

}

/**
 * Google Analytics (GTag)
 *
 * @api     gtag()
 * @version gtag.js
 * @see     https://developers.google.com/analytics/devguides/collection/gtagjs
 */
js.analytics = {

  init: js.gtag.init,
  start: js.gtag.start,
  track: js.gtag.track

}

/**
 * Matomo
 *
 * @see https://developer.matomo.org/guides/tracking-javascript-guide
 *
 * var _paq = window._paq || [];
 * _paq.push(['trackPageView']);
 * _paq.push(['enableLinkTracking']);
 * (function() {
 * var u="//{$MATOMO_URL}/";
 * _paq.push(['setTrackerUrl', u+'matomo.php']);
 * _paq.push(['setSiteId', {$IDSITE}]);
 * var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
 * g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
 * })();
 */
js.matomo = {

  // Init
  init: (opts, anon) => {
    let q = w._paq = w._paq || []
    q.push(['setTrackerUrl', opts.url + 'matomo.php']);
    q.push(['setSiteId', opts.id ])
    if (opts.url.charAt(opts.url.length - 1) !== '/')
      opts.url += '/'
    return (opts.cdn || opts.url) + "matomo.js"
  },

  // Events
  start: (tracks) => {
    tracks.forEach((track) => w._paq.push([ track ]))
  },

  // Track events
  track: (action, label, value) => {
    w._paq.push([ 'trackEvent', 'discreto', action, label, value ])
  }

}

/**
 * HotJar
 *
 * @see https://help.hotjar.com/hc/en-us/articles/115011639927-What-is-the-Hotjar-Tracking-Code-
 * @version 6
 *
 * (function(h,o,t,j,a,r){
 * h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
 * h._hjSettings={hjid:1,hjsv:5};
 * a=o.getElementsByTagName('head')[0];
 * r=o.createElement('script');r.async=1;
 * r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
 * a.appendChild(r);
 * })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
 */
js.hotjar = {

  // Init
  init: (id) => {
    if (w.hj) return null
    w._hjSettings = { hjid: id, hjsv: 6 }
    let n = w.hj = function() { n.q.push(arguments) }
    n.q = []
    return '//static.hotjar.com/c/hotjar-' + id + '.js?sv=6'
  }

}

/**
 * Facebook Pixel
 *
 * @see https://developers.facebook.com/docs/facebook-pixel/advanced/
 *
 * !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
 * n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
 * n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
 * t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
 * document,'script','https://connect.facebook.net/en_US/fbevents.js');
 * fbq('init', '<FB_PIXEL_ID>');
 * fbq('track', "PageView");
 */
js.facebookPixel = {

  // Standard events
  std: [
    'AddPaymentInfo', 'AddToCart', 'AddToWishlist', 'CompleteRegistration',
    'Contact', 'CustomizeProduct', 'Donate', 'FindLocation',
    'InitiateCheckout', 'Lead', 'Purchase', 'Schedule', 'Search',
    'StartTrial', 'SubmitApplication', 'Subscribe', 'ViewContent'
  ],

  // Init
  init: (id) => {
    if (w.fbq) return null
    let n = w.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!w._fbq) w._fbq  = n
    n.push    = n
    n.loaded  = true
    n.version = '2.0'
    n.queue   = []
    n('init', id)
    return "https://connect.facebook.net/en_US/fbevents.js"
  },

  // Send events
  start: (tracks) => {
    tracks.forEach((track) => {
      let std = js.facebookPixel.std.includes(track)
      w.fbq(std ? 'track' : 'trackCustom', track)
    })
  }

}

/**
 * Mautic
 *
 * @version 2.2
 * @since   1.4
 * @see     https://www.mautic.org/docs/fr/contacts/contact_monitoring.html
 *
 * (function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n;
 * w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),
 * m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
 * })(window,document,'script','http(s)://yourmautic.com/mtc.js','mt');
 * mt('send', 'pageview');
 */
js.mautic = {

  // Init
  init: (url) => {
    if (w.mt) return null
    w.MauticTrackingObject = 'mt'
    let n = w.mt = function () { n.q.push(arguments) }
    n.q = []
    // Anonymize?
    if (url.charAt(url.length - 1) !== '/')
      url += '/'
    return url + "mtc.js"
  },

  // Start
  start: (tracks) => {
    tracks.forEach((track) => w.mt('send', track))
  }

}

/**
 * Twitter Pixel
 *
 * @version 1.1 (universal)
 * @see     https://business.twitter.com/en/solutions/twitter-ads/website-clicks/set-up-conversion-tracking.html
 *
 * !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
 * },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
 * a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
 * // Insert Twitter Pixel ID and Standard Event data below
 * twq('init','TAG_ID');
 * twq('track','Pageview');
 */
js.twitterPixel = {

  init: (id) => {
    if (w.twq) return null
    var n = w.twq = () => { n.exe ? n.exe.apply(n, arguments) : n.queue.push(arguments) }
    n.version = '1.1'
    n.queue   = []
    n('init', id)
    return "//static.ads-twitter.com/uwt.js"
  },

  // Start
  start: (tracks) => {
    tracks.forEach((track) => w.twq('track', track))
  }

}

/**
 * Xiti
 *
 * Xt_param = 's={ID}&p=';
 * try {Xt_r = top.document.referrer;}
 * catch(e) {Xt_r = document.referrer; }
 * Xt_h = new Date();
 * Xt_i = '<img width="39" height="25" border="0" alt="" ';
 * Xt_i += 'src="http://logv2.xiti.com/hit.xiti?'+Xt_param;
 * Xt_i += '&hl='+Xt_h.getHours()+'x'+Xt_h.getMinutes()+'x'+Xt_h.getSeconds();
 * if(parseFloat(navigator.appVersion)>=4)
 * {Xt_s=screen;Xt_i+='&r='+Xt_s.width+'x'+Xt_s.height+'x'+Xt_s.pixelDepth+'x'+Xt_s.colorDepth;}
 * document.write(Xt_i+'&ref='+Xt_r.replace(/[<>"]/g, '').replace(/&/g, '$')+'" title="Internet Audience">');
 */
js.xiti = {

  opts: null,

  // Init
  init: (opts) => {
    // Compat with previous format
    if (typeof opts !== 'object') opts = { id: opts }
    if (!opts.url) opts.url = 'logv2'
    js.xiti.opts = opts
    let
    p = 's=' + opts.id + '&p=' + encodeURIComponent(d.location.pathname),
    h = new Date(), s = w.screen, i, r
    try { r = top.document.referrer } catch(e) { r = document.referrer }
    p += '&hl=' + h.getHours() + 'x' + h.getMinutes() + 'x' + h.getSeconds()
    if (parseFloat(navigator.appVersion) >= 4)
      p += '&r=' + s.width + 'x' + s.height + 'x' + s.pixelDepth + 'x' + s.colorDepth
    p += '&ref=' + r.replace(/[<>"]/g, '').replace(/&/g, '$')
    p += '&Rdt=On'
    i = new Image(39, 25)
    i.src = "http://" + opts.url + ".xiti.com/hit.xiti?" + p
    return null
  },

  // Track events
  track: (action, label, value) => {
    let
    opts = js.xiti.opts,
    p = 's=' + opts.id + '&pclick=' + encodeURIComponent(d.location.pathname),
    h = new Date(), i
    p += '&hl=' + h.getHours() + 'x' + h.getMinutes() + 'x' + h.getSeconds()
    p += '&click=A&p=discreto::' + action + '::' + label
    if (value !== undefined) p += '::' + value
    p += '&Rdt=On'
    i = new Image(39, 25)
    i.src = "http://" + opts.url + ".xiti.com/hit.xiti?" + p
  }

}

/**
 * Verizon Analytics
 *
 * @see https://developer.yahooinc.com/native/guide/dottags/installing-tags/
 *
 * (function(w,d,t,r,u){
 * w[u]=w[u]||[];w[u].push({'projectId':'{PROJECT_ID}','properties':{'pixelId':'{PIXEL_ID}'}});
 * var s=d.createElement(t);s.src=r;s.async=true;s.onload=s.onreadystatechange=function(){
 * var y,rs=this.readyState,c=w[u];if(rs&&rs!="complete"&&rs!="loaded"){return}
 * try{y=YAHOO.ywa.I13N.fireBeacon;w[u]=[];w[u].push=function(p){y([p])};y(c)}catch(e){}};
 * var scr=d.getElementsByTagName(t)[0],par=scr.parentNode;par.insertBefore(s,scr)})
 * (window,document,"script","https://s.yimg.com/wi/ytc.js","dotq");
 *
 */
js.yahooDot = js.verizon = {

  // Init
  init: (opts) => {
    w.dotq = w.dotq || []
    w.dotq.push({ projectId: opts.project, properties: { pixelId: opts.id } })
    return "https://s.yimg.com/wi/ytc.js"
  },

  // Onload
  onload: (script) => {
    var y, c = w.dotq
    console.warn('special case', YAHOO)
    try {
      y = YAHOO.ywa.I13N.fireBeacon
      w.dotq = []
      w.dotq.push = function(p) { y([ p ]) }
      y(c)
      console.warn('now', w.dotq)
    } catch(e) {}
  }

}

/**
 * Facebook widgets (buttons, comments)
 *
 * @version 3.0 (buttons), 5.0 (comments)
 * @see     https://developers.facebook.com/docs/plugins/share-button/?locale=fr_FR#example
 *
 * <div id="fb-root"></div>
 * (function(d, s, id) {
 * var js, fjs = d.getElementsByTagName(s)[0];
 * if (d.getElementById(id)) return;
 * js = d.createElement(s); js.id = id;
 * js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
 * fjs.parentNode.insertBefore(js, fjs);
 * }(document, 'script', 'facebook-jssdk'));</script>
 */
js.facebook = {

  init: (id, comments = false) => {
    let r = d.createElement('div'), v = comments ? '5.0' : '3.0'
    r.id = 'fb-root'
    d.body.appendChild(r)
    return {
      crossorigin: 'anonymous',
      id:  'facebook-jssdk',
      src: "https://connect.facebook.net/en_US/sdk.js"
        + "#xfbml=1&version=v" + v + "&appId=" + id
    }
  }

}

/**
 * LinkedIn share buttons
 *
 * @see https://docs.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/plugins/share-plugin
 */
js.linkedin = {

  init: () => "https://platform.linkedin.com/in.js"

}

/**
 * Pinterest
 *
 * @see https://help.pinterest.com/fr/business/article/save-button
 */
js.pinterest = {

  init: () => "//assets.pinterest.com/js/pinit.js"

}

/**
 * Twitter share button
 *
 * @see https://publish.twitter.com/?buttonType=TweetButton&widget=Button
 */
js.twitter = {

  init: () => "https://platform.twitter.com/widgets.js"

}

/**
 * Addthis
 *
 * @see https://www.addthis.com/academy/url-parameters/
 */
js.addthis = {

  init: (pubid) => {
    return "http://s7.addthis.com/js/300/addthis_widget.js"
      + "#domready=1&pubid=" + pubid
  },

  start: () => w.addthis.init()

}

/**
 * AddToAny
 *
 * @see https://www.addtoany.com/buttons/api/
 */
js.addtoany = {

  init: () => "https://static.addtoany.com/menu/page.js",

  start: () => w.a2a.init_all()

}

/**
 * ShareThis
 *
 * @see https://sharethis.com/support/customization/customize-sticky-share-button-urls/
 */
js.sharethis = {

  init: (prop) => {
    return "//platform-api.sharethis.com/js/sharethis.js#property=" + prop
      + "&product=custom-share-buttons"
  }

}

/**
 * DailyMotion
 *
 * @see https://developer.dailymotion.com/player/
 */
js.dailymotion = {

  init: () => "https://api.dmcdn.net/all.js"

}

/**
 * Vimeo
 *
 * @see https://developer.vimeo.com/player/sdk/basics
 */
js.vimeo = {

  init: () => "https://player.vimeo.com/api/player.js"

}

/**
 * YouTube API
 *
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
js.youtube = {

  init: () => "https://www.youtube.com/iframe_api"

}

/**
 * SoundCloud
 *
 * @see https://developers.soundcloud.com/docs/api/html5-widget#api
 */
js.soundcloud = {

  init: () => "https://w.soundcloud.com/player/api.js"

}

/**
 * AdSense with targeting
 *
 * @see https://support.google.com/adsense/answer/9190028
 * @see https://support.google.com/adsense/answer/7477845
 * @see https://support.google.com/admanager/answer/7678538
 *
 * <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
 * <!-- Homepage Leaderboard -->
 * <ins class="adsbygoogle"
 * style="display:inline-block;width:728px;height:90px"
 * data-ad-client="ca-pub-1234567890123456"
 * data-ad-slot="1234567890"></ins>
 * <script>
 * (adsbygoogle = window.adsbygoogle || []).push({});
 * (adsbygoogle = window.adsbygoogle || []).push({
 * google_ad_client: "ca-pub-123456789",
 * enable_page_level_ads: true
 * });
 * <ins class="adsbygoogle"
 * style="display:inline-block;width:728px;height:90px"
 * data-ad-slot="1234567890"></ins>
 */
js.adsense = {

  init: (client, anon) => {
    var n = w.adsbygoogle = w.adsbygoogle || []
    n.push({
      google_ad_client:      'ca-' + client,
      enable_page_level_ads: true
    })
    // Opt-out flag
    if (anon) n.requestNonPersonalizedAds = 1
    return "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  }

}

/**
 * AdWords
 *
 * @see gtag
 * @see https://support.google.com/google-ads/answer/6331314
 */
js.adwords = {

  init: js.gtag.init,
  start: js.gtag.start

}

/**
 * Amazon Ads
 *
 * @see https://affiliate-program.amazon.com/help/topic/t405
 * @deprecated
 *
 * Instead, use:
 * <script data-discreto="amazonAds"
 *         data-src="//z-na.amazon-adsystem.com/widgets/onejs"></script>
 */
js.amazonAds = {

  init: () => "//z-na.amazon-adsystem.com/widgets/onejs"

}

/**
 * Criteo
 *
 * @see https://support.criteo.com/s/article?article=202806921-Criteo-OneTag-on-your-Sales-Confirmation-page
 *
 * <script type="text/javascript" src="//static.criteo.net/js/ld/ld.js" async="true"></script>
 * <script type="text/javascript">
 * window.criteo_q = window.criteo_q || [];
 */
js.criteo = {

  init: () => {
    var n = w.criteo_q = w.criteo_q || []
    return "//static.criteo.net/js/ld/ld.js"
  }

}

/**
 * Microsoft Advertising (ex Bing Ads)
 *
 * @see https://about.ads.microsoft.com/fr-fr/resources/training/universal-event-tracking
 *
 * (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[] ,f=function(){var o={ti:"ID_DE_BALISE"};
 * o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")} ,n=d.createElement(t),n.src=r,n.async=1,
 * n.onload=n .onreadystatechange=function() {var s=this.readyState;s &&s!=="loaded"&&
 * s!=="complete"||(f(),n.onload=n. onreadystatechange=null)},i= d.getElementsByTagName(t)[0],
 * i. parentNode.insertBefore(n,i)})(window,document,"script"," //bat.bing.com/bat.js","uetq");
 */
js.microsoftAds = {

  init: (id) => {
    var n = w.uetq = w.uetq || []
    js.microsoftAds.id = id
    return "//bat.bing.com/bat.js"
  },

  start: (tracks) => {
    var o = { ti: js.microsoftAds.id, q: w.uetq }
    w.uetq = new UET(o)
    tracks.forEach((track) => w.uetq.push(track))
  }

}

/**
 * Twitter Ads
 *
 * @see twitterPixel
 */

/**
 * LinkedIn Insight & Conversion Tracking
 *
 * @see https://www.linkedin.com/help/lms/answer/a489169
 *
 * _linkedin_partner_id = "{LINKEDIN_ID}";
 * window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
 * window._linkedin_data_partner_ids.push(_linkedin_partner_id);
 * (function(){var s = document.getElementsByTagName("script")[0];
 * var b = document.createElement("script");
 * b.type = "text/javascript";b.async = true;
 * b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
 * s.parentNode.insertBefore(b, s);})();
 */
js.linkedinInsight = {

  init: (id) => {
    w._linkedin_partner_id = id
    w._linkedin_data_partner_ids = w._linkedin_data_partner_ids || []
    w._linkedin_data_partner_ids.push(id)
    return "https://snap.licdn.com/li.lms-analytics/insight.min.js"
  }

}

/**
 * Disqus
 *
 * @version universal
 * @see     https://disqus.com/admin/universalcode/
 *
 * var disqus_config = function () {
 * this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
 * this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
 * };
 * (function() {  // REQUIRED CONFIGURATION VARIABLE: EDIT THE SHORTNAME BELOW
 * var d = document, s = d.createElement('script');
 * s.src = 'https://EXAMPLE.disqus.com/embed.js';  // IMPORTANT: Replace EXAMPLE with your forum shortname!
 * s.setAttribute('data-timestamp', +new Date());
 * (d.head || d.body).appendChild(s);
 * })();
 */
js.disqus = {

  init: (name) => {

    w.disqus_config = function () {
      this.page.url = d.location.href
      this.page.identifier = d.location.pathname
    }
    return {
      'data-timestamp': +new Date(),
      src: "https://" + name + ".disqus.com/embed.js"
    }

  },

  start: (ids) => {

    let n = d.createElement('div')
    n.id = 'disqus_thread'
    d.getElementById(ids[0]).appendChild(n)

  }

}

/**
 * Google Maps API
 *
 * @see https://developers.google.com/maps/documentation/javascript/adding-a-google-map
 */
js.googleMaps = {

  init: (key) => "https://maps.googleapis.com/maps/api/js?key=" + key

}

/**
 * ReCaptcha
 *
 * @version 3
 * @see     https://developers.google.com/recaptcha/docs/v3
 */
js.recaptcha = {

  init: (key) => "https://www.google.com/recaptcha/api.js?render=" + key

}

/**
 * ReCaptcha
 *
 * @version 2
 * @see     https://developers.google.com/recaptcha/docs/invisible
 */
js.recaptchaV2 = {

  init: () => "https://www.google.com/recaptcha/api.js"

}

/**
 * Google Optimize
 */
js.optimize = {

  init: (key) => "https://www.googleoptimize.com/optimize.js?id=" + key

}
