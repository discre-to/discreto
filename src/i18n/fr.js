/**    _ _                 _
 *  __| (_)___ __ _ _ ___ | |_ ___
 * / _` | (_-</ _| '_/ -_)|  _/ _ \
 * \__,_|_/__/\__|_| \___(_)__\___/
 *
 * Copyright (c) 2022 - MIT License
 * Greg Deback <greg@discre.to>
 * <https://discre.to>
 *
 * French
 */

export const fr = {

  // Messages
   msg: {
    first:  "<p><strong>Nous respectons votre vie privée</strong>, et c'est \
pourquoi nous ne collectons pour l'instant que des statistiques anonymisées \
de votre visite.</p><p>Vous pouvez <strong>Continuer</strong> votre navigation \
ainsi, <strong>Tout accepter</strong> ou définir vos \
<strong>Préférences</strong>.</p>",
    dnt:    "<p><strong>Nous respectons votre vie privée, et vous avez \
activé l'option <em>Do Not Track</em></strong> de votre naviguateur, aussi \
aucun service n'a pour l'instant été activé.</p><p>Vous pouvez pour ce site \
autoriser la collecte de statistiques anonymisées (<strong>Discreto</strong>), \
<strong>Tout accepter</strong> ou définir vos \
<strong>Préférences</strong>.</p>",
    prefs:  "<p><strong>Choisissez les services que vous souhaitez activer \
sur ce site</strong>, puis cliquez sur <strong>Enregistrer</strong>.</p>\
<p>Vous pouvez n'autoriser que les statistiques anonymisées \
(<strong>Anonyme</strong>), ou même désactiver tous les services \
(<strong>Invisible</strong>).</p>",
    cookie: "<p><strong>Vous avez activé {active} service(s)</strong> sur \
{total}.</p><p>Cliquez sur <strong>Préférences</strong> pour modifier vos \
choix.</p>",
    anon:   "<p><strong>Vous naviguez anonymement</strong>, avec {active} \
service(s) activé(s) sur {total}.</p><p>Cliquez sur \
<strong>Préférences</strong> pour modifier vos choix.</p>",
    ghost:  "<p><strong>Vous êtes actuellement invisible</strong> et aucun \
service n'a été activé.</p><p>Cliquez sur <strong>Préférences</strong> pour \
modifier vos choix.</p>",
    more:   "<p><strong>Afin d'améliorer la qualité de nos \
services</strong>, nous avons ajouté {more} service(s).</p><p>Vous pouvez \
le(s) <strong>Accepter</strong>, le(s) <strong>Refuser</strong> ou définir vos \
<strong>Préférences</strong>.</p>",
    remote: "<p><strong>Vos préférences ont été reprises de vos choix \
précédents</strong>, avec {active} service(s) activé(s) sur {total}.</p>\
<p>Vous pouvez <strong>Continuer</strong> ainsi, n'activer sur ce site que les \
statistiques anonymisées (<strong>Discreto</strong>), ou définir vos \
<strong>Préférences</strong>.</p>",
    almost: "<p><strong>Vos préférences ont été reprises de vos choix \
précédents</strong>, mais {more} autre(s) service(s) sur ce site nécessite(nt) \
votre consentement.</p><p>Vous pouvez le(s) <strong>Accepter</strong>, le(s) \
<strong>Refuser</strong> ou définir vos <strong>Préférences</strong>.</p>",
    error:  "<p>Impossible de récupérer les informations, veuillez \
ré-essayer.</p>",
    thanks: "Merci <a target=\"_blank\" href=\"https://discre.to\" \
rel=\"nofollow\">discreto</a> (<a target=\"_blank\" \
href=\"https://discre.to/abuse\" rel=\"nofollow\">signaler un abus</a>)",
    undef:  "<big>🤕</big><p>Aucun consentement n'est prévu pour {title}, \
cette fenêtre a été bloquée&nbsp;:<br/>{src}</p>",
    choose: "<big>🤔</big><p>Acceptez les conditions du service {title} pour \
afficher la fenêtre&nbsp;:<br/>{src}</p>",
    block:  "<big>🤫</big><p>Vous avez choisi de bloquer les fenêtres \
{title}</p>",
  },

  // Buttons
  btns: {
    continue:  "Continuer",
    discreto:  "Discreto",
    prefs:     "Préférences",
    cognito:   "Tout accepter",
    incognito: "Tout refuser",
    anonymous: "Anonyme",
    ghost:     "Invisible",
    save:      "Enregistrer",
    ok:        "OK",
    allow:     "Accepter",
    deny:      "Refuser",
    keep:      "Continuer",
    about:     "à propos",
    cookie:    "en savoir plus",
    domains:   "domaines",
    share:     "en savoir plus",
    once:      "Accepter",
    always:    "Toujours accepter sur ce site",
    force:     "Afficher tout de même"
  },

  // Options
  options: {
    cookie:  "Cookie de consentement",
    domains: "Appliquer pour tous nos domaines",
    share:   "Enregistrer mes choix sur discre.to"
  },

  // Infos
  about: {
    unknown: "<p>La description de ce service est manquante, veuillez le \
signaler au webmaster du site.</p>",
    _discreto: "<p>Afin de se souvenir de vos choix, un cookie est déposé \
dans votre navigateur. Il ne contient aucune information personnelle vous \
concernant.</p>\
<p>Ce cookie, nommé <code>{name}</code>, est valable {days} jours.</p>\
<p><strong>Ce service est indispensable et ne peut être désactivé.</strong></p>"
  },

  // Types
  types: {
    audience:  "Mesure d'audience",
    social:    "Partage et réseaux sociaux",
    media:     "Lecteurs audio/vidéo",
    reader:    "Lecteurs de document",
    ads:       "Ciblage publicitaire",
    comments:  "Commentaires",
    misc:      "Divers",
    advanced:  "Options"
  },

  // Services
  services: {
    // Audience
    'analytics-anon':    "Google Analytics (IP anonymisée)",
    analytics:           "Google Analytics",
    'analyticsGA-anon':  "Google Analytics (IP anonymisée)",
    analyticsGA:         "Google Analytics",
    'matomo-anon':       "Matomo (anonymisé)",
    matomo:              "Matomo",
    hotjar:              "HotJar (anonymisé)",
    koban:               "Koban",
    mautic:              "Mautic",
    facebookPixel:       "Facebook Pixel",
    twitterPixel:        "Twitter Pixel",
    xiti:                "Xiti",
    'xiti-anon':         "Xiti (anonymisé)",
    yahooDot:            "Verizon Analytics",
    verizon:             "Verizon Analytics",
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
    'adsense-optout':    "AdSense (sans ciblage)",
    adsense:             "AdSense",
    adwords:             "AdWords",
    amazonAds:           "Amazon",
    criteo:              "Criteo",
    linkedinInsight:     "LinkedIn Insight & Conversion",
    microsoftAds:        "Microsoft Advertising (ex Bing Ads)",
    twitterAds:          "Twitter Ads",
    // Social
    facebook:            "Partage Facebook",
    linkedin:            "Partage LinkedIn",
    twitter:             "Partage Twitter",
    pinterest:           "Partage Pinterest",
    // Comments
    disqus:              "Commentaires Disqus",
    facebookComments:    "Facebook Comments",
    // Misc
    'googleMaps-api':    "Google Maps (API)",
    googleMaps:          "Google Maps (embed)",
    googleFonts:         "Google Fonts",
    optimize:            "Google Optimize",
    typekit:             "TypeKit",
    recaptcha:           "Google ReCaptcha (v3)",
    recaptchaV2:         "Google ReCaptcha (v2)"
  }

}
