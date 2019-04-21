import counter from 'count-between'

/**
 * Checks if a variable is a element node.
 * @param {?*} elem
 * @returns {Boolean}
 */
const isElementNode = (elem) => elem != null && elem.nodeType === Node.ELEMENT_NODE

/**
 * Chunks an array into smaller arrays of a specified size.
 * @param {Array} arr
 * @param {Number} size
 * @returns {Array}
 */
const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, index) => arr.slice(index * size, index * size + size))

/**
 * Shows the current page and hides the rest.
 * @param {Array} pages - Array in which each item contains the DOM element/node objects of a page.
 * @param {Number} index
 */
const showPage = function(pages, index) {

	const show = (elems) => elems.forEach((elem) => elem.removeAttribute('hidden'))
	const hide = (elems) => elems.forEach((elem) => elem.setAttribute('hidden', true))

	const isCurrent = (_, _index) => index === _index
	const isNotCurrent = (_, _index) => index !== _index

	pages.filter(isCurrent).forEach(show)
	pages.filter(isNotCurrent).forEach(hide)

}

/**
 * Binds events to an element.
 * @param {?Node} pagination
 * @param {Object} instance
 */
const setEvents = function(pagination, instance) {

	if (pagination == null) return

	if (isElementNode(pagination) === false) {
		console.warn('Could not bind events to pagination as the renderer returned a non-element node')
		return
	}

	pagination.querySelectorAll('[data-basicpaginate-first]').forEach((elem) => {
		elem.addEventListener('click', instance.first)
	})

	pagination.querySelectorAll('[data-basicpaginate-last]').forEach((elem) => {
		elem.addEventListener('click', instance.last)
	})

	pagination.querySelectorAll('[data-basicpaginate-prev]').forEach((elem) => {
		elem.addEventListener('click', instance.prev)
	})

	pagination.querySelectorAll('[data-basicpaginate-next]').forEach((elem) => {
		elem.addEventListener('click', instance.next)
	})

	pagination.querySelectorAll('[data-basicpaginate-goto]').forEach((elem) => {
		const newIndex = parseInt(elem.getAttribute('data-basicpaginate-goto'))
		elem.addEventListener('click', () => instance.goto(newIndex))
	})

}

/**
 * Creates a new instance.
 * @param {NodeList} elems - Elements that should be part of the pagination.
 * @param {Number} elemsPerPage - Number of elements per page.
 * @returns {Object} instance
 */
export const create = function(elems, elemsPerPage) {

	let renderer = null

	// Number of pages
	const length = Math.ceil(elems.length / elemsPerPage)

	// Initialize page counter
	let c = counter(0, length - 1, 0)

	// Initialize pages list
	const pages = chunk(Array.from(elems), elemsPerPage)

	// Returns all pages and their elements
	const _pages = () => pages

	// Return the total number of pages
	const _length = () => pages.length

	// Returns the current page index
	const _current = () => c()

	// Navigate to a pages
	const _goto = (newIndex) => {

		// Recreate counter with new initial value
		c = counter(0, _length() - 1, newIndex)

		// Switch to new page
		showPage(pages, c())

		// Update pagination
		_render()

	}

	// Navigate to the first page
	const _first = () => {

		_goto(0)

	}

	// Navigate to the last slide
	const _last = () => {

		_goto(_length() - 1)

	}

	// Navigate to the previous page
	const _prev = () => {

		_goto(c(-1))

	}

	// Navigate to the next page
	const _next = () => {

		_goto(c(1))

	}

	const _render = (_renderer = renderer) => {

		renderer = _renderer

		if (renderer == null) return

		setEvents(renderer(instance), instance)

	}

	// Assign instance to a variable so the instance can be used
	// elsewhere in the current function.
	const instance = {
		pages: _pages,
		length: _length,
		current: _current,
		goto: _goto,
		first: _first,
		last: _last,
		prev: _prev,
		next: _next,
		render: _render
	}

	// Start with the first page
	_first()

	return instance

}