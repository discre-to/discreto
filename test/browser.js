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

// Load suite
import './config.js'
import './utils.js'
import './discreto.js'

// Run
mocha.bail(false)
mocha.run()
