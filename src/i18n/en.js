/**    _ _                 _
 *  __| (_)___ __ _ _ ___ | |_ ___
 * / _` | (_-</ _| '_/ -_)|  _/ _ \
 * \__,_|_/__/\__|_| \___(_)__\___/
 *
 * Copyright © 2020 - MIT License
 * Greg Deback <greg@discre.to>
 * <https://discre.to>
 *
 * English
 */

export const en = {

  // Messages
  msg: {
    first:  "<p><strong>We respect your privacy</strong>, which is why we only \
collect anonymized statistics of your visit at this time.</p><p>You can \
<strong>Continue</strong> browsing this way, <strong>Accept \
all</strong> services or set your <strong>Preferences</strong>.</p>",
    dnt:    "<p><strong>We respect your privacy, and you have activated the \
<em>Do Not Track</em> option of your browser</strong>, so no service has yet \
been enabled.</p><p>You can authorize anonymized statistics of your visit \
on this site (<strong>Discreto</strong>), <strong>Accept all</strong> or set \
your <strong>Préférences</strong>.</p>",
    prefs:  "<p><strong>Choose the services you want to enable on this \
site</strong>, then click <strong>Save</strong>.</p><p>You can allow \
anonymized statistics only (<strong>Anonymous</strong>), or even disable all \
services (<strong>Invisible</strong>).</p>",
    cookie: "<p><strong>You have enabled {active} service(s)</strong> out of \
{total}.</p><p>Click <strong>Preferences</strong> to modify your choices.</p>",
    anon:   "<p><strong>Vous are currently browsing anonymously</strong>, with \
{active} service(s) enabled out of {total}.</p><p>Click \
<strong>Preferences</strong> to modify your choices.</p>",
    ghost:  "<p><strong>You are currently invisible</strong> with no service \
enabled.</p><p>Click <strong>Preferences</strong> to modify your choices.</p>",
    more:   "<p><strong>In order to improve the quality of our \
services</strong>, we have added {more} service(s).</p><p>You can \
<strong>Accept</strong> or <strong>Refuse</strong> them, or set your \
<strong>Preferences</strong>.</p>",
    remote: "<p><strong>Your preferences have been retrieved from your \
previous choices</strong>, avec {active} service(s) enabled out of {total}.</p>\
<p>You can <strong>Continue</strong> like this, allow only anonymous \
statistics of your visit on this site (<strong>Discreto</strong>), or set your \
<strong>Preferences</strong>.</p>",
    almost: "<p><strong>Your preferences have been retrieved from your \
previous choices</strong>, but {more} other service(s) on this site require(s) \
your consent.</p><p>You can <strong>Accept</strong> or <strong>Refuse</strong> \
them, or set your <strong>Preferences</strong>.</p>",
    error:  "<p>Cannot gather information about this service, please try again \
later.</p>",
    thanks: "Thank you <a target=\"_blank\" href=\"https://discre.to\" \
rel=\"nofollow\">discreto</a> (<a target=\"_blank\" \
href=\"https://discre.to/abuse\" rel=\"nofollow\">report abuse</a>)",
    undef:  "<big>🤕</big><p>No consent has been asked for {title}, this \
window has been blocked:<br/>{src}</p>",
    choose: "<big>🤔</big><p>Please accept {title} terms of service to show \
this window:<br/>{src}</p>",
    block:  "<big>🤫</big><p>You've chosen to block {title} windows</p>",
  },

  // Buttons
  btns: {
    continue:  "Continue",
    discreto:  "Discreto",
    prefs:     "Preferences",
    cognito:   "Accept all",
    incognito: "Refuse all",
    anonymous: "Anonymous",
    ghost:     "Invisible",
    save:      "Save",
    ok:        "OK",
    allow:     "Accept",
    deny:      "Refuse",
    keep:      "Continue",
    about:     "about",
    cookie:    "learn more",
    domains:   "domains",
    share:     "learn more",
    once:      "Accept",
    always:    "Always accept on this site",
    force:     "Accept anyway"
  },

  // Options
  options: {
    cookie:  "Consent cookie",
    domains: "Apply for all our domains",
    share:   "Save my preferences on discre.to"
  },

  // Infos
  about: {
    unknown: "<p>This service has no description yet, please report it to the \
webmaster.</p>",
    _discreto: "<p>In order to remember your choices on this device, a cookie \
is stored in your browser. It doesn't contain any personal information about \
you.</p><p>This cookie is named <code>{name}</code>, and is valid for {days} \
jours.</p><p><strong>This service is essential and cannot be \
disabled.</strong></p>"
  },

  // Types
  types: {
    audience:  "Audience measurement",
    social:    "Share and social networks",
    media:     "Media players",
    reader:    "Document viewers",
    ads:       "Advertising targeting",
    comments:  "Comments",
    misc:      "Miscellaneous",
    advanced:  "Options"
  },

  // Services
  services: {
    // Audience
    'analytics-anon':    "Google Analytics (IP anonymization)",
    analytics:           "Google Analytics",
    'analyticsGA-anon':  "Google Analytics (IP anonymization)",
    analyticsGA:         "Google Analytics",
    'matomo-anon':       "Matomo (anonymized)",
    matomo:              "Matomo",
    hotjar:              "HotJar (anonymized)",
    koban:               "Koban",
    mautic:              "Mautic",
    facebookPixel:       "Facebook Pixel",
    twitterPixel:        "Twitter Pixel",
    xiti:                "Xiti",
    'xiti-anon':         "Xiti (anonymized)",
    // Share
    addthis:             "AddThis",
    addtoany:            "AddToAny",
    sharethis:           "ShareThis",
    // Media
    'dailymotion-api':   "Dailymotion (API)",
    dailymotion:         "Dailymotion (embed)",
    'vimeo-api':         "Vimeo (API)",
    vimeo:               "Vimeo (embed)",
    'youtube-api':       "YouTube (API)",
    youtube:             "YouTube (embed)",
    'soundcloud-api':    "SoundCloud (API)",
    soundcloud:          "SoundCloud (embed)",
    // Reader
    calameo:             "Calameo",
    issuu:               "Issuu",
    prezi:               "Prezi",
    slideshare:          "Slideshare",
    // Ads
    'adsense-optout':    "AdSense (no targeting)",
    adsense:             "AdSense",
    adwords:             "AdWords",
    amazonAds:           "Amazon",
    criteo:              "Criteo",
    microsoftAds:        "Microsoft Advertising (ex Bing Ads)",
    twitterAds:          "Twitter Ads",
    // Social
    facebook:            "Share on Facebook",
    linkedin:            "Share on LinkedIn",
    twitter:             "Share on Twitter",
    pinterest:           "Share on Pinterest",
    // Comments
    disqus:              "Disqus comments",
    facebookComments:    "Facebook Comments",
    // Misc
    'googleMaps-api':    "Google Maps (API)",
    'googleMaps':        "Google Maps (embed)",
    googleFonts:         "Google Fonts",
    typekit:             "TypeKit",
    recaptcha:           "Google ReCaptcha (v3)",
    recaptchaV2:         "Google ReCaptcha (v2)"
  }

}
