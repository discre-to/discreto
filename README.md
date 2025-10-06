![discreto](https://discre.to/img/discreto.png)

# discreto

you have the right to stay anonymous<br/>
*(GDPR compliance made easy)*

## Links

- **[Official website](https://discre.to)**
- [Configuration wizard](https://discre.to/#config)
- [Documentation](https://discre.to/#doc)
- [API](https://discre.to/#api)

## Getting started

Use the [wizard](https://discre.to/#config) and copy/paste the resulting
HTML snippet before the closing `</body>` tag of your website/template:

```html
<!-- cookie & privacy consent - https://discre.to -->
<script>
window.discretoConf = { YOUR_CONFIG_HERE };
(function(d,i,s,c,o){c=d.getElementsByTagName(i)[0];o=d.createElement(i);
o.async=true;o.src=s;c.parentNode.insertBefore(o,c)})
(document,'script','//repo.discre.to/latest/discreto.min.js')
</script>
```

That's it!

## Development

### Prerequisites

First, if not already, get `npm`: https://www.npmjs.com/get-npm

Then, set up your webserver to point to the root folder of the project.

Assuming you're using the domain `discreto.localhost`, your virtual host
configuration on your Apache server would look like:
```apacheconf
<VirtualHost *:80>
  ServerName discreto.localhost
  DocumentRoot "/path/to/discreto"
</VirtualHost>
```

Or on nginx:
```nginx
server {
  listen 80;
  server_name discreto.localhost;
  root "/path/to/discreto";
}
```

### Installing

You'll need `webpack`, `sass` and a few plugins to build from the JS and Sass
sources, so let's make it simple:

```bash
npm install
```

Copy the default configurations for the live page (`live/index.html`) and the
test page (`test/index.html`):

```bash
cp live/config.ini.json live/config.json
cp test/config.ini.js test/config.js
```

## Specifications

### Configuration

Configuration is read from the global variable `window.discretoConf` (if set)
or passed as an argument to `discreto.start()`.

Configuration can either be an object:

```javascript
window.discretoConf = {
  gui: {
    logo: '/your/logo.svg'
  },
  cookie: {
    name: 'gdpr_cookie'
  },
  ids: {
    analytics: 'UA-XXXXXXX-Y'
  },
  services: {
    analytics: {
      types: [ 'audience' ],
      load: 'pageView'
    }
  }
}
```

A GTM event:

```javascript
window.discretoConf = 'gtm://GTM-XXXXXXX/config'
```

Or a JSON resource:

```javascript
window.discretoConf = '/your/config.json'
```

Use the [wizard](https://discre.to/#config) or read more about configuration in
the [documentation](https://discre.to/#doc).

### ES6 Module

**discreto** is written in ES6, and you can load it directly within your page:

```html
<script src="src/discreto.js" type="module"></script>
```

Or you can import it in your project as an ES6 or CommonJS module:

```javascript
import 'src/discreto.js'
```

### Sass

Style is built from Sass files located in `src/scss`.
The live page requires `dist/discreto.css` than can be built using:

```bash
sass src/discreto.scss dist/discreto.css
```

Or using `npm`:

```bash
npm run-script sass
```

If you want to watch changes:

```bash
sass --watch src:dist
```

Or:

```bash
npm run-script watch
```

### Translations

At the moment only English and French are supported, all contributions are
welcome, as well as spelling corrections and suggestions. See `src/i18n`.

### Live preview

You can use the live page (`live/index.html`) to get a preview, configuration
being read from `live/config.json`:

http://discreto.localhost/live


## Running the tests

Tests are written with `mocha` and `expect.js`. They shall pass.
They can be run using the command line:

```bash
npm test
```

Or using the test page (`test/index.html`):

http://discreto.localhost/test

### Cross-Origin Resource sharing

If you plan on testing CORS (see `test/utils.js`), you will need to define
an alias for your server name, and add support for PHP (see `test/message.php`).

You can skip these tests by setting `window.CORS = false` in `test/config.js`
(by default).

## Deployment

Build and minify JS & CSS using `webpack` with the provided configuration
(`webpack.conf.js`):

```bash
webpack -c webpack.config.js
```

Or using `npm`:

```bash
npm run-script build
```

Built files can be found in `dist`:

- `discreto.min.js`: packed module and dependencies
- `discreto.min.css`: minified CSS with inline image (base64)

Keep them in the same directory, let's say `discreto/`, and call the script in
your page just before the `</body>` tag:

```html
<script>window.discretoConf = { CONFIG }</script>
<script src="/discreto/discreto.min.js"></script>
```

## Built with

- [Webpack](https://webpack.js.org/)
- [Sass](https://sass-lang.com/)
- [Mocha](https://mochajs.org/)
  and [expect.js](https://github.com/Automattic/expect.js/)

See [package.json](https://github.com/discre-to/discreto/blob/master/package.json)
for the list of dependencies.

## License

**discreto** is released under the MIT License.
See the [LICENSE](https://github.com/discre-to/discreto/blob/master/LICENSE)
file for details.
