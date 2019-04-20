# basicPagination

[![Dependencies](https://david-dm.org/electerious/basicpagination.svg)](https://david-dm.org/electerious/basicpagination.svg#info=dependencies) [![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CYKBESW577YWE)

Paginate a NodeList like there's no tomorrow.

basicPagination turns a list of elements into a JS-controlled pagination.

## Contents

- [Demos](#demos)
- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [API](#api)
- [Instance API](#instance-api)

## Demos

| Name | Description | Link | Author |
|:-----------|:------------|:------------|:------------|
| Default | Includes most features. | [Try it on CodePen]() |

## Features

- Works in all modern browsers and IE11 ([with polyfills](#requirements))
- Supports all types of DOM elements
- Doesn't force you to use specific classes or markup
- CommonJS and AMD support
- Simple JS API

## Requirements

basicPagination depends on the following browser features and APIs:

- [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
- [Node​List​.prototype​.for​Each](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach)

Some of these APIs are capable of being polyfilled in older browsers. Check the linked resources above to determine if you must polyfill to achieve your desired level of browser support.

## Setup

We recommend installing basicPagination using [npm](https://npmjs.com) or [yarn](https://yarnpkg.com).

```sh
npm install basicpagination
```

```sh
yarn add basicpagination
```

Include the JS file at the end of your `body` tag…

```html
<script src="dist/basicPagination.min.js"></script>
```

…or skip the JS file and use basicPagination as a module:

```js
const basicPagination = require('basicpagination')
```

```js
import * as basicScroll from 'basicpagination'
```

## Usage

This demo shows how to to change the opacity of an element when the user scrolls. The element starts to fade as soon as the top of the element reaches the bottom of the viewport. A opacity of `.99` is reached when the middle of the element is in the middle of the viewport.

Tip: Animating from `.01` to `.99` avoids the repaints that normally occur when the element changes from fully transparent to translucent and from translucent to fully visible.

```js
const instance = basicScroll.create({
	elem: document.querySelector('.element'),
	from: 'top-bottom',
	to: 'middle-middle',
	props: {
		'--opacity': {
			from: .01,
			to: .99
		}
	}
})

instance.start()
```

```css
.element {
	/*
	 * Use the same CSS variable as specified in our instance.
	 */
	opacity: var(--opacity);
	/*
	 * The will-change CSS property provides a way for authors to hint browsers about the kind of changes
	 * to be expected on an element, so that the browser can setup appropriate optimizations ahead of time
	 * before the element is actually changed.
	 */
	will-change: opacity;
}
```

## API

### .create(elems, elemsPerPage)

Creates a new basicPagination instance.

Be sure to assign your instance to a variable. Using your instance, you can…

* …get the current page index.
* …navigate back and forward.
* …goto a specific page.
* …goto a the first or last page.
* …tell basicPagination to render a HTML pagination.

Example:

```js
const instance = basicPagination.create(document.querySelectorAll('.item'), 4)
```

Parameters:

- `elems` `{NodeList}` Elements that should be part of the pagination.
- `elemsPerPage` `{Number}` Number of elements per page.

Returns:

- `{Object}` The created instance.

## Instance API

Each basicPagination instance has a handful of handy functions. Below are all of them along with a short description.

### .pages()

Returns an array in which each item contains the DOM element/node objects of a page.

Example:

```js
const pages = instance.pages()
```

Returns:

- `{Array}` Array in which each item contains the DOM element/node objects of a page.

### .length()

Returns the total number of pages.

Example:

```js
const length = instance.length()
```

Returns:

- `{Number}` Total number of pages.

### .current()

Returns the current page index.

Example:

```js
const current = instance.current()
```

Returns:

- `{Number}` Current page index.

### .goto(newIndex)

Navigates to a specific page.

Example:

```js
instance.goto(0)
```

Parameters:

- `newIndex` `{Number}` Index of the page to be displayed.

### .first()

Navigates to the first page.

Example:

```js
instance.first()
```

### .last()

Navigates to the last page.

Example:

```js
instance.last()
```

### .prev()

Navigates to the previous page or to the last page when the current page is already the first one.

Example:

```js
instance.prev()
```

### .next()

Navigates to the next page or to the first page when the current page is already the last one.

Example:

```js
instance.next()
```

### .render(renderer)

basicPagination doesn't render anything by default. Use this function to build the HTML of your pagination and to render it onto your page.

The render function accepts a function that will called every time the page of the pagination changes. It receives the current instance and allows you to generate the HTML for the pagination. Return the created element *or* the element containing the generated element and basicPagination will look for special data attributes to automatically bind events. The supported attributes are `data-basicpagination-first`, `data-basicpagination-last`, `data-basicpagination-prev`, `data-basicpagination-next` and `data-basicpagination-goto`. Their behaviour is equal to the functions of the instance. You can also skip the attributes or return nothing to handle the event binding on your own.

Examples:

```js
instance.render((instance) => {

	const placeholder = document.querySelector('.items__pagination')

	// Use the data attributes of basicPagination to get automatic event binding
	placeholder.innerHTML = `
		<div class="pagination">
			<button data-basicpagination-first>First</button>
			<button data-basicpagination-prev>←</button>
			${ instance.pages().map((_, index) => `
				<button class="${ index === instance.current() ? 'active' : '' }" data-basicpagination-goto="${ index }">${ index + 1 }</button>
			`).join('') }
			<button data-basicpagination-next>→</button>
			<button data-basicpagination-last>Last</button>
		</div>
	`

	// Return the created element so basicPagination can look for special attributes
	return placeholder

})
```

```js
instance.render((instance) => {

	const placeholder = document.querySelector('.items__pagination')

	placeholder.innerHTML = `
		<div class="pagination">
			<button class="pagination__prev">←</button>
			<button class="pagination__next">→</button>
		</div>
	`

	// Handle the event binding on your own
	placeholder.querySelector('.pagination__prev').onclick = instance.prev
	placeholder.querySelector('.pagination__next').onclick = instance.next

})
```

```js
instance.render((instance) => {

	const placeholder = document.querySelector('.items__pagination')

	// Build the HTML of your pagination using document.createElement
	const prev = document.createElement('button')
	const next = document.createElement('button')

	prev.innerText = '←'
	next.innerText = '→'

	// Handle the event binding on your own
	prev.onclick = instance.prev
	next.onclick = instance.next

})
```