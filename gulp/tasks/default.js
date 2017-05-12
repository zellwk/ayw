import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
// Import configs
import config from '../config';

let $ = plugins();

// Not done yet
gulp.task('default', (cb) => {
  if (config.env === 'dev') {
    runSequence(
      ['clean', 'lint:js'],
      ['sprites', 'images', 'fonts'],
      ['sass', 'generateSite'],
      ['browserSync', 'webpack', 'watch'],
      cb);
  } else if (config.env === 'prod' || config.env === 'production') {
    runSequence(
      ['clean', 'lint:js'],
      ['images', 'fonts', 'webpack', 'cname'],
      ['sass', 'generateSite'],
      'useref',
      // 'critical',
      'browserSync',
      cb
      );
  }
});

// TODO: Add CSS regression test (later)
// TODO: Add Js unit tests (later)

// Prod:
// TODO: gzip? (Check if Amazon requires g-zipping)
// TODO: Deploy with rsync (later, when done with productino tasks)

// // Deploy to S3

// gulp.task('deploy', () => {
//   gulp.src('./dist/**/*')
//     .pipe($.s3(aws));
// });

gulp.task('deploy', () => {
  gulp.src('./dist/**/*')
  .pipe($.ghPages());
});
