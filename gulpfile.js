/*
	
	WORK IN PROGRESS!

	Project Structure
	=================

	Linting
	=======

	Default task
	============

	Watch
	=====

	Source Maps
	===========
	
	The final production ready files built via gulp are compressed and hard to
	read as is.  Source maps allows us to map from a compressed file back to its
	original, more readable form.  Chrome & Firefox support source maps. 

	Source map tutorial: http://blog.teamtreehouse.com/introduction-source-maps


	Globs
	=====

	gulp uses node-glob for parsing file paths.  This allows for wildcards and
	the like in the file paths, e.g. "js/*.js" will match any files with a .js
	extension in the js/ folder.

	More info: https://github.com/isaacs/node-glob


	livereload
	==========

	livereload allows us to trigger a refresh in the browser any time a file is
	changed.  We start up a livereload server from the node side which then
	communicates with a browser extension (http://livereload.com/extensions/).
	When a change is made to a watched file, pipe the changes to livereload so
	that it can notify the browser extension as to what has changed.

	livereload gulp tutorial: https://www.youtube.com/watch?v=r5fvdIa0ETk

*/

// _____________________________________________________________________________
// Setup

// Gulp & gulp plugins
var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var jshint = require("gulp-jshint");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var liveReload = require("gulp-livereload");

// Other modules
var express = require("express");
var path = require("path");


// _____________________________________________________________________________
// Gulp tasks

// Copy html from source to public 
gulp.task("copy-html", function () {
	return gulp.src("source/**/*.html")
		.pipe(gulp.dest("public"));
});

// "Lint" the JavaScript to check for any issues
gulp.task("lint", function () {
	return gulp.src("source/js/*.js")
		.pipe(jshint())
		.pipe(jshint.reporter("jshint-stylish"));
});

// Convert from sass to css adding vendor prefixes along the way and generating
// a source map to allow for easier debugging in chrome.
gulp.task("sass", function () {
	// Configure a sass stream so that it logs errors properly
	var sassStream = sass({
		outputStyle: "expanded"
	});
	sassStream.on("error", sass.logError);

	return gulp.src("source/scss/**/*.scss")
		.pipe(sourcemaps.init())
			.pipe(sassStream)
			.pipe(autoprefixer({
	            browsers: ['last 2 versions'],
	            cascade: true
	        }))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("public/css"))
		.pipe(liveReload());
});

// Combine all JS scripts into one file and minimize them
gulp.task("combine-uglify-scripts", function () {
	return gulp.src("source/js/*.js")
		.pipe(concat("all.js"))
		.pipe(uglify())
		.pipe(gulp.dest("public/js"))
});

// Start an express server that serves public/ to localhost:8080
gulp.task("express-server", function () {
	var app = express();
	app.use(express.static(path.join(__dirname, "public")));
	app.listen(8080);
});

// Watch for changes to HTML/sass files and start a liveReload server
gulp.task("watch", function () {
	liveReload.listen();
	gulp.watch("source/**/*.html", ["copy-html"]);
	gulp.watch("source/scss/**/*.scss", ["sass"]);
});

// Default task is run when "gulp" is run from terminal
gulp.task("default", [
	"copy-html", 
	"lint", 
	"sass", 
	"combine-uglify-scripts", 
	"express-server",
	"watch"
]);