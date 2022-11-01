/*!    _ _                 _
 *  __| (_)___ __ _ _ ___ | |_ ___
 * / _` | (_-</ _| '_/ -_)|  _/ _ \
 * \__,_|_/__/\__|_| \___(_)__\___/
 *
 * Copyright (c) 2022 - MIT License
 * Greg Deback <greg@discre.to>
 * <https://discre.to>
 */
'use strict'

// Import utils, i18n, conf & service loaders
import * as _   from './utils.js'
import { i18n } from './i18n/all.js'
import { conf } from './conf/defaults.js'
import { js }   from './conf/services.js'

const

  // Modes
  FIRST  = 'first',
  COOKIE = 'cookie',
  MORE   = 'more',
  REMOTE = 'remote',
  ALMOST = 'almost',
  PREFS  = 'prefs',
  SET    = [ COOKIE, REMOTE ],

  // Buttons
  BTNS   = {
    first:  'discreto|prefs|incognito|cognito',
    cookie: 'prefs|ok',
    remote: 'discreto|prefs|incognito|keep',
    more:   'deny|prefs|allow',
    almost: 'deny|prefs|allow',
    prefs:  'anonymous|ghost|save'
  },

  // Actions
  EVTS   = {
    ghost:     () => select(false),
    anonymous: () => select(null),
    discreto:  () => select(null)  && save(),
    cognito:   () => select(true)  && save(),
    incognito: () => select(false) && save(),
    allow:     () => more(true)    && save(),
    deny:      () => more(false)   && save(),
    save:      () => save(),
    keep:      () => save(),
    prefs:     () => prefs(),
    cancel:    () => prefs(false),
    show:      () => popup(),
    ok:        () => popup(false)
  }

let
  w = window,
  d = document,

  // DOM tree
  dom,
  // Dictionary
  dict,
  // Internal state
  state = {
    dnt:   false, // Do Not Track
    lang:  null,  // Current language
    mode:  null,  // Current mode
    popup: false, // Show popup
    show:  false, // Show preferences
    prefs: {},    // Services
    tags:  {},    // Tags
    level: 1,     // Cognito level
    proms: [],    // Pending promises
    ban:   false  // Domain banned
  }

/**
 * Init
 *
 * @return {Promise}  Fullfilled when ready
 */
function init () {

  // No conf, wait for start()
  if (!w.discretoConf)
    return Promise.resolve(false)

  // Load from URI
  if (typeof w.discretoConf === 'string') {

    let
      trigger = w.discretoConf.match(/^gtm:\/\/([^\/]+)\/(.+)$/)

    // Load from GTM
    if (trigger) {
      log('config: gtm')
      return gtm(trigger[1], trigger[2])
    }

    // Load from JSON
    log('config: json')
    return _.xhr(w.discretoConf).then((xhr) => {
      if (xhr.status !== 200)
        return Promise.reject(xhr.status)
      let json = JSON.parse(xhr.responseText)
      if (!json)
        return Promise.reject(400)
      return start(json)
    })

  }

  // Load from local conf
  return start(w.discretoConf)

}

/**
 * Startup chain
 *
 * @param  {object}  custom  Custom config
 * @return {Promise}         Fullfilled when ready
 */
function start (custom) {

  // Get conf & locale
  _.merge(conf, custom)
  _.merge(i18n, w.discretoLocale || {})
  state.lang = _.locale(i18n, conf.gui.lang)
  dict = i18n[state.lang]
  log('lang:', state.lang)

  // Do Not Track
  state.dnt = w.navigator.doNotTrack === "1"
  if (conf.cookie.dnt) state.dnt = true

  // Listen to iframe messages
  w.addEventListener('message', receive)

  // Promise chain
  log('start')
  return style()
    .then(build)
    .then(() => {

      return read()
        .then(() => complete(COOKIE, MORE),
              () => fetch().then(() => complete(REMOTE, ALMOST),
                                 () => Promise.resolve(FIRST)))
        .then(mode)
        .then(load)
        .then(delay)
        .then(popin)

    }).catch((err) => {

      console.error('[discreto] loading failed, check config & locale')
      log(err)

    })

}

/**
 * Destroy & clean
 *
 * @return {void}
 */
function clean () {

  // DOM
  dom.box.parentNode.removeChild(dom.box)
  delete dom.box

  // Reset state
  state.mode  = null
  state.popup = false
  state.show  = false
  state.prefs = {}
  state.tags  = {}
  state.level = 1
  state.proms = []

}

/**
 * When service accepted
 *
 * @param  {string}  name  Service codename
 * @return {Promise}       Consent as a promise
 */
function when (name) {

  return new Promise((resolve, reject) => {

    // Variant?
    if (name.charAt(name.length - 1) === '*') {

      let
        reg   = new RegExp('^' + name + '($|\-)'),
        names = Object.keys(conf.services),
        match = names.filter((v) => v.match(reg)),
        yet   = match.filter((name) => state.prefs[name]),
        all

      // No match
      if (!match.length)
        return reject(null)

      // One accepted
      if (yet.length)
        return resolve(yet)

      // Denied
      if (SET.includes(state.mode))
        return reject(null)

      // Need review
      all = match.map((name) => when(name).catch(() => Promise.resolve(null)))
      return Promise.all(all)
        .then((match) => match.filter((name) => state.prefs[name]))
        .then((yet) => yet.length ? resolve(yet) : reject(null))

    }

    // Accepted
    if (state.prefs[name])
      return resolve(name)

    // Denied
    if (SET.includes(state.mode))
      return reject(null)

    // First time or partial
    return state.proms.push({ name, resolve, reject })

  })

}

/**
 * Update prefs
 *
 * @param  {string} name     Service name
 * @param  {bool}   on       State
 * @param  {bool}   [store]  Save cookie?
 * @return {void}
 */
function update (name, on, store = false) {

  if (!name)
    return

  // Set
  set(name, on)

  // Apply once or save (and apply)
  if (store)
    save(true)
  else load(true)

}

/* * GUI * */

/**
 * Show/hide popup
 *
 * @param  {bool} [show]  Show/hide popup (default: show)
 * @return {bool}         Always true
 */
function popup (show = true) {

  if (state.popup === show)
    return false

  // Close prefs
  if (!show) prefs(false)

  // Toggle
  state.popup = show
  _.css(dom.box, 'min', !show)
  return true

}

/**
 * Show/hide preferences
 *
 * @param  {bool} [show]  Show/hide preferences (default: show)
 * @return {bool}         Always true
 */
function prefs (show = true) {

  // Show popup
  if (show) {
    popup()
    msg(PREFS)
  } else {
    msg(state.mode)
  }

  // Preselect
  if (show) {
    if (state.mode === FIRST)
      select(conf.gui.urge ? true : null)
    else if (state.mode !== COOKIE)
      more(conf.gui.urge ? true : null)
  }

  // Toggle
  if (state.show !== show) {
    state.show = show
    _.css(dom.box, 'show', show)
  }

  return true

}

/* * Private * */

/**
 * Ask GTM
 *
 * @param  {string}  gtmid  GTM container ID
 * @param  {string}  evt    Event name
 * @return {Promise}        Always resolved
 */
function gtm (gtmid, evt) {

  tag('gtm', { id: gtmid, args: [ evt ] })
  return Promise.resolve()

}

/**
 * Receive message
 *
 * @param  {object} msg  Incoming message
 * @return {void}
 */
function receive (msg) {

  let
    data = msg.data,
    name = data.discreto

  if (!name)
    return

  // Show prefs
  if (name === true) {
    prefs()
    return
  }

  // Set
  if (data.force)
    state.prefs[name] = data.on
  else set(name, data.on)

  // Apply once or save (and apply)
  if (data.force || data.once)
    load(true)
  else save(true)

}

/**
 * Refresh
 *
 * @return {bool}  Always true
 */
function refresh () {

  log('refresh')
  _.each(state.prefs, set)
  return true

}

/**
 * Select services
 *
 * @param  {bool|null} select   Allow services (null for anon only)
 * @param  {bool}      [unset]  Unset preferences only
 * @return {bool}               Always true
 */
function select (select, unset = false) {

  log(unset ? 'more:' : 'select:', select)
  _.each(conf.services, (name, opts) => {

    // Undefined only?
    if (unset && state.prefs[name] !== undefined)
      return

    // Never select 'share' without user consent
    if (name === '_share')
      return

    // Forced cookies are always on
    if (opts.force)
      return

    // Set regarding DNT
    set(name, select === null ? !!opts.anon : select)

  })
  return true

}

/**
 * Allow/deny new services
 *
 * @param  {bool|null} allow  Allow services (null for anon only)
 * @return {bool}             Always true
 */
function more (allow) {

  return select(allow, true)

}

/**
 * Toggle service
 *
 * @param  {Event} e  Click event
 * @return {bool}     Service state
 */
function toggle (e) {

  return set(e.target.name, e.target.checked)

}

/**
 * Show/hide partners
 *
 * @param  {Event} e  Click event
 * @return {void}
 */
function info (e) {

  let
    item    = e.target.parentNode,
    name    = e.target.getAttribute('data-name'),
    service = name === '_discreto' ? conf.cookie : conf.services[name],
    html

  // Unknown
  if (!service) {
    log('unknown:', name)
    return
  }

  // Toggle
  if (service.info) {
    log('toggle:', name)
    _.css(service.info, 'rolled')
    return
  }

  // Create
  service.info = _.dom({ tag: 'div.info.rolled' })
  item.parentNode.insertBefore(service.info, item.nextSibling)
  log('info:', name)
  feed(name, service).then((html) => {
    html = html.replace(/{([^}]+)}/g, (code, name) => {
      return conf.cookie[name] || name
    })
    service.info.innerHTML = '<div>' + html + '</div>'
    setTimeout(() => _.css(service.info, 'rolled', false), 20)
  })

}

/**
 * Remote info
 *
 * @param  {string}  name  Service name
 * @param  {object}  ini   Default values
 * @return {Promise}       Resolve with HTML
 */
function feed (name, ini) {

  let
    url   = conf.cookie.url,
    about = ini.about,
    items

  // Subdomains
  if (name === '_wild') {
    items = conf.cookie.wild.map((domain) => '<li>' + domain + '</li>')
    return Promise.resolve('<ul>' + items.join('') + '</ul>')
  }

  // Custom message
  if (dict.about && dict.about[name])
    return Promise.resolve(dict.about[name])
  if (about) {
    if (about instanceof Object)
      about = about[state.lang] || about[conf.gui.lang] || dict.unknown
    return Promise.resolve(about)
  }

  // Fetch
  log('feed:', name)
  return _.xhr(url + '/' + state.lang + '/' + name)
    .then((xhr) => xhr.responseText)
    .catch(() => Promise.resolve(dict.msg.error))

}

/**
 * Save consent
 *
 * @param  {bool} [local]  Local only
 * @return {bool}          Always true
 */
function save (local = false) {

  log('save')

  // Sanitize
  _.each(state.prefs, (name, on) => {
    let
      service = conf.services[name]
    if (!on || !service)
      return
    _.each(service.excl || [], (other) => {
      state.prefs[other] = false
    })
  })

  // Reload
  mode(COOKIE)
  load(true)

  // Track
  _.each(state.prefs, (name, on) => {
    track('Service', name, 1 * on)
  })

  // Write
  write()
  if (!local)
    post()

  // Close
  popup(false)
  return true

}

/**
 * Resolve promises & trigger events
 *
 * @return {void}
 */
function resolve () {

  // Pending promises
  let
    proms = state.proms

  log('resolve')

  // Clear stack
  state.proms = []

  // Enable [data-src] elements
  _.each(_.$$('[data-discreto]'), enable)

  // Resolve promises
  _.each(proms, (prom) => {

    let
      name = prom.name

    // Postpone/resolve/reject
    if (state.prefs[name] === undefined)
      state.proms.push(prom)
    else if (state.prefs[name])
      prom.resolve(name)
    else prom.reject(null)

  })

  // Trigger events
  _.each(state.prefs, (name, on) => {
    let
      evt  = new w.CustomEvent('discreto-' + name, { detail: on }),
      evts = new w.CustomEvent('discreto', { detail: { name, on }})
    d.dispatchEvent(evt)
    d.dispatchEvent(evts)
  })

}

/**
 * Enable/disable DOM element
 *
 * @param  {HTMLElement} el  DOM element
 * @return {void}
 */
function enable (el) {

  let
    type    = el.tagName.toLowerCase(),
    src     = el.getAttribute('data-src'),
    clss    = el.getAttribute('data-class'),
    name    = el.getAttribute('data-discreto'),
    on

  // Wildcard
  if (name.charAt(name.length - 1) === '*') {
    let
      reg   = new RegExp('^' + name + '($|\-)'),
      names = Object.keys(state.prefs),
      match = names.filter((v) => v.match(reg)),
      yet   = match.filter((name) => state.prefs[name])
    on = !!yet.length
    name = name.substr(0, name.length - 1)
  } else {
    on = state.prefs[name]
  }

  // Accepted
  if (on) {
    log('enabled:', src || type)
    if (src) {
      // Only once if `src` defined
      el.removeAttribute('data-discreto')
      el.src = src
    } else {
      // Toggle class
      _.css(el, clss, true)
    }
    return
  }

  // Refused
  log('disabled:', src || type)
  if (!src)
    _.css(el, clss, false)
  if (type === 'iframe')
    iframe(el, name, src)

}

/**
 * Display consent iframe
 *
 * @param  {HTMLElement} el    DOM element
 * @param  {string}      name  Service name
 * @param  {string}      src   iframe URL
 * @return {void}
 */
function iframe (el, name, src) {

  let
    service = conf.services[name],
    title   = dict.services[name] || name,
    cmd     = 'javascript:window.parent.postMessage',
    msg, ssrc, html

  // Localized
  if (service && service.name) {
    title = service.name
    if (title instanceof Object)
      title = title[state.lang] || title[conf.gui.lang] || name
  }

  // iframe mask
  if (!service) {
    log('no pref:', name)
    msg = 'undef'
  } else {
    msg  = SET.includes(state.mode) ? 'block' : 'choose'
  }

  // Inject HTML
  html = "<!doctype html>\
<html><head><style>html,body{height:100%;margin:0;padding:0}body{display:flex;\
background-image:linear-gradient(135deg,whitesmoke 25%,white 25%,white 50%,\
whitesmoke 50%,whitesmoke 75%,white 75%,white 100%,whitesmoke 100%);\
background-size:60px 60px;justify-content:center;align-items:center;color:black\
;text-align:center;font:300 14px/1.4 \"Helvetica Neue\",Helvetica,Arial,\
sans-serif}big{font-size:3em}a{text-decoration:none;font-weight:600;color:\
inherit}</style></head><body><div>"

  // Message
  ssrc = src.replace(/\?.+$/, '')
  html += dict.msg[msg].replace('{title}', title).replace('{src}', ssrc)

  // Buttons
  if (service) {
    html += "<a href=\"" + cmd + "({ discreto: '" + name + "', "
          + "on: true, once: true }, '*')\">" + dict.btns.once + "</a> | "
          + "<a href=\"" + cmd + "({ discreto: '" + name + "', "
          + "on: true }, '*')\">" + dict.btns.always + "</a> | "
  } else {
    html += "<a href=\"" + cmd + "({ discreto: '" + name + "', "
          + "on: true, force: true }, '*')\">" + dict.btns.force + "</a> | "
  }
  html += "<a href=\"" + cmd + "({ discreto: true }, '*')\">"
        + dict.btns.prefs + "</a>"

  // Close
  html += "</div></body></html>"
  el.setAttribute('src', "data:text/html;charset=UTF-8," + html)

}

/**
 * Delay popup
 * By time or y-scroll
 *
 * @return {Promise}       Resolve when it's time to show up
 */
function delay () {

  let
    val = conf.gui.wait

  // Immediate
  if (!val)
    return Promise.resolve()

  // Delay!
  if (typeof val === "string"
      && val.substr(-2) === "px") {
    let px = parseInt(val.substr(0, val.length - 2))
    log('offset:', px)
    return scrolling(px)
  }

  // Timeout
  let ms = 1000 * parseFloat(val)
  return new Promise((resolve, reject) => {
    log('delay:', ms)
    setTimeout(resolve, ms)
  })

}

/**
 * Initial popup
 *
 * @return {void}
 */
function popin () {

  let
    mode = state.mode

  if (!SET.includes(mode))
    popup()

}

/**
 * Spy scrolling
 *
 * @param  {int}     delta  Scrolling delta
 * @return {Promise}        Resolve when scroll reached
 */
function scrolling (delta) {

  // Check if body is high enough
  let
    s  = d.body.scrollHeight,
    h  = d.body.clientHeight,
    y0 = w.scrollY,
    dy = Math.min(delta, s - (h + y0))

  if (!dy)
    return Promise.resolve()

  return new Promise((resolve, reject) => {
    let f = () => {
      if (Math.abs(w.scrollY - y0) < dy)
        return
      w.removeEventListener('scroll', f)
      resolve()
    }
    w.addEventListener('scroll', f)
  })

}

/**
 * Choose mode
 *
 * @param  {string} mode  Display mode
 * @return {void}
 */
function mode (mode) {

  // Store
  log('mode:', mode)
  state.mode = mode

  // Message, buttons & checkbox
  msg(mode)
  buttons(mode)
  refresh()

  // First time, check regarding DNT
  if (mode === FIRST)
    select(state.dnt ? false : null)

  // Remote first, complete regarding DNT
  if (mode === ALMOST)
    more(state.dnt ? false : null)

}

/**
 * Fetch from remote
 *
 * @return {Promise}  Resolve if remote cookie
 */
function fetch () {

  // Not enabled or DNT
  if (!conf.cookie.share || state.dnt)
    return Promise.reject()

  // Fetch
  _.css(dom.box, 'spring', true)
  return _.xhr(conf.cookie.url).then((xhr) => {

    // Status
    log('fetch:', xhr.status)
    if (xhr.status !== 200) {
      if (xhr.status === 403)
        misuse(xhr.responseText)
      return Promise.reject()
    }

    // Resolve
    parse(xhr.responseText)
    return true

  }).finally(() => _.css(dom.box, 'spring', false))

}

/**
 * Post to remote
 *
 * @return {Promise}  XHR response as a promise
 */
function post () {

  let
    data = 'mask=' + stringify() + '&days=' + conf.cookie.days

  // Not enabled
  if (!conf.cookie.share || !state.prefs._share)
    return Promise.resolve(false)

  // Post
  return _.xhr(conf.cookie.url, 'post', data).then((xhr) => {

    // Status
    log('post:', xhr.status)
    if (xhr.status !== 201) {
      if (xhr.status === 403)
        misuse(xhr.responseText)
      return Promise.reject(xhr)
    }

    // Resolve
    return true

  }).catch((xhr) => {

    console.error('[discreto] could not post shared preferences')
    log(xhr)

  })

}

/**
 * Drop mask
 *
 * @return {Promise}  XHR response as a promise
 */
function drop () {

  // Not enabled
  if (!conf.cookie.share)
    return Promise.resolve(false)

  // Post
  return _.xhr(conf.cookie.url, 'delete').then((xhr) => {

    // Status
    log('post:', xhr.status)
    if (xhr.status !== 204)
      return Promise.reject(xhr)

    // Resolve
    return true

  }).catch((xhr) => {

    console.error('[discreto] could not remove shared preferences')
    log(xhr)

  })

}

/**
 * Parse mask
 *
 * @param  {string} str  Stringified mask
 * @return {void}
 */
function parse (str) {

  if (str === '')
    return

  _.each(str.split('|'), (name) => {
    let
      on = (name.charAt(0) !== '-')
    if (!on) name = name.substr(1)
    if (!conf.services[name])
      return
    state.prefs[name] = on
  })

}

/**
 * Stringify mask
 *
 * @return {string}  Stringified mask
 */
function stringify () {

  let
    bits = []

  _.each(state.prefs, (name, on) => {
    bits.push((on ? '' : '-') + name)
  })
  return bits.join('|')

}

/**
 * Check if complete
 *
 * @return {Promise}  Resolve with mode
 */
function complete (complete, partial) {

  let
    def  = Object.keys(state.prefs),
    req  = Object.keys(conf.services),
    miss

  // Exclude _share & defined
  miss = req.filter((name) => {
    return name !== '_share' && !def.includes(name)
  })

  // Missing preferences
  if (miss.length) {
    _.each(miss, (name) => {
      _.each(dom.items[name], (item) => {
        _.css(item.box, 'new', true)
      })
    })
    return Promise.resolve(partial)
  }

  return Promise.resolve(complete)

}

/**
 * Load CSS
 *
 * @return {Promise}  When CSS loaded
 */
function style () {

  let
    link,
    href = conf.gui.css

  // User defined
  if (href === null)
    return Promise.resolve()

  // Get from script path
  if (href === false) {
    // @todo try d.currentScript, but won't work in module or function
    _.each(_.$$('script'), (script) => {
      if (!script.src || !script.src.match(/\/discreto(\.min)?\.js(\?|$)/))
        return
      href = script.src.replace(/\.js(\?|$)/, '.css$1')
    })
  }

  // Append link
  return new Promise((resolve, reject) => {
    link = _.dom({ tag: 'link', atts: { rel: 'stylesheet', href } })
    link.addEventListener('load', resolve, true)
    link.addEventListener('error', reject, true)
    _.$('head').appendChild(link)
  })

}

/**
 * Build GUI
 *
 * @return {Promise}  Always resolved
 */
function build () {

  // DOM
  dom = {}
  _.dom({
    tag:   'box:aside#discreto.min',
    evts:  { click: EVTS.show },
    child: [
      { tag: 'div.overlay' },
      { tag: 'div.popup', child: [
        { tag: 'form:form.consent', child: [
          { tag: 'div.main', child: [
            { tag: 'logo:div.logo' },
            { tag: 'head:div.head' },
            { tag: 'prefs:div.prefs', child: [
              { tag: 'mandatory:fieldset.field', child: [
                { tag: 'div.item', child: [
                  { tag: 'label', child: [
                    { tag:  'input',
                      atts: { type: 'checkbox',
                              checked: 'checked',
                              disabled: 'disabled' } },
                    { tag: 'span', html: dict.options.cookie } ] },
                  { tag: 'i',
                    atts: { 'data-name': '_discreto' },
                    evts: { click: info },
                    html: dict.btns.cookie } ] } ] },
              { tag: 'foot:p.credits',
                html: dict.msg.thanks } ] } ] },
          { tag: 'btns:nav.btns',  child: [
            { tag: 'front:div.front' },
            { tag: 'back:div.back' } ] } ] } ] }
    ]
  }, dom)

  // GUI options
  if (state.dnt)      _.css(dom.box, 'dnt', true)
  if (conf.gui.block) _.css(dom.box, 'block', true)
  if (conf.gui.hide)  _.css(dom.box, 'autohide', true)
  if (conf.gui.pos)   _.css(dom.box, conf.gui.pos, true)
  if (conf.gui.logo) {
    dom.logo.appendChild(_.dom({
      tag: 'img', atts: { alt: '', src: conf.gui.logo }
    }))
  }

  // Allow subdomains
  if (conf.cookie.wild) {
    conf.services._wild = {
      name:  dict.options.domains,
      btn:   dict.btns.domains,
      types: [ 'advanced' ],
      anon:  true
    }
  }

  // Share with other sites
  if (conf.cookie.share) {
    conf.services._share = {
      name:  dict.options.share,
      btn:   dict.btns.share,
      types: [ 'advanced' ]
    }
  }

  // Preferences buttons
  buttons(PREFS, true)

  // Fieldsets
  dom.items = {}
  _.each(conf.services, item)

  // Display
  js.box = dom.box
  d.body.appendChild(dom.box)
  return Promise.resolve()

}

/**
 * New fieldset
 *
 * @param  {string} name  Fieldset name
 * @return {void}
 */
function fieldset (name) {

  // New fieldset
  _.dom({
    tag:   name + ':fieldset.field.' + name,
    child: [
      { tag: 'legend', html: dict.types[name] }
    ]
  }, dom)
  dom.prefs.insertBefore(dom[name], dom.foot)

}

/**
 * New service or option
 *
 * @param  {string} name  Service name
 * @param  {object} opts  Service options
 * @return {void}
 */
function item (name, opts) {

  // Checkboxes list
  if (!dom.items[name])
    dom.items[name] = []

  // Append in all sets
  _.each(opts.types, (type, i) => {

    // New fieldset
    if (!dom[type])
      fieldset(type)

    let
      item  = {},
      atts  = { type: 'checkbox', name },
      title = opts.name || dict.services[name] || name

    // Localized
    if (title instanceof Object)
      title = title[state.lang] || title[conf.gui.lang] || name

    // Force cookie (mandatory)
    if (opts.force) {
      state.prefs[name] = true
      atts.checked  = true
      atts.disabled = true
    }

    _.dom({
      tag: 'box:div.item',
      child: [
        { tag: 'label', child: [
          { tag:  'check:input', evts: { change: toggle },
            atts: atts },
          { tag: 'span', html: title } ] },
        { tag: 'i', evts: { click: info },
          atts: { class: i ? 'none' : '',
                  'data-name': name },
          html: opts.btn || dict.btns.about }
      ]
    }, item)

    dom.items[name].push(item)
    dom[type].appendChild(item.box)

  })

}

/**
 * Set buttons
 *
 * @param  {string} mode  Current mode
 * @return {void}
 */
function buttons (mode) {

  let
    btns = BTNS[mode].split('|'),
    box  = dom[mode === PREFS ? 'back' : 'front'],
    go   = mode === FIRST && !state.dnt

  // Clear
  while (box.firstChild)
    box.firstChild.remove()

  // Append new
  _.each(btns, (name) => {
    let cname = name === 'discreto' && go ? 'continue' : name
    box.appendChild(_.dom({
      tag:  'button',
      atts: { type: 'button' },
      evts: { click: () => track('Button', name) && EVTS[name]() },
      html: dict.btns[cname]
    }))
  })

}

/**
 * Show message
 *
 * @param  {string} mode  Mode
 * @return {void}
 */
function msg (mode) {

  let
    msg   = dict.msg[mode],
    anon  = true,
    ghost = true,
    about = stats()

  // DNT
  if (mode === FIRST && state.dnt)
    msg = dict.msg.dnt

  // Discreto/ghost
  if (mode === COOKIE) {
    _.each(state.prefs, (name, on) => {
      let
        service = conf.services[name]
      if (!service)
        return
      ghost &= !on
      if (name !== '_wild' && name !== '_share')
        anon &= !on || service.anon
    })
    if (ghost)
      msg = dict.msg.ghost
    else if (anon)
      msg = dict.msg.anon
  }

  // Format
  msg = msg.replace(/{([^}]+)}/g, (code, name) => {
    return about[name]
  })
  dom.head.innerHTML = msg

}

/**
 * Display misusage warning
 *
 * @param  {string} msg  Misuse message
 * @return {void}
 */
function misuse (msg) {

  let
    warning = _.dom({
      tag: 'div.info.misuse',
      html: msg
    })

  dom.advanced.appendChild(warning)

  dom.items._share[0].check.disabled = true
  set('_share', false) // just in case
  state.ban = true

}

/**
 * Change hat
 *
 * @return {void}
 */
function hat () {

  let
    about = stats(),
    level = Math.ceil(5 * about.active / about.total)

  // No change
  if (level === state.level)
    return

  // Update
  _.css(dom.box, 'cognito' + level, true)
  _.css(dom.box, 'cognito' + state.level, false)
  state.level = level

}

/**
 * Get stats
 *
 * @return {object}  Stats
 */
function stats () {

  let
    def = Object.keys(state.prefs),
    req = Object.keys(conf.services),
    on  = def.filter((service) => state.prefs[service]),
    miss

  // Exclude _share & defined
  miss = req.filter((name) => {
    return name !== '_share' && !def.includes(name)
  })

  return {
    total:  req.length,
    active: on.length,
    more:   miss.length
  }

}

/**
 * Set service
 *
 * @param  {string} name  Service name
 * @param  {bool}   on    State
 * @return {bool}         True if set
 */
function set (name, on) {

  let
    service = conf.services[name]

  if (!service) {
    log('unknown:', name)
    return false
  }
  if (!dom.items[name])
    return false

  // Banned?
  if (name === '_share' && state.ban)
    return false

  // Check/uncheck
  state.prefs[name] = on
  _.each(dom.items[name], (item) => {
    item.check.checked = on
  })

  // Disable excluded?
  _.each(service.excl || [], (other) => {
    _.each(dom.items[other], (item) => {
      item.check.disabled = on
      item.check.checked  = on ? false : state.prefs[other]
    })
  })

  // Animate
  hat()
  return true

}

/**
 * Read cookie
 *
 * @return  {Promise}  Resolve if cookie set
 */
function read () {

  let
    name  = conf.cookie.name,
    reg   = new RegExp('(?:(?:^|.*;\\s*)' + name
                     + '\\s*\=\\s*([^;]*).*$)|^.*$'),
    found = d.cookie.match(reg)

  if (found[1] === undefined)
    return Promise.reject()

  parse(found[1])
  return Promise.resolve()

}

/**
 * Write cookie
 *
 * @return {Promise}  Resolve when saved
 */
function write () {

  let
    name    = conf.cookie.name,
    cookie  = name + '=' + stringify(),
    expires = new Date(),
    empty   = name + '=',
    expired = new Date(),
    path    = conf.cookie.path || '/',
    host    = d.location.hostname,
    domain  = host.replace(/^(?:.+\.)?([^\.]+\.[^\.]+)$/, '$1')

  // Prefix
  host = '.' + host

  // Remove previous (single and wild)
  expired.setDate(expired.getDate() - 1)
  empty += ';path=' + path
  empty += ';expires=' + expired.toUTCString()
  d.cookie = empty + ';sameSite=Strict;domain=' + host
  if (conf.cookie.wild)
    d.cookie = empty + ';sameSite=Lax;domain=' + domain

  // Set new one (single or wild)
  expires.setDate(expires.getDate() + parseInt(conf.cookie.days))
  cookie += ';path=' + path
  cookie += ';expires=' + expires.toUTCString()
  cookie += ';sameSite=' + (state.prefs._wild ? 'Lax' : 'Strict')
  cookie += ';domain=' + (state.prefs._wild ? domain : host)
  d.cookie = cookie
  log('write:', cookie)

  // Ok
  return Promise.resolve()

}

/**
 * Load tags
 *
 * @param  {bool}    [reload]  Reload
 * @return {Promise}           Resolve when loaded
 */
function load (reload = false) {

  let
    tags = {}

  // Prepare tags
  _.each(state.prefs, (name, on) => {

    let
      tag,
      service = conf.services[name]

    if (!on || !service || !service.tag)
      return

    // New tag
    if (!tags[service.tag]) {
      tags[service.tag] = {
        args: [], cmds: [],
        services: [],
        anon: false
      }
    }
    tag = tags[service.tag]
    tag.services.push(service)

    // Force anonymous
    tag.anon |= service.anon

    // Command & event
    if (service.cmd)
      tag.cmds.push(service.cmd)
    if (reload && service.save)
      _.each(service.save.split(','), (arg) => tag.args.push(arg.trim()))
    else if (service.load)
      _.each(service.load.split(','), (arg) => tag.args.push(arg.trim()))

  })

  // Append
  _.each(tags, tag)

  // Resolve
  resolve()
  return Promise.resolve(true)

}

/**
 * Append one tag
 *
 * @param  {string} name  Tag name
 * @param  {object} tag   Commands & events
 * @return {void}
 */
function tag (name, tag) {

  let
    loader = js[name],
    id     = tag.id || conf.ids[name],
    atts, script

  // No loader
  if (!loader) {
    log('missing:', name)
    return
  }

  // Init
  if (!loader.on) {

    // New tag
    log('append:', name)
    if (loader.init) {
      try {
        atts = loader.init(id, tag.anon)
      } catch (e) {
        log('init failed:', name, e)
        atts = null
      }
      if (atts) {
        if (typeof atts === 'string')
          atts = { src: atts }
        script = _.dom({ tag: 'script', atts: { async: true } })
        _.each(atts, (key, val) => {
          if (key === 'src') return
          script.setAttribute(key, val)
        })
        if (loader.onload)
          script.onload = () => loader.onload(script)
        script.src = atts.src
        ;(d.body || d.head).appendChild(script)
      }
    }
    _.each(tag.services, (service) => {
      service.track = loader.track
    })
    loader.on   = true
    loader.sent = []

  }

  // Commands
  _.each(tag.cmds, (cmd) => cmd(id))

  // Filter arguments
  tag.args = tag.args.filter((arg) => {
    return !loader.sent.includes(arg)
  })
  if (!tag.args.length)
    return

  // Start
  try {
    if (loader.start)
      loader.start(tag.args)
    loader.sent.push.apply(loader.sent, tag.args)
  } catch (e) {
    log('start failed:', name, e)
  }

}

/**
 * Track choices
 *
 * @param  {string} action   Event action
 * @param  {string} label    Event label
 * @param  {float}  [value]  Optional value
 * @return {bool}            Always true
 */
function track (action, label, value) {

  let
    names = conf.cookie.track

  // No track
  if (!names)
    return true

  // Multiple
  if (typeof names === 'string')
    names = [ names ]

  // Try all
  names.forEach((name) => {

    let service = conf.services[name]

    if (!service || !service.track)
      return

    log('track:', action, label, value)
    service.track(action, label, value)

  })

  return true

}

/**
 * Log
 */
function log (...args) {

  if (!conf.debug) return
  args.unshift('[discreto]')
  _.log.apply(_, args)

}

// Expose
w.discreto = { start, clean, when, update, prefs, popup, mode, conf, state }

// Init on load
w.addEventListener('load', init, true)
