'use strict';

var gulp = require('gulp'),
	bs = require('browser-sync').create();

gulp.task('scripts',function(){

  return gulp.src('./site/src/**/*.js')
        .pipe(gulp.dest('./site/dist'));

});

gulp.task('watch', function(){

  bs.init({
    server: {
      baseDir: './site'
    }
  });

  gulp.watch('./site/**/*')
    .on('change',bs.reload);

    gulp.watch('./site/**/*.js',['scripts']);

});

gulp.task('default',['scripts','watch']);
