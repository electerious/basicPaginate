# basicPaginate

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CYKBESW577YWE)

Paginate a NodeList like there's no tomorrow.

basicPaginate turns a list of elements into a JS-controlled pagination.

## Contents

- [Demos](#demos)
- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [API](#api)
- [Instance API](#instance-api)

## Demos

| Name | Description | Link |
|:-----------|:------------|:------------|
| Default | Includes most features. | [Try it on CodePen](https://codepen.io/electerious/pen/eoKgZX) |

## Features

- Works in all modern browsers and IE11 ([with polyfills](#requirements))
- Supports all types of DOM elements
- Doesn't force you to use specific classes or markup
- CommonJS and AMD support
- Simple JS API

## Requirements

basicPaginate depends on the following browser features and APIs:

- [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
- [Node​List​.prototype​.for​Each](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach)

Some of these APIs are capable of being polyfilled in older browsers. Check the linked resources above to determine if you must polyfill to achieve your desired level of browser support.

## Setup

We recommend installing basicPaginate using [npm](https://npmjs.com) or [yarn](https://yarnpkg.com).

```sh
npm install basicpaginate
```

```sh
yarn add basicpaginate
```

Include the JS file at the end of your `body` tag…

```html
<script src="dist/basicPaginate.min.js"></script>
```

…or skip the JS file and use basicPaginate as a module:

```js
const basicPaginate = require('basicpaginate')
```

```js
import * as basicPaginate from 'basicpaginate'
```

## Usage

This demo shows how to use basicPaginate to turn a bunch of elements into a paginated list.

```html
<!-- Elements that should be paginated -->
<div class="item">Item 1</div>
<div class="item">Item 2</div>
<div class="item">Item 3</div>
<div class="item">Item 4</div>
<div class="item">Item 5</div>
<div class="item">Item 6</div>
<div class="item">Item 7</div>
<div class="item">Item 8</div>

<!-- Placeholder for the pagination -->
<div class="placeholder"></div>
```

```js
// 1) Create a new pagination with the items and show up to 4 elements per page
const instance = basicPaginate.create(document.querySelectorAll('.item'), 4)

// 2) Use the `render` function to generate the HTML and to render it to the DOM
instance.render((instance) => {

	const placeholder = document.querySelector('.placeholder')

	// 3) Generate the HTML of your pagination
	// Note: It doesn't matter how you generate the HTML as basicPaginate works with any structure
	placeholder.innerHTML = `
		<div class="pagination">
			<button data-basicpaginate-prev>←</button>
			<button data-basicpaginate-next>→</button>
		</div>
	`

	// 4) Return the created element so basicPaginate can look for special attributes
	// Note: You can also bind the event manually without adding attributes to the elements
	return placeholder

})

// 5) Control every aspect of the pagination programmatically
instance.first()
instance.last()
instance.prev()
instance.next()
instance.goto(0)
```

## API

### .create(elems, elemsPerPage)

Creates a new basicPaginate instance.

Be sure to assign your instance to a variable. Using your instance, you can…

* …get the current page index.
* …navigate back and forward.
* …goto a specific page.
* …goto a the first or last page.
* …tell basicPaginate to render a HTML pagination.

Example:

```js
const instance = basicPaginate.create(document.querySelectorAll('.item'), 4)
```

Parameters:

- `elems` `{NodeList}` Elements that should be part of the pagination.
- `elemsPerPage` `{Number}` Number of elements per page.

Returns:

- `{Object}` The created instance.

## Instance API

Each basicPaginate instance has a handful of handy functions. Below are all of them along with a short description.

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

basicPaginate doesn't render anything by default. Use this function to build the HTML of your pagination and to render it onto your site.

The render function accepts a function that will called every time the page of the pagination changes. It receives the current instance and allows you to generate the HTML for the pagination. Return the created element *or* the element containing the generated element and basicPaginate will look for special data attributes to automatically bind events. The supported attributes are `data-basicpaginate-first`, `data-basicpaginate-last`, `data-basicpaginate-prev`, `data-basicpaginate-next` and `data-basicpaginate-goto`. Their behaviour is equal to the functions of the instance. You can also skip the attributes or return nothing to handle the event binding on your own.

Examples:

```js
instance.render((instance) => {

	const placeholder = document.querySelector('.placeholder')

	// Use the data attributes of basicPaginate to get automatic event binding
	placeholder.innerHTML = `
		<div class="pagination">
			<button data-basicpaginate-first>First</button>
			<button data-basicpaginate-prev>←</button>
			${ instance.pages().map((_, index) => `
				<button class="${ index === instance.current() ? 'active' : '' }" data-basicpaginate-goto="${ index }">${ index + 1 }</button>
			`).join('') }
			<button data-basicpaginate-next>→</button>
			<button data-basicpaginate-last>Last</button>
		</div>
	`

	// Return the created element so basicPaginate can look for special attributes
	return placeholder

})
```

```js
instance.render((instance) => {

	const placeholder = document.querySelector('.placeholder')

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

	const placeholder = document.querySelector('.placeholder')

	// Build the HTML of your pagination with document.createElement
	const prev = document.createElement('button')
	const next = document.createElement('button')

	prev.innerText = '←'
	next.innerText = '→'

	// Handle the event binding on your own
	prev.onclick = instance.prev
	next.onclick = instance.next

})
```