import gulp from 'gulp';
import config from '../config';

gulp.task('cname' ,() => {
  return gulp.src('./src/CNAME')
    .pipe(gulp.dest(config.dest));
})