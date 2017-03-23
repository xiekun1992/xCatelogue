module.exports = {
	entry: {
		catelogue: __dirname + '/src/catelogue.js'
	},
	output: {
		path: __dirname + '/build/',
		filename: 'xcatelogue.js',
		library: 'xCatelogue',
		libraryTarget: 'umd'
	}
}