# External SVG Polyfill [![npm][npm-badge]][npm] [![CDN][cdn-badge]][cdn]
> Small and basic polyfill to support referencing [external SVG files](https://css-tricks.com/svg-use-external-source/)

Browser like `IE9-IE11`, `Edge12`, `Safari 5.1-6`, or `UCWeb11`
[do not support referencing external files](https://caniuse.com/#feat=svg) via location hash.
Referencing external files can be especially useful when dealing with a technique called
*SVG sprites*, where multiple SVG elements are stored within a single SVG file. It is possible
to inline these *SVG sprites* into the HTML document itself, but this has several disadvantages
i.e. caching issues, unneeded HTML file size growth, development inconveniences, etc.
Externally referenced *SVG sprites* mitigate those problems but are not supported in the mentioned browsers.

**`external-svg-polyfill` embeds referenced SVG files automatically.**

**Features**
* User-agent sniffing is used to determine feature support.
* External SVG files are fetched via `xhr` and embedded while `use` elements are updated.
* Cross-domain SVG files are fetched and embedded for all browsers to work around browser limitations.
* To prevent naming collision issues, `id` attributes are updated to use a unique name.
* Dynamically added SVG `use` elements are processed upon changes in the `DOM`.
* Various lifecycle events get dispatched on relevant `DOM` elements.
* Minified file size is below 5 KiB to keep the load, parse and execution times low.
* Script is not self-executing, it needs to be called explicitly.
* Project is written in TypeScript.

## Setup

### Installation

[**npm**][npm]
```sh
npm install @thasmo/external-svg-polyfill
```

[**CDN**][cdn]
```html
<script src="https://cdn.jsdelivr.net/npm/@thasmo/external-svg-polyfill@2/browser/bundle.min.js"></script>
```

## Usage

Just define some `svg use` elements in the HTML markup and let `external-svg-polyfill` do the rest.

**Static Website**
```html
<!doctype html>
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/npm/@thasmo/external-svg-polyfill@2/browser/bundle.min.js"></script>
        <script>
            window.document.addEventListener('DOMContentLoaded', function() {
                new ExternalSvgPolyfill();
            });
        </script>
    </head>
    <body>
        <svg xmlns="http://www.w3.org/2000/svg">
            <use href="/static/sprite.svg#icon"></use>
        </svg>
    </body>
</html>
```

**Web Application**
```js
import ExternalSvgPolyfill from '@thasmo/external-svg-polyfill';
new ExternalSvgPolyfill();
```

### API

| method | description |
|--------|-------------|
| **run** | *Run the polyfill manually if the `run` option is set to `false`.* |
| **observe** | *Start observing the DOM for changes if the `observe` option is set to `false`.* |
| **unobserve** | *Stop observing the DOM for changes.* |
| **destroy** | *Stop the polyfill, stop observing and restore the original markup.* |
| **detect** | *Run browser detection manually if the `detect` option is set to `false`.* |

### Options

| option | description | type | default |
|--------|-------------|------|---------|
| **target** | *SVG `use` elements to process.* | `string`, `SVGUseElement[]`, `NodeListOf<SVGUseElement>` | `svg use` |
| **context** | *Element within to search for SVG use elements.* | `HTMLElement` | `window.document.body ?: window.document.documentElement` |
| **root** | *Element to which prepend SVG embeds to.* | `HTMLElement` | `window.document.body ?: window.document.documentElement` |
| **run** | *Run the polyfill on object instantiation.* | `boolean` | `true` |
| **prefix** | *Prefix `id` attribute values to ensure uniqueness. `false` won't change the attributes.* | `boolean` | `true` |
| **detect** | *Detect browser-support automatically. `false` will run the polyfill in any browser.* | `boolean` | `true` |
| **observe** | *Observe DOM changes within the `context` element and rerun the polyfill.* | `boolean` | `true` |
| **crossdomain** | *Embed crossdomain SVG files for all browsers regardless.* | `boolean` | `true` |
| **namespace** | *Namespace of the dispatched events.* | `string` | `external-svg-polyfill` |
| **agents** | *Array of regular expressions matching relevant user agents to polyfill.* | `RegExp[]` | `[/Edge\/12/, /Version\/6\.0.+Safari/, /UCBrowser\/11/]` |

### Events

All event are prefixed with the `namespace` option, are bubbling and can be cancelled using `event.preventDefault()`.

| event | description | data |
|-------|-------------|------|
| **`external-svg-polyfill`.load** | *An external SVG file is loaded via `xhr`.* | `address` |
| **`external-svg-polyfill`.insert** | *An external SVG file is inserted.* | `address`, `file` |
| **`external-svg-polyfill`.remove** | *An external SVG file is removed.* | `address` |
| **`external-svg-polyfill`.apply** | *An SVG `use` element's `href` attribute is updated.* | `address`, `identifier` |
| **`external-svg-polyfill`.revoke** | *An SVG `use` element's `href` attribute is restored.* | `value` |

## Compatibility

`external-svg-polyfill` can polyfill these browsers:
* `Internet Explorer 11` *tested*
* `UCWeb 11` *untested*

## Alternatives

Some alternatives exist and, in fact, `external-svg-polyfill` was greatly inspired by them. Check them out!

* [**SVG for Everybody**](https://github.com/jonathantneal/svg4everybody) by [*Jonathan Neal*](https://github.com/jonathantneal)
* [**svgxuse**](https://github.com/Keyamoon/svgxuse) by [*Keyamoon*](https://github.com/Keyamoon)
* [**SVG\<use\>It**](https://github.com/sinnerschrader/svg-use-it) by [*SinnerSchrader*](https://github.com/sinnerschrader)
* [**SVG Symbols Polyfill**](https://github.com/evan2x/svg-symbols-polyfill) by [*Evan*](https://github.com/evan2x)
* [**SVGInjector**](https://github.com/iconic/SVGInjector) by [*iconic*](https://github.com/iconic)

## Resources

* [**SVG on the web - A Practical Guide**](https://svgontheweb.com/) by [*Jake Giltsoff*](https://twitter.com/jakegiltsoff)
* [**SVG use with External Source**](https://css-tricks.com/svg-use-external-source/) by [*Chris Coyier*](https://twitter.com/chriscoyier)
* [**SVG use with External Reference, Take 2**](https://css-tricks.com/svg-use-with-external-reference-take-2/) by [*Chris Coyier*](https://twitter.com/chriscoyier)
* [**SVG Sprite Workflow That Works**](https://medium.com/@iamryanyu/svg-sprite-workflow-that-works-f5609d4d6144) by [*Ryan Yu*](https://twitter.com/iamryanyu)
* [**svgomg**](https://jakearchibald.github.io/svgomg/) by [*Jake Archibald*](https://twitter.com/jaffathecake)

## Credits

* Browser logos from [alrra/browser-logos](https://github.com/alrra/browser-logos)
* Bundler logos from [gilbarbara/logos](https://github.com/gilbarbara/logos)
* Browser testing via [browserstack](https://github.com/browserstack)

[![BrowserStack](https://www.browserstack.com/images/mail/browserstack-logo-footer.png)](https://www.browserstack.com/)  
[**BrowserStack**](https://www.browserstack.com/) loves open source and provides free manual and automated testing for this project! ❤️

---

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

[npm]: https://www.npmjs.com/package/@thasmo/external-svg-polyfill
[npm-badge]: https://img.shields.io/npm/v/@thasmo/external-svg-polyfill.svg
[cdn]: https://www.jsdelivr.com/package/npm/@thasmo/external-svg-polyfill
[cdn-badge]: https://data.jsdelivr.com/v1/package/npm/@thasmo/external-svg-polyfill/badge?style=rounded
