const gulp = require('gulp');
const ts = require('gulp-typescript');
const jasmine = require('gulp-jasmine');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
    const merge = require('merge2');
    //const tsProject = ts.createProject('tsconfig.json');

    var tsResult = tsProject.src()
	    .pipe(sourcemaps.init())
        .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest(tsProject.config.compilerOptions.declarationDir)), //'./definitions')),
        tsResult.js
            .pipe(sourcemaps.write())    
			.pipe(gulp.dest(tsProject.config.compilerOptions.outDir))
    ]);
});

gulp.task('clean', function () {
    // console.log('asdasd', tsProject.config.compilerOptions);
    return gulp.src([
        tsProject.config.compilerOptions.outDir,
        tsProject.config.compilerOptions.declarationDir
    ], { read: false }) //'dist'
        .pipe(clean());
});

gulp.task('test:run', function() {
    return gulp.src(tsProject.config.compilerOptions.outDir + '/spec/**') //dist
      .pipe(jasmine())
});

gulp.task('watch', ['default'], function() {
    gulp.watch('src/*.ts', ['default']);
});

gulp.task('test', [], function(cb) {
  runSequence('clean', 'build', 'test:run', cb);
});
gulp.task('default', [], function(cb) {
    runSequence('clean', 'build', cb);
});
