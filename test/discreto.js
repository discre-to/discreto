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

// Import modules
import * as _ from '../src/utils.js'
import '../src/discreto.js'

let
  w = window,
  d = document

/**
 * Discreto, DNT disabled
 *
 * @coversModule discreto
 */
describe('discreto, first time', () => {

  /**
   * Remove previous cookie if any
   */
  describe('reset', () => {

    // Delete cookie
    it('deletes previous cookie', () => {

      let
        empty   = 'discreto_test=;path=/test/',
        expired = new Date(),
        host    = '.' + d.location.hostname

      // Remove previous (single and wild)
      expired.setDate(expired.getDate() - 1)
      empty += ';expires=' + expired.toUTCString() + ';domain=' + host
      empty += ';sameSite=Lax'
      d.cookie = empty

      // Wait for it...
      expect(d.cookie).not.to.contain('discreto_test')

    })

  })

  /**
   * Init
   *
   * @covers discreto.init
   * @private
   */
  describe('init', () => {

    // Started on DOM ready
    it('should be loaded yet', () => {

      // Staged
      expect(w.discreto).to.be.ok()

      // With no conf
      expect(w.discretoConf).not.to.be.ok()

    })

    // @todo GTM & URL in functional tests

  })

  /**
   * Start
   *
   * @covers discreto.start
   */
  describe('start', () => {

    let
      web = typeof process === 'undefined',
      css = web ? '/dist/discreto.min.css' : null

    // Manual start
    it('starts with conf', () => {

      return w.discreto.start({
        debug: web,
        gui: {
          css:  css,
          urge: false
        },
        cookie: {
          name: 'discreto_test',
          path: '/test/',
          days: 1
        },
        services: {
          anon: {
            tag:   'nil',
            types: [ 'audience' ],
            name:  'Anon',
            anon:  true
          },
          cognito: {
            tag:   'nil',
            types: [ 'audience' ],
            name:  'Cognito'
          }
        }
      }).then(() => {

        // #discreto is in the place
        expect(_.$('#discreto')).to.be.ok()
        expect(w.discreto.state.mode === 'first')

      })

    })

    // Bottom left corner by default, maximized (FIRST)
    it('maximized popup, bottom left', () => {

      // Wait for DOM update
      expect(_.$('#discreto').classList).not.to.contain('min')
      expect(_.$('#discreto').classList).to.contain('left')

    })

    // Consent & anonymous services already checked
    it('allows consent & starts anonymous services', () => {

      let
        checks = _.$$('#discreto input[type=checkbox]')

      // First is consent, active & disabled
      expect(checks[0].checked).to.be(true)
      expect(checks[0].disabled).to.be(true)

      // Second is anonymous, selected
      expect(checks[1].checked).to.be(true)

      // Third is not anonymous, unselected
      expect(checks[2].checked).to.be(false)

      // Not shown
      expect(_.$('#discreto').classList).not.to.contain('show')

    })

    // Anonymous services resolves immediatly
    it('immediatly resolves for anonymous', () => {

      return w.discreto.when('anon').then((service) => {

        // Returns service name
        expect(service).to.be('anon')

      }, () => {
        expect('anon').to.be('accepted')
      })

    })

  })

  /**
   * Choose Discreto
   *
   * @covers discreto.select(null)
   */
  describe('choose discreto', () => {

    // Discreto mode
    it('enables anonymous services', () => {

      // Click on Discreto
      _.$$('#discreto .btns .front button')[0].click()
      expect(w.discreto.state.prefs.anon).to.be(true)
      expect(w.discreto.state.prefs.cognito).to.be(false)
      expect(w.discreto.state.mode).to.be('cookie')

    })

    // Revert
    it('reverts', () => {

      w.discreto.mode('first')
      w.discreto.popup()

    })

  })

  /**
   * Refuse all
   *
   * @covers discreto.select(false)
   */
  describe('refuse all', () => {

    // Refuse all
    it('disables everything', () => {

      // Click on Discreto
      _.$$('#discreto .btns .front button')[2].click()
      expect(w.discreto.state.prefs.anon).to.be(false)
      expect(w.discreto.state.prefs.cognito).to.be(false)
      expect(w.discreto.state.mode).to.be('cookie')

    })

    // Revert
    it('reverts', () => {

      w.discreto.mode('first')
      w.discreto.popup()

    })

  })

  /**
   * Accept all
   *
   * @covers discreto.select(true)
   */
  describe('accept all', () => {

    // Accept all
    it('enables everything', () => {

      // Click on Discreto
      _.$$('#discreto .btns .front button')[3].click()
      expect(w.discreto.state.prefs.anon).to.be(true)
      expect(w.discreto.state.prefs.cognito).to.be(true)
      expect(w.discreto.state.mode).to.be('cookie')

    })

    // Revert
    it('reverts', () => {

      w.discreto.mode('first')
      w.discreto.popup()

    })

  })

  /**
   * Show prefs for first time, urge off
   *
   * @covers discreto.prefs
   * @covers discreto.select
   */
  describe('prefs', () => {

    let checks

    // No urge, don't check more
    it('doesn\'t check more services', () => {

      checks = _.$$('#discreto input[type=checkbox]')

      // Show prefs
      w.discreto.prefs()
      expect(_.$('#discreto').classList).to.contain('show')

      // Second is anonymous, checked
      expect(checks[1].checked).to.be(true)

      // Third is not anonymous, unchecked
      expect(checks[2].checked).to.be(false)

    })

    // Urge! check all (almost)
    it('checks all if gui.urge is true', () => {

      // Set urge on & refresh
      w.discreto.conf.gui.urge = true
      w.discreto.prefs()

      // Second is anonymous, still checked
      expect(checks[1].checked).to.be(true)

      // Third is not anonymous, but checked
      expect(checks[2].checked).to.be(true)

    })

    // Invisible mode
    it('unchecks all in Invisible mode', () => {

      // Click on Invisible
      _.$$('#discreto .btns .back button')[1].click()

      // Both unselected
      expect(checks[1].checked).to.be(false)
      expect(checks[2].checked).to.be(false)

    })

    // Anonymous mode (Discreto)
    it('should select anon with Anonymous', () => {

      // Click on Anonymous
      _.$$('#discreto .btns .back button')[0].click()

      // Anonymous checked, other not
      expect(checks[1].checked).to.be(true)
      expect(checks[2].checked).to.be(false)

    })

  })

  // Resolve when saved
  describe('save', () => {

    // Trigger events & reject cognito
    it('triggers events & rejects pending promise', function (done) {

      let

        // One time event (encapsulated in Promise)
        trigger = new Promise((resolve, reject) => {
          let
            evt = (e) => {
              // Status (bool) is in detail
              expect(e.detail).to.be(false)
              d.removeEventListener('discreto-cognito', evt)
              resolve()
            }
          d.addEventListener('discreto-cognito', evt)
        }),

        // Pending cognito promise
        prom = w.discreto.when('cognito').then(() => {
          expect('cognito').to.be('refused')
        }, (nil) => {

          // Rejects with null
          expect(nil).to.be(null)
          return Promise.resolve()

        })

      // Nothing left pending
      this.timeout(200)
      Promise.all([ trigger, prom ]).finally(done)

      // Click on save
      _.$$('#discreto .btns .back button')[2].click()

    })

  })

  // Clean up
  describe('clean', () => {

    // Clear DOM & reset state
    it('destroys popup', () => {

      w.discreto.clean()
      expect(_.$('#discreto')).not.to.be.ok()
      expect(w.discreto.state.mode).to.be(null)

    })

  })

})

/**
 * Second time, no change
 */
describe('discreto, second time, no change', () => {

  /**
   * Start
   */
  describe('start again', () => {

    let
      web = typeof process === 'undefined',
      css = web ? '/dist/discreto.min.css' : null,
      checks

    // Start again
    it('starts again', () => {

      // Restore cookie (NodeJS)
      if (!web) d.cookie = 'discreto_test=anon|-cognito'

      // Back with no urge
      return w.discreto.start({ gui: { urge: false } }).then(() => {

        expect(_.$('#discreto')).to.be.ok()
        expect(w.discreto.state.mode === 'cookie')

      })

    })

    // Start minimized
    it('starts minimized', () => {

      // Has 'min' class
      expect(_.$('#discreto').classList).to.contain('min')

    })

    // Only consent & anonymous service on
    it('allows consent & start anonymous services', () => {

      checks = _.$$('#discreto input[type=checkbox]')

      // Second is anonymous, selected
      expect(checks[1].checked).to.be(true)

      // Third is not anonymous, unselected
      expect(checks[2].checked).to.be(false)

      // Prefs not shown
      expect(_.$('#discreto').classList).not.to.contain('show')

    })

  })

  /**
   * Showing prefs doesn't change
   */
  describe('no change in prefs', () => {

    let checks

    // No urge, no change
    it('doesn\'t check anything', () => {

      checks = _.$$('#discreto input[type=checkbox]')

      // Show prefs
      w.discreto.prefs(true)

      // Third is not anonymous, unchecked
      expect(checks[2].checked).to.be(false)

    })

    // Even if urge on
    it('even if gui.urge is true', () => {

      // Set urge on
      w.discreto.conf.gui.urge = true

      // Show again
      w.discreto.prefs()

      // Third is not anonymous, still unchecked
      expect(checks[2].checked).to.be(false)

    })

  })

  /**
   * Promise won't stay pending
   */
  describe('nothing pending', () => {

    // Immediatly
    it('resolves or rejects immediatly', function (done) {

      let

        // Anonymous is ok
        ok = w.discreto.when('anon').then((service) => {

          // Returns service name
          expect(service).to.be('anon')

        }, () => {
          expect('anon').to.be('accepted')
        }),

        // Cognito is no good
        ko = w.discreto.when('cognito').then((service) => {
          expect('cognito').to.be('refused')
        }, (nil) => {

          // Rejects with null
          expect(nil).to.be(null)
          return Promise.resolve()

        })

      // Nothing left pending
      this.timeout(200)
      Promise.all([ ok, ko ]).finally(done)

    })

  })

  /**
   * Clean up again
   */
  describe('clean again', () => {

    // Clear DOM & reset state
    it('destroys popup', () => {

      w.discreto.clean()
      expect(_.$('#discreto')).not.to.be.ok()

    })

  })

})

/**
 * Third time, new services
 *
 * @covers discreto.more
 */
describe('discreto, third time, new services', () => {

  /**
   * Start
   */
  describe('start again', () => {

    let
      web = typeof process === 'undefined',
      css = web ? '/dist/discreto.min.css' : null,
      checks

    // Start again
    it('starts again', () => {

      // Back with no urge but two more services
      return w.discreto.start({
        gui: { urge: false },
        services: {
          _anon2: {
            tag:   'nil',
            types: [ 'audience' ],
            name:  'Anon2',
            anon:  true
          },
          _cognito2: {
            tag:   'nil',
            types: [ 'audience' ],
            name:  'Cognito'
          }
        }
      }).then(() => {

        // Discreto up in 'more' mode
        expect(_.$('#discreto')).to.be.ok()
        expect(w.discreto.state.mode === 'more')

      })

    })

    // Maximized again, new choices
    it('starts maximized, new choices to make', () => {

      // Has not 'min' class
      expect(_.$('#discreto').classList).not.to.contain('min')

    })

    // New services are not checked yet
    it('doesn\'t start any new service, even anonymous', () => {

      checks = _.$$('#discreto input[type=checkbox]')

      // Second is accepted, third is refused
      expect(checks[1].checked).to.be(true)
      expect(checks[2].checked).to.be(false)

      // But fourth & fifth aren't checked
      expect(checks[3].checked).to.be(false)
      expect(checks[4].checked).to.be(false)

      // Not shown
      expect(_.$('#discreto').classList).not.to.contain('show')

    })

    // Accepted services resolve immediatly
    it('resolves for previously accepted only', () => {

      return w.discreto.when('anon').then((service) => {

        // Returns service name
        expect(service).to.be('anon')

      }, () => {
        expect('anon').to.be('accepted')
      })

    })

    // New cognito is pending
    it('lets previously refused & new services pending', (done) => {

      // Expect timeout (pending)
      let timeout = false
      setTimeout(() => {
        timeout = true
        done()
      }, 150)

      Promise.all([
        w.discreto.when('cognito'),
        w.discreto.when('_anon2'),
        w.discreto.when('_cognito2')
      ]).then(() => {
        if (!timeout)
          expect('new services').to.be('pending, not accepted')
      }, () => {
        if (!timeout)
          expect('new services').to.be('pending, not refused')
      })

    })

  })

  /**
   * Refuse new
   *
   * @covers discreto.more(false)
   */
  describe('refuse new services', () => {

    // Refuse
    it('doesn\'t accept any new service', () => {

      // Click on Refuse
      _.$$('#discreto .btns .front button')[0].click()

      // No change
      expect(w.discreto.state.prefs.anon).to.be(true)
      expect(w.discreto.state.prefs.cognito).to.be(false)

      // Refused for new
      expect(w.discreto.state.prefs._anon2).to.be(false)
      expect(w.discreto.state.prefs._cognito2).to.be(false)

      expect(w.discreto.state.mode).to.be('cookie')

    })

    // Revert
    it('reverts', () => {

      // Let's pretend...
      delete w.discreto.state.prefs._anon2
      delete w.discreto.state.prefs._cognito2
      w.discreto.mode('more')
      w.discreto.popup()

    })

  })

  /**
   * Accept all new
   *
   * @covers discreto.more(true)
   */
  describe('accept new services', () => {

    // Accept
    it('accepts all new service', () => {

      // Click on Accept
      _.$$('#discreto .btns .front button')[2].click()

      // No change
      expect(w.discreto.state.prefs.anon).to.be(true)
      expect(w.discreto.state.prefs.cognito).to.be(false)

      // Refused for new
      expect(w.discreto.state.prefs._anon2).to.be(true)
      expect(w.discreto.state.prefs._cognito2).to.be(true)

      expect(w.discreto.state.mode).to.be('cookie')

    })

    // Revert
    it('reverts', () => {

      // Let's pretend...
      delete w.discreto.state.prefs._anon2
      delete w.discreto.state.prefs._cognito2
      w.discreto.mode('more')
      w.discreto.popup()

    })

  })

  /**
   * Showing prefs again, urge off
   *
   * @covers discreto.more(null)
   */
  describe('prefs', () => {

    let checks

    // No urge, don't check more
    it('checks only anonymous services', () => {

      checks = _.$$('#discreto input[type=checkbox]')

      // Show prefs
      w.discreto.prefs()
      expect(_.$('#discreto').classList).to.contain('show')

      // Fourth is anonymous, checked
      expect(checks[3].checked).to.be(true)

      // Fifth is not, unchecked
      expect(checks[4].checked).to.be(false)

    })

    // Urge! check all (almost)
    it('checks unset only if gui.urge is true', () => {

      // Let's pretend we didn't decide for 4th & 5th
      delete w.discreto.state.prefs._anon2
      delete w.discreto.state.prefs._cognito2

      // Set urge on & refresh
      w.discreto.conf.gui.urge = true
      w.discreto.prefs()

      // Fourth & fifth are checked
      expect(checks[3].checked).to.be(true)
      expect(checks[4].checked).to.be(true)

      // But previsouly refused is still unchecked
      expect(checks[2].checked).to.be(false)

    })

  })

  /**
   * New promises to resolve
   */
  describe('save', () => {

    // Trigger events & reject cognito
    it('triggers events & check pending promise', function (done) {

      let

        // One time event (encapsulated in Promise)
        trigger = new Promise((resolve, reject) => {
          let
            evt = (e) => {
              // Status (bool) in detail
              expect(e.detail).to.be(true)
              d.removeEventListener('discreto-_cognito2', evt)
              resolve()
            }
          d.addEventListener('discreto-_cognito2', evt)
        }),

        // Resolves for newly checked
        ok = w.discreto.when('_cognito2').then((service) => {

          // Returns service name
          expect(service).to.be('_cognito2')

        }, (nil) => {
          expect('_cognito2').to.be('accepted')
        }),

        // Rejects previously refused
        ko = w.discreto.when('cognito').then(() => {
          expect('cognito').to.be('refused')
        }, (nil) => {

          // Rejects with null
          expect(nil).to.be(null)
          return Promise.resolve()

        })

      // Nothing left pending
      this.timeout(200)
      Promise.all([ trigger, ok, ko ]).finally(done)

      // Click on save
      _.$$('#discreto .btns .back button')[2].click()

    })

  })

  /**
   * Clean up, last time
   */
  describe('clean', () => {

    // Clear DOM & reset state
    it('destroys popup', () => {

      w.discreto.clean()
      expect(_.$('#discreto')).not.to.be.ok()
      expect(w.discreto.state.mode).to.be(null)

    })

    // Remove new services
    it('removes new services', () => {

      delete w.discreto.conf.services._anon2
      delete w.discreto.conf.services._cognito2

    })

  })

})


/**
 * Discreto, DNT enabled
 *
 * @coversModule discreto
 * @see ./discreto.dnt.js
 */
describe('discreto DNT, first time', () => {

  let
    web = typeof process === 'undefined'

  /**
   * Remove previous cookie if any
   */
  describe('reset', () => {

    // Delete cookie
    it('deletes previous cookie', () => {

      let
        empty   = 'discreto_dnt=;path=/test/',
        expired = new Date(),
        host    = '.' + d.location.hostname

      // Remove previous (single and wild)
      expired.setDate(expired.getDate() - 1)
      empty += ';expires=' + expired.toUTCString() + ';domain=' + host
      empty += ';sameSite=Lax'
      d.cookie = empty

      // Wait for it...
      expect(d.cookie).not.to.contain('discreto_dnt')

    })

  })

  /**
   * Start
   *
   * @covers discreto.start
   */
  describe('start', () => {

    let
      web = typeof process === 'undefined',
      css = web ? '/dist/discreto.min.css' : null

    // Manual start with DNT flag
    it('starts with conf', () => {

      return w.discreto.start({
        debug: web,
        gui: {
          css:  css,
          urge: false
        },
        cookie: {
          name: 'discreto_dnt',
          path: '/test/',
          days: 1,
          dnt:  true
        },
        services: {
          anon: {
            tag:   'nil',
            types: [ 'audience' ],
            name:  'Anon',
            anon:  true
          },
          cognito: {
            tag:   'nil',
            types: [ 'audience' ],
            name:  'Cognito'
          }
        }
      }).then(() => {

        // #discreto is in the place
        expect(_.$('#discreto')).to.be.ok()
        expect(w.discreto.state.mode === 'first')
        expect(w.discreto.state.dnt === true)

      })

    })

    // Consent & anonymous services *not* checked
    it('allows consent but starts nothing', () => {

      let
        checks = _.$$('#discreto input[type=checkbox]')

      // First is consent, active & disabled
      expect(checks[0].checked).to.be(true)
      expect(checks[0].disabled).to.be(true)

      // Second and third are unchecked
      expect(checks[1].checked).to.be(false)
      expect(checks[2].checked).to.be(false)

      // Not shown
      expect(_.$('#discreto').classList).not.to.contain('show')

    })

    // All services are pending
    it('lets all services pending', (done) => {

      // Expect timeout (pending)
      let timeout = false
      setTimeout(() => {
        timeout = true
        done()
      }, 150)

      Promise.all([
        w.discreto.when('anon'),
        w.discreto.when('cognito')
      ]).then(() => {
        if (!timeout)
          expect('services').to.be('pending, not accepted')
      }, () => {
        if (!timeout)
          expect('services').to.be('pending, not refused')
      })

    })

  })

  /**
   * Choose Discreto
   *
   * @covers discreto.select(null)
   * @duplicate Same DNT/no-DNT
   */
  describe('choose discreto', () => {

    // Discreto mode
    it('enables anonymous services', () => {

      // Click on Discreto
      _.$$('#discreto .btns .front button')[0].click()
      expect(w.discreto.state.prefs.anon).to.be(true)
      expect(w.discreto.state.prefs.cognito).to.be(false)
      expect(w.discreto.state.mode).to.be('cookie')

    })

    // Revert
    it('reverts', () => {

      w.discreto.mode('first')
      w.discreto.popup()

    })

  })

  /**
   * Refuse all
   *
   * @covers discreto.select(false)
   * @duplicate Same DNT/no-DNT
   */
  describe('refuse all', () => {

    // Refuse all
    it('disables everything', () => {

      // Click on Discreto
      _.$$('#discreto .btns .front button')[2].click()
      expect(w.discreto.state.prefs.anon).to.be(false)
      expect(w.discreto.state.prefs.cognito).to.be(false)
      expect(w.discreto.state.mode).to.be('cookie')

    })

    // Revert
    it('reverts', () => {

      w.discreto.mode('first')
      w.discreto.popup()

    })

  })

  /**
   * Accept all
   *
   * @covers discreto.select(true)
   * @duplicate Same DNT/no-DNT
   */
  describe('accept all', () => {

    // Accept all
    it('enables everything', () => {

      // Click on Discreto
      _.$$('#discreto .btns .front button')[3].click()
      expect(w.discreto.state.prefs.anon).to.be(true)
      expect(w.discreto.state.prefs.cognito).to.be(true)
      expect(w.discreto.state.mode).to.be('cookie')

    })

    // Revert
    it('reverts', () => {

      w.discreto.mode('first')
      w.discreto.popup()

    })

  })

  /**
   * Show prefs for first time, urge off
   *
   * @covers discreto.prefs
   */
  describe('prefs', () => {

    let checks

    // No urge, don't check more
    it('doesn\'t check more services', () => {

      checks = _.$$('#discreto input[type=checkbox]')

      // Show prefs
      w.discreto.prefs()
      expect(_.$('#discreto').classList).to.contain('show')

      // Second is anonymous, checked
      expect(checks[1].checked).to.be(true)

      // Third is not anonymous, unchecked
      expect(checks[2].checked).to.be(false)

    })

    // Urge! check all (almost)
    it('checks all if gui.urge is true', () => {

      // Set urge on & refresh
      w.discreto.conf.gui.urge = true
      w.discreto.prefs()

      // Second is anonymous, still checked
      expect(checks[1].checked).to.be(true)

      // Third is not anonymous, but checked
      expect(checks[2].checked).to.be(true)

    })

    // Invisible mode
    it('unchecks all in Invisible mode', () => {

      // Click on Invisible
      _.$$('#discreto .btns .back button')[1].click()

      // Both unselected
      expect(checks[1].checked).to.be(false)
      expect(checks[2].checked).to.be(false)

    })

    // Anonymous mode (Discreto)
    it('should select anon with Anonymous', () => {

      // Click on Anonymous
      _.$$('#discreto .btns .back button')[0].click()

      // Anonymous checked, other not
      expect(checks[1].checked).to.be(true)
      expect(checks[2].checked).to.be(false)

    })

  })

  // Resolve when saved
  describe('save', () => {

    // Trigger events & reject cognito
    it('triggers events & rejects pending promise', function (done) {

      let

        // One time event (encapsulated in Promise)
        trigger = new Promise((resolve, reject) => {
          let
            evt = (e) => {
              // Status (bool) is in detail
              expect(e.detail).to.be(false)
              d.removeEventListener('discreto-cognito', evt)
              resolve()
            }
          d.addEventListener('discreto-cognito', evt)
        }),

        // Pending cognito promise
        prom = w.discreto.when('cognito').then(() => {
          expect('cognito').to.be('refused')
        }, (nil) => {

          // Rejects with null
          expect(nil).to.be(null)
          return Promise.resolve()

        })

      // Save prefs to reject & trigger event
      this.timeout(200)
      Promise.all([ trigger, prom ]).finally(done)

      // Click on save
      _.$$('#discreto .btns .back button')[2].click()

    })

  })

  // Clean up
  describe('clean', () => {

    // Clear DOM & reset state
    it('destroys popup', () => {

      w.discreto.clean()
      expect(_.$('#discreto')).not.to.be.ok()
      expect(w.discreto.state.mode).to.be(null)

    })

    // Remove new services
    it('removes new services', () => {

      delete w.discreto.conf.services._anon2
      delete w.discreto.conf.services._cognito2

    })

  })

})

/**
 * NB: Second & third times are identical DNT/no-DNT
 */

/**
 * Enable share, first time
 *
 * @covers discreto.fetch
 * @covers discreto.post
 */
describe('discreto shared, first time', () => {

  /**
   * Remove previous cookie if any
   */
  describe('reset', () => {

    // Delete cookie
    it('deletes previous cookie', () => {

      let
        empty   = 'discreto_share=;path=/test/',
        expired = new Date(),
        host    = '.' + d.location.hostname

      // Remove previous (single and wild)
      expired.setDate(expired.getDate() - 1)
      empty += ';expires=' + expired.toUTCString() + ';domain=' + host
      empty += ';sameSite=Lax'
      d.cookie = empty

      // Wait for it...
      expect(d.cookie).not.to.contain('discreto_share')

    })

  })

  /**
   * Start
   *
   * @covers discreto.start
   */
  describe('start', () => {

    let
      web = typeof process === 'undefined',
      css = web ? '/dist/discreto.min.css' : null

    // Manual start
    it('starts with conf', () => {

      return w.discreto.start({
        gui: { urge: false },
        cookie: {
          name:  'discreto_share',
          share: true,
          url:   w.SHARE,
          dnt:   false
        }
      }).then(() => {

        // #discreto is in the place
        expect(_.$('#discreto')).to.be.ok()
        expect(w.discreto.state.mode === 'first')

      })

    })

  })

  /**
   * Accept all
   *
   * @covers discreto.select(true)
   */
  describe('accept all', () => {

    // Accept all
    it('enables everything', (done) => {

      // Enable share first
      w.discreto.state.prefs._share = true
      expect(w.discreto.state.prefs._share).to.be(true)

      // Click on Accept all
      _.$$('#discreto .btns .front button')[3].click()
      expect(w.discreto.state.prefs.anon).to.be(true)
      expect(w.discreto.state.prefs.cognito).to.be(true)
      expect(w.discreto.state.mode).to.be('cookie')

      // Wait for POST request... 200ms should be enough
      setTimeout(done, 200)

    })

  })

  // Clean up
  describe('clean', () => {

    // Clear DOM & reset state
    it('destroys popup', () => {

      w.discreto.clean()
      expect(_.$('#discreto')).not.to.be.ok()
      expect(w.discreto.state.mode).to.be(null)

    })

  })

})


/**
 * Share preferences, enough to start
 */
describe('discreto, enough shared prefs', () => {

  /**
   * Remove previous cookie if any
   */
  describe('reset', () => {

    // Delete cookie
    it('deletes previous cookie', () => {

      let
        empty   = 'discreto_other=;path=/test/',
        expired = new Date(),
        host    = '.' + d.location.hostname

      // Remove previous (single and wild)
      expired.setDate(expired.getDate() - 1)
      empty += ';expires=' + expired.toUTCString() + ';domain=' + host
      empty += ';sameSite=Lax'
      d.cookie = empty

      // Wait for it...
      expect(d.cookie).not.to.contain('discreto_other')

    })

  })

  /**
   * Start
   *
   * @covers discreto.start
   */
  describe('start', () => {

    let
      web = typeof process === 'undefined',
      css = web ? '/dist/discreto.min.css' : null

    // Manual start
    it('starts with conf', () => {

      return w.discreto.start({
        gui: { urge: false },
        cookie: {
          name:  'discreto_other',
          share: true,
          url:   w.SHARE,
          dnt:   false
        }
      }).then(() => {

        // #discreto is in the place
        expect(_.$('#discreto')).to.be.ok()
        expect(w.discreto.state.mode === 'first')

      })

    })

    // Minimized
    it('starts minimalized', () => {

      // Enough info in mask
      expect(_.$('#discreto').classList).to.contain('min')

    })

    // Already active
    it('knows your preferences', () => {

      expect(w.discreto.state.prefs.anon).to.be(true)
      expect(w.discreto.state.prefs.cognito).to.be(true)
      expect(w.discreto.state.mode).to.be('remote')

    })

  })

  // Clean up
  describe('clean', () => {

    // Clear DOM & reset state
    it('destroys popup', () => {

      w.discreto.clean()
      expect(_.$('#discreto')).not.to.be.ok()
      expect(w.discreto.state.mode).to.be(null)

    })

  })

})

/**
 * Shared preferences, not enough
 */
describe('discreto, shared but other services', () => {

  /**
   * Start
   */
  describe('start again', () => {

    let
      web = typeof process === 'undefined',
      css = web ? '/dist/discreto.min.css' : null,
      checks

    // Start again
    it('starts again', () => {

      // Back with no urge but one more service
      return w.discreto.start({
        gui: { urge: false },
        services: {
          _anon2: {
            tag:   'nil',
            types: [ 'audience' ],
            name:  'Anon2',
            anon:  true
          },
          _cognito2: {
            tag:   'nil',
            types: [ 'audience' ],
            name:  'Cognito'
          }
        }
      }).then(() => {

        // Discreto up in 'almost' mode
        expect(_.$('#discreto')).to.be.ok()
        expect(w.discreto.state.mode === 'almost')

      })

    })

    // Maximized again, new choices
    it('starts maximized, new choices to make', () => {

      // Has not 'min' class
      expect(_.$('#discreto').classList).not.to.contain('min')

    })

    // New services are not checked yet
    it('also starts new anonymous services', () => {

      checks = _.$$('#discreto input[type=checkbox]')

      // Second & third are checked
      expect(checks[1].checked).to.be(true)
      expect(checks[2].checked).to.be(true)

      // As well as fourth (anonymous) but not fifth (cognito)
      expect(checks[3].checked).to.be(true)
      expect(checks[4].checked).to.be(false)

      // Not shown
      expect(_.$('#discreto').classList).not.to.contain('show')

    })

    // Never check _share
    it('never checks _share without user consent', () => {

      // Sixth & last checkbox
      expect(checks[5].checked).to.be(false)

    })

    // Accepted services *and* anonymous resolves immediatly
    // @warning
    // This is a different scenario than when the same site adds new services.
    // Here new anonymous services should be loaded as when share is disabled
    it('resolves for accepted and new anonymous', () => {

      return Promise.all([
        w.discreto.when('anon'),
        w.discreto.when('cognito'),
        w.discreto.when('_anon2')
      ]).then(([ anon, cognito, _anon2 ]) => {

        // Returns service name
        expect(anon).to.be('anon')
        expect(cognito).to.be('cognito')
        expect(_anon2).to.be('_anon2')

      }, () => {
        expect('services').to.be('accepted')
      })

    })

    // But new cognito service is pending again
    it('lets only new cognito service pending', (done) => {

      // Expect timeout (pending)
      let timeout = false
      setTimeout(() => {
        timeout = true
        done()
      }, 150)

      w.discreto.when('_cognito2').then(() => {
        if (!timeout)
          expect('_cognito2').to.be('pending, not accepted')
      }, () => {
        if (!timeout)
          expect('_cognito2').to.be('pending, not refused')
      })

    })

  })

  // Clean up
  describe('clean', () => {

    // Clear DOM & reset state
    it('destroys popup', () => {

      w.discreto.clean()
      expect(_.$('#discreto')).not.to.be.ok()
      expect(w.discreto.state.mode).to.be(null)

    })

  })

})
