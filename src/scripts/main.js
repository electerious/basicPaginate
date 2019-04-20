import counter from 'count-between'

/**
 * Chunks an array into smaller arrays of a specified size.
 * @param {Array} arr
 * @param {Number} size
 * @returns {Array}
 */
const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, index) => arr.slice(index * size, index * size + size))

/**
 * Creates an element from a HTML string.
 * @param {String} html
 * @returns {Node}
 */
const toElement = function(html) {

	const elem = document.createElement('div')

	elem.innerHTML = html.trim()

	return elem.firstChild

}

/**
 * Shows the current page and hides the rest.
 * @param {Array} pages
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
 * Renders the pagination and binds events.
 * @param {String|Node} html
 * @param {Object} instance
 * @returns {Node}
 */
const renderPagination = function(html, instance) {

	const pagination = typeof html === 'string' ? toElement(html) : html

	pagination.querySelectorAll('[data-basicpagination-first]').forEach((elem) => {
		elem.addEventListener('click', instance.first)
	})

	pagination.querySelectorAll('[data-basicpagination-last]').forEach((elem) => {
		elem.addEventListener('click', instance.last)
	})

	pagination.querySelectorAll('[data-basicpagination-prev]').forEach((elem) => {
		elem.addEventListener('click', instance.prev)
	})

	pagination.querySelectorAll('[data-basicpagination-next]').forEach((elem) => {
		elem.addEventListener('click', instance.next)
	})

	pagination.querySelectorAll('[data-basicpagination-goto]').forEach((elem) => {
		const newIndex = parseInt(elem.getAttribute('data-basicpagination-goto'))
		elem.addEventListener('click', () => instance.goto(newIndex))
	})

	return pagination

}

/**
 * Creates a new instance.
 * @param {NodeList} elems
 * @param {Number} elemsPerPage
 * @returns {Object} instance
 */
export const create = function(elems, elemsPerPage) {

	let renderer = null
	let updater = null

	// Number of pages
	const length = Math.ceil(elems.length / elemsPerPage)

	// Initialize page counter
	let c = counter(0, length - 1, 0)

	// Initialize pages list
	const pages = chunk(Array.from(elems), length)

	// Returns all pages and their elements
	const _pages = () => pages

	// Return the total number of pages
	const _length = () => pages.length

	// Returns the current page index
	const _current = () => c()

	// Navigate to a pages
	const _goto = (newIndex) => {

		const shouldRender = renderer != null && updater != null

		// Recreate counter with new initial value
		c = counter(0, _length() - 1, newIndex)

		// Switch to new page
		showPage(pages, c())

		// Update pagination
		if (shouldRender === true) _render()

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

	const _render = (_renderer = renderer, _updater = updater) => {

		renderer = _renderer
		updater = _updater

		const html = renderer(instance)
		const pagination = renderPagination(html, instance)

		updater(pagination)

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