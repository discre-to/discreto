/**    _ _                 _
 *  __| (_)___ __ _ _ ___ | |_ ___
 * / _` | (_-</ _| '_/ -_)|  _/ _ \
 * \__,_|_/__/\__|_| \___(_)__\___/
 *
 * Copyright © 2020 - MIT License
 * Greg Deback <greg@discre.to>
 * <https://discre.to>
 *
 * Configuration mask
 */
'use strict'

// Defaults
export const conf = {

  // Debug
  debug: false,

  // GUI
  gui: {
    pos:   'left',
    logo:  false,
    block: false,
    urge:  false,
    css:   false,
    lang:  'fr'
  },

  // Cookie
  cookie: {
    name:  'discreto',
    days:  365,
    path:  '/',
    wild:  false,
    share: false,
    url:   'https://cookie.discre.to'
  },

  // IDs
  ids: {},

  // Services
  services: {}

}
