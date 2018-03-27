const gulp = require('gulp');
const ts = require('gulp-typescript');
const jasmine = require('gulp-jasmine');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const path = require('path');
const fs = require('fs');
const replace = require('gulp-replace');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', [], function (cb) {
    runSequence('subbuild', 'moveindex', cb);
});

gulp.task('subbuild', function() {
    const merge = require('merge2');

    var tsResult = tsProject.src()
	    .pipe(sourcemaps.init())
        .pipe(tsProject());

    let toMerge = [
        tsResult.dts.pipe(gulp.dest(tsProject.config.compilerOptions.declarationDir || tsProject.config.compilerOptions.outDir)),
        tsResult.js
            .pipe(sourcemaps.write())    
			.pipe(gulp.dest(tsProject.config.compilerOptions.outDir))
    ];

    return merge(toMerge);
});

gulp.task('moveindex', function () {
    const outDir = tsProject.config.compilerOptions.outDir;    
    const rx = /([\'\"])(\.\/src)/g;
    return gulp.src([path.join(outDir, 'index.d.ts'), path.join(outDir, 'index.js')])
        .pipe(replace(rx, "$1./lib/src"))
        .pipe(gulp.dest(path.join(outDir, '../')));
    // fs.renameSync(
    //     path.join(tsProject.config.compilerOptions.outDir, "src/"),
    //     path.join(tsProject.config.compilerOptions.outDir, tsProject.config.compilerOptions.outDir)
    // );
    // return gulp.src(tsProject.config.compilerOptions.outDir)
    //     .pipe(gulp.dest('../'));
    // return gulp.src(path.join(tsProject.config.compilerOptions.outDir, "src/"))
    //     .pipe(rename(path.join(tsProject.config.compilerOptions.outDir, tsProject.config.compilerOptions.outDir)))
    //     .pipe(gulp.dest(tsProject.config.compilerOptions.outDir)); 
});

gulp.task('clean', function () {
    let folders = [tsProject.config.compilerOptions.outDir];
    if (tsProject.config.compilerOptions.declarationDir) {
        folders.push(tsProject.config.compilerOptions.declarationDir);
    }
    return gulp.src(folders, { read: false })
        .pipe(clean());
});

gulp.task('test:run', function() {
    return gulp.src(path.join(tsProject.config.compilerOptions.outDir, '/spec/**'))
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
