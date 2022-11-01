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

// Import module
import * as _ from '../src/utils.js'

let
  w = window,
  d = document

/**
 * Utils unit tests
 *
 * @coversModule utils
 */
describe('utils', () => {

  /**
   * Query selector
   * Just a querySelector shorthand
   *
   * @covers utils.$
   */
  describe('$', () => {

    // $('body')
    it('body gives <body>', () => {

      expect(_.$('body')).to.be(d.body)

    })

    // $('#mocha')
    it('#mocha exists', () => {

      expect(_.$('#mocha')).to.be(d.getElementById('mocha'))

    })

    // $('#')
    it('# should fail', () => {

      expect(() => _.$('#')).throwError()

    })

  })

  /**
   * Query selector all
   * Just a querySelectorAll shorthand
   *
   * @covers utils.$
   */
  describe('$$', () => {

    // $$('body')
    it('body gives [ <body> ]', () => {

      expect(_.$$('body')).to.be.a(w.NodeList)
      expect(_.$$('body')[0]).to.be(d.body)

    })

    // $$('#')
    it('# should fail too', () => {

      expect(() => _.$$('#')).throwError()

    })

  })

  /**
   * Each
   *
   * @covers utils.each
   */
  describe('each', () => {

    // Arrays
    it('calls method(value, index) on arrays', () => {

      let
        // value is index * 2
        arr = [ 0, 2, 4 ],
        n   = arr.length,
        p   = 0

      _.each(arr, (val, i) => {
        expect(val).to.be(i * 2)
        p++
      })
      expect(p).to.be(n)

    })

    // Objects
    it('calls method(key, value) on objects', () => {

      let
        // value is char code of key
        obj = { A: 65, B: 66, C: 67 },
        n   = Object.keys(obj).length,
        p   = 0

      _.each(obj, (key, val) => {
        expect(val).to.be(key.charCodeAt(0))
        p++
      })
      expect(p).to.be(n)

    })

    // NodeLists
    it('works on NodeList too', () => {

      let
        list = _.$$('script'),
        n    = list.length,
        p    = 0

      _.each(list, (el, i) => {
        expect(el.src).not.to.be(undefined)
        p++
      })
      expect(p).to.be(n)

    })

  })

  /**
   * Merge
   *
   * @covers utils.merge
   */
  describe('merge', () => {

    // Nothing on non-iterable value
    it('should do nothing', () => {

      let
        obj = { a: true },
        prev = Object.keys(obj)

      // Empty object
      _.merge(obj, {})
      expect(Object.keys(obj)).to.eql(prev)

      // Boolean
      _.merge(obj, false)
      expect(Object.keys(obj)).to.eql(prev)

      // Number
      _.merge(obj, 1)
      expect(Object.keys(obj)).to.eql(prev)

      // You get the idea

    })

    // Add one key
    it('adds a key', () => {

      let
        obj = { a: true },
        prev = Object.keys(obj)

      // Let's add b
      _.merge(obj, { b: false })
      expect(Object.keys(obj)).not.to.eql(prev)
      expect(obj.b).to.be(false)

    })

    // Replace previous
    it('replaces existing key', () => {

      let
        obj = { a: true },
        prev = Object.keys(obj)

      // Set a to false
      _.merge(obj, { a: false })
      expect(Object.keys(obj)).to.eql(prev)
      expect(obj.a).to.be(false)

    })

    // Recursive
    it('works recursively', () => {

      let
        obj  = { a: true, b: { c: 0, d: 1 } },
        opts = { b: { d: 2, e: 4 }, f: false }

      // Expected: { a: true, b: { c: 0, d: 2, e: 4 }, f: false }
      _.merge(obj, opts)
      expect(Object.keys(obj).sort()).to.eql([ 'a', 'b', 'f' ])
      expect(Object.keys(obj.b).sort()).to.eql([ 'c', 'd', 'e' ])
      expect(obj.b.c).to.be(0)
      expect(obj.b.d).to.be(2)

    })

  })

  /**
   * DOM
   *
   * @covers utils.dom
   */
  describe('dom', () => {

    // Object only
    it('takes only objects', () => {

      expect(() => _.dom()).throwError()
      expect(() => _.dom('div')).throwError()

    })

    // New node
    it('creates a node', () => {

      let
        div = _.dom({ tag: 'div' })

      // 'DIV' HTMLElement
      expect(div).to.be.an(w.HTMLElement)
      expect(div.nodeName).to.be('DIV')

    })

    // Attributes & events
    it('sets attributes & events', () => {

      let
        a   = true,
        div = _.dom({
          tag: 'div',
          atts: { 'data-test': 'test', class: 'class1 class2' },
          evts: { click: () => (a = !a) },
          html: 'Hello'
        }),
        clk = new w.Event('click')

      // Attribute
      expect(div.getAttribute('data-test')).to.be('test')

      // Classes
      expect(div.classList).to.contain('class1')
      expect(div.classList).to.contain('class2')

      // Inner HTML
      expect(div.innerHTML).to.be('Hello')

      // Event
      div.dispatchEvent(clk)
      expect(a).to.be(false)

    })

    // Inner HTML
    it('sets innerHTML', () => {

      let
        div = _.dom({
          tag:  'div',
          html: 'yes',
          child: []
        })

      expect(div.innerHTML).to.be('yes')

    })

    // Children
    it('can have children', () => {

      let
        div = _.dom({
          tag:   'div',
          html:  'yes',
          child: [ { tag: 'h1' }, { tag: 'p' } ]
        })

      // Keep inner HTML (as #text), that's 3 nodes
      expect(div.childNodes.length).to.be(3)
      expect(div.childNodes[0].nodeType).to.be(d.TEXT_NODE)
      expect(div.childNodes[1].nodeName).to.be('H1')

    })

    // Allows HTML elements in tree
    it('accepts DOM element children', () => {

      let
        p = _.dom({ tag: 'p' }),
        div = _.dom({
          tag:   'div',
          child: [ p ]
        })

      // <p> is first child
      expect(div.childNodes.length).to.be(1)
      expect(div.firstChild).to.be(p)

    })

    // Quick syntax
    // tag(#id)?(.(class_i))*
    it('supports quick syntax', () => {

      let
        div = _.dom({ tag: 'div#id.class1.class2' })

      // 'DIV' with id 'id' & 2 classes
      expect(div.nodeName).to.be('DIV')
      expect(div.id).to.be('id')
      expect(div.classList).to.contain('class1')
      expect(div.classList).to.contain('class2')

    })

    // Can store key nodes in map
    it('can build a map', () => {

      let
        map = {},
        div = _.dom({
          tag:   'box:div',
          child: [
            { tag: 'title:h1' },
            { tag: 'text:div' },
            { tag: 'text:p' } ]
        }, map)

      // Root element is dom
      expect(map.box).to.be(div)
      expect(map.title).to.be.an(w.HTMLElement)
      expect(map.title.nodeName).to.be('H1')

      // Last reference wins
      expect(map.text.nodeName).to.be('P') // not 'DIV'

    })

  })

  /**
   * Load script (async)
   *
   * @covers utils.script
   * @see    ./message.js
   */
  describe('script', () => {

    // Default is async & before
    it('inserts an async script before caller', () => {

      let
        msg = null,
        script

      return new Promise((resolve, reject) => {

        // Listen to script message
        w.addEventListener('message', (evt) => {
          resolve(evt.data)
        })

        // Load message.js
        script = _.script('./message.js')
        expect(script).to.be.a(w.HTMLElement)
        expect(script.getAttribute('src')).to.be('./message.js')

        // Default is async
        expect(script.getAttribute('async')).to.be.ok()

        // Inserted first
        expect(d.querySelector('script')).to.be(script)
        if (typeof process !== 'undefined')
          reject(null)

      }).then((msg) => {

        // Did he say hello?
        expect(msg).to.be.eql({ hello: 'world' })

      }, () => { // NodeJS...
      })

    })

    // Can be sync
    it('can be sync', () => {

      let
        script = _.script('./message.js', false)

      // Async attribute is 'false'
      // @todo Shouldn't it be undefined?!
      expect(script.getAttribute('async')).to.be('false')

    })

    // Appended last
    it('can be appended instead', () => {

      let
        script = _.script('./message.js', true, false),
        all    = d.querySelectorAll('script')

      // Sync flag
      expect(script.getAttribute('async')).to.be.ok()

      // But last
      expect(all[all.length - 1]).to.be(script)

    })

  })

  /**
   * Class manipulation
   *
   * @covers utils.css
   */
  describe('css', () => {

    // HTML element only
    it('should fail on non element', () => {

      expect(() => _.css()).throwError()

    })

    // Add class
    it('adds a class', () => {

      let
        div = _.dom({ tag: 'div' })

      // class1 is not there
      expect(div.classList).not.to.contain('class1')

      // Once
      _.css(div, 'class1', true)
      expect(div.classList).to.contain('class1')

      // Twice has no effect
      _.css(div, 'class1', true)
      expect(div.classList).to.contain('class1')
      expect(div.className).to.be('class1')

    })

    // @todo Multiple classes
    //it('should support many classes', () => {
    //  expect(() => _.css()).throwError()
    //})

    // Remove class
    it('removes a class', () => {

      let
        div = _.dom({ tag: 'div.class1' })

      // class1 is there
      expect(div.classList).to.contain('class1')

      // And not there
      _.css(div, 'class1', false)
      expect(div.classList).not.to.contain('class1')

    })

    // Toogle class
    it('should toggle a class', () => {

      let
        div = _.dom({ tag: 'div.class1' })

      // Day...
      expect(div.classList).to.contain('class1')

      // Night...
      _.css(div, 'class1')
      expect(div.classList).not.to.contain('class1')

      // Day!
      _.css(div, 'class1')
      expect(div.classList).to.contain('class1')

    })

  })

  /**
   * Locale
   *
   * @covers utils.locale
   */
  describe('locale', () => {

    // navigator.languages is readonly, but always inludes english
    it('always has en-US & en', () => {

      let
        langs = navigator.languages

      // Browsers & JSDOM speaks english, -US preferred
      expect(langs).to.contain('en-US')
      expect(langs).to.contain('en')
      expect(langs.indexOf('en-US')).to.be.lessThan(langs.indexOf('en'))

    })

    // Pick up first match
    it('picks up first match else fallback', () => {

      let
        i18n  = {
          'en-US': true,
          en:      true
        }

      // In order (languages like *, en-US, en)
      expect(_.locale(i18n)).to.be('en-US')
      delete i18n['en-US']
      expect(_.locale(i18n)).to.be('en')

      // English by default
      delete i18n['en']
      expect(_.locale(i18n)).to.be('en')

      // Except if specified
      expect(_.locale(i18n, 'fr')).to.be('fr')

    })

  })

  /**
   * XHR as a promise
   *
   * @covers utils.xhr
   * @see    ./message.php
   */
  describe('xhr', () => {

    if (!w.CORS)
      return

    // XHR response as a promise (default is GET)
    it('returns response as a promise', () => {

      return _.xhr(w.CORS + '/message.php').then((xhr) => {

        // 200 OK: Hello world (for a change)
        expect(xhr.status).to.be(200)
        expect(xhr.responseText.trim()).to.be('Hello world')

      }, (err) => {
        expect(err).to.be(true)
      })

    })

    // Resolve even with 404
    it('resolves with status 404', () => {

      return _.xhr(w.CORS + '/message.php?404').then((xhr) => {

        // 404
        expect(xhr.status).to.be(404)

      }, (err) => {
        expect(err).to.be(true)
      })

    })

    // Pass arguments in data
    it('supports GET data', () => {

      return _.xhr(w.CORS + '/message.php', 'get', '404').then((xhr) => {

        // Reponse text is METHOD
        expect(xhr.status).to.be(404)
        expect(xhr.responseText).to.be('GET')

      }, (err) => {
        expect(err).to.be(true)
      })

    })

    // Pass POST data
    it('supports POST data', () => {

      return _.xhr(w.CORS + '/message.php', 'post', '404').then((xhr) => {

        // Reponse text is METHOD
        expect(xhr.status).to.be(404)
        expect(xhr.responseText).to.be('POST')

      }, (err) => {
        expect(err).to.be(true)
      })

    })

    // Browser only, will fail with Node
    // @fixit
    if (typeof process === 'undefined') {

      // Rejected if no cors & not available
      it('rejects response with wrong CORS', () => {

        return _.xhr(w.CORS + '/message.php?nocors', 'get').then((xhr) => {
          console.warn(xhr)
          expect(xhr).to.be(false)
        }, (err) => {

          // Fail with status code (0 if no CORS)
          expect(err).to.be(0) // not set

        })

      })

    }

  })

})
