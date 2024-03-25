## Version 1.4.2

UI:

- Restore default styles (ul, li, small)

Services:

- Support for Google Consent v2 (based on 'anon')

Fix security alerts (NPM dependencies)

## Version 1.4.1

Services:

- Yahoo! Dot / Verizon Analytics (yahooDot)
- LinkedIn Insight & Conversion Tracking (linkedinInsight)
- Google Optimize (optimize)
- Support for script.onload on services

Bug fixes:

- Matomo initial events (matomo, matomo-anon)
- Support for Matomo Cloud (cdn property)

Dependencies update (node 16, npm 8, webpack 5)

## Version 1.3.0

UI:

- Following CNIL recommandations: added the 'Refuse all' button

Bug fixes:

- CSS bug fix (items width) & increased popup width
- alt="" on image & rel="nofollow" on links (SEO)

## Version 1.2.2

Bug fixes:

- Changed a few CSS classnames to avoid conflicts (including Bootstrap)
- Resolve immediatly if 'wait' flag is null, false or not parseable

## Version 1.2.1

Cookie:

- 'track': click tracking and choices stats (multiple services allowed)

UI:

- 'wait': delay popup show (time or scroll)

Services:

- Allow custom subdomain for Xiti
- Click tracking support: Matomo (Piwik), Google Analytics & Xiti

## Version 1.1.0

Cookie:

- 'sameSite' support
- Allow mandatory cookies ("force": true)

UI:

- Banner mode ("pos": "banner")
- Auto-hide ("hide": true)

Bug fixes:

- parseInt(conf.cookie.days) to avoid weird expiration dates

Fix security alerts (NPM dependencies)

## Version 1.0.3

Fix security alerts (NPM dependencies)

## Version 1.0.2

Bug fix:

- Support for multiple gtag() (from GTM/AdWords/...)

## Version 1.0.1

UI:

- Force font-family (override website defaults)

Third party:

- Updated support for Amazon Ads (requires data-discreto="amazon")
- Added support for HotJar

## Version 1.0.0

Everything changed since Epoch!
