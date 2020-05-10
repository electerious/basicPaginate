'use strict'

const { writeFile } = require('fs').promises
const js = require('rosid-handler-js')

js('src/scripts/main.js', {

	optimize: true,
	browserify: {
		standalone: 'basicPaginate'
	}

}).then((data) => {

	return writeFile('dist/basicPaginate.min.js', data)

})