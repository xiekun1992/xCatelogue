const gulp = require('gulp'),
	  uglify = require('gulp-uglify'),
	  rename = require('gulp-rename'),
	  insert = require('gulp-insert'),
	  fs = require('fs');


gulp.task('default', ()=>{
	gulp.src('./src/*.js')
	.pipe(uglify())
	.pipe(rename((path)=>{
		path.basename += '.min';
	}))
	.pipe(insert.prepend(
`/**
 * Version: ${JSON.parse(fs.readFileSync('./package.json')).version}
 * Home page: https://github.com/xiekun1992/xCatelogue
 */
`))
	.pipe(gulp.dest('./build/'));
});