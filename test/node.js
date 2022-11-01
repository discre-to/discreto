/**    _ _                 _
 *  __| (_)___ __ _ _ ___ | |_ ___
 * / _` | (_-</ _| '_/ -_)|  _/ _ \
 * \__,_|_/__/\__|_| \___(_)__\___/
 *
 * Copyright (c) 2022 - MIT License
 * Greg Deback <greg@discre.to>
 * <https://discre.to>
 *
 * Mocha tests
 */
'use strict'

import expect from 'expect.js'
import jsdom  from 'jsdom'

// Fake DOM
global.jsdom     = new jsdom.JSDOM('<!doctype html>\
<html><body><script src="about:blank"></script></body></html>',
                                   { url: 'http://localhost' })

// Window, document & navigator
global.window    = global.jsdom.window
global.document  = global.window.document
global.navigator = global.window.navigator

// Expect
global.expect    = expect

// Run suite
require('./config.js')
require('./utils.js')
require('./discreto.js')
