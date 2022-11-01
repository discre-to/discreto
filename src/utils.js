/**    _ _                 _
 *  __| (_)___ __ _ _ ___ | |_ ___
 * / _` | (_-</ _| '_/ -_)|  _/ _ \
 * \__,_|_/__/\__|_| \___(_)__\___/
 *
 * Copyright (c) 2022 - MIT License
 * Greg Deback <greg@discre.to>
 * <https://discre.to>
 *
 * Utils
 */
'use strict'

let
  w = window,
  d = document

/**
 * Log
 *
 * @param  {*} ...args  Console log arguments
 * @return {void}
 */
export function log () {

  let
    now  = new Date(),
    args = Array.prototype.slice.apply(arguments)
  args.unshift(now.toLocaleTimeString())
  console.log.apply(console, args)

}

/**
 * Query selector
 *
 * @param  {string}           query  Query selector
 * @return {null|HTMLElement}        HTML element or null
 */
 export function $ (query) {

 return d.querySelector(query)

 }

 /**
 * Query selector all
 *
 * @param  {string}   query  Query selector
 * @return {NodeList}        HTML list
 */
export function $$ (query) {

  return d.querySelectorAll(query)

}

/**
 * Iterate
 *
 * @param  {object|array} obj   Object
 * @param  {function}     func  Iteration function
 * @return {void}
 */
export function each (obj, func) {

  if (obj instanceof Array || obj instanceof w.NodeList)
    obj.forEach(func)
  else for (let key in obj)
    func(key, obj[key])

}

/**
 * Merge objects
 *
 * @param  {object|array} obj   Object
 * @param  {*}            opts  Options
 * @return {void}
 */
export function merge (obj, opts) {

  each(opts, (key, val) => {
    if (obj[key] instanceof Object || obj[key] instanceof Array)
      merge(obj[key], opts[key])
    else obj[key] = val
  })

}

/**
 * Create element
 *
 * @param  {object}     node   Node tree
 * @param  {object}     [map]  DOM map
 * @return {DOMElement}        DOM element
 */
export function dom (node, map) {

  let
    reg = new RegExp('^(?:([^:]+):)?([^#\.]+)(?:#([^\.]+))?(?:\.(.+))?$'),
    [ all, name, tag, id, css ] = node.tag.match(reg),
    el = d.createElement(tag)

  // Complete
  if (!node.atts) node.atts = {}
  if (id)   node.atts.id = id
  if (css)  node.atts.class = css.replace(/\./g, ' ')
  if (name) node.map = name

  // Attributes
  each(node.atts, (att, val) => {
    el.setAttribute(att, val)
  })
    if (node.html) el.innerHTML = node.html

  // Events
  each(node.evts || {}, (name, evt) => {
    el.addEventListener(name, evt, true)
  })

  // Children
  each(node.child || [], (child) => {
    if (child instanceof w.HTMLElement)
      el.appendChild(child)
    else el.appendChild(dom(child, map))
  })

  // Map
  if (node.map)
    map[node.map] = el

  return el

}

/**
 * Load script
 *
 * @param  {string} src       Script URL
 * @param  {bool}   [async]   Async load (default)
 * @param  {bool}   [before]  Prepend (default) or append
 * @return {void}
 */
export function script (src, async = true, before = true) {

  if (!src) return null

  let
    first  = d.querySelector('script'),
    script = dom({
      tag:  'script',
      atts: { async, src }
    })

  // Insert or append
  if (before)
    first.parentNode.insertBefore(script, first)
  else (d.body || d.head).appendChild(script)
  return script

}

/**
 * Add/remove CSS class
 *
 * @param  {HTMLElement} el    HTML element
 * @param  {string}      name  Classname
 * @param  {bool}        [on]  Add/remove
 * @return {void}
 */
export function css (el, name, on) {

  el.classList.toggle(name, on)

}

/**
 * Get locale
 *
 * @param  {object} i18n   Dictionaries
 * @param  {string} [ini]  Fallback language
 * @return {string}        Best locale
 */
export function locale (i18n, ini = 'en') {

  let
    found = false

  // Browser supported languages
  each(navigator.languages, (lang) => {
    if (found) return
    if (!i18n[lang] && lang.length > 2)
      lang = lang.substr(0, 2)
    if (!i18n[lang])
      return
    found = lang
  })

  // Fallback
  return found || ini

}

/**
 * XHR request
 *
 * @param  {string}  url     URL
 * @param  {string}  method  POST method
 * @param  {string}  [data]  Payload
 * @return {Promise}         XHR result as a promise
 */
export function xhr (url, method = 'get', data = null) {

  let
    xhr = new w.XMLHttpRequest()

  // XHR result as a promise
  return new Promise((resolve, reject) => {

    // Promise
    xhr.addEventListener('load',  () => { resolve(xhr) })
    xhr.addEventListener('error', () => { reject(xhr.status) })

    // GET data
    if (method !== 'post' && data) {
      url += '?' + data
      data = null
    }

    // Open with CORS
    xhr.open(method.toUpperCase(), url)
    xhr.withCredentials = true

    // POST data
    if (method === 'post')
      xhr.setRequestHeader('Content-Type',
                           "application/x-www-form-urlencoded")

    // Send
    xhr.send(data)

  })

}
