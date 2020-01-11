const gulp = require('gulp');
const rollup = require('rollup');
const rollupTypescript = require('rollup-plugin-typescript2');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const output = {
  file: 'dist/seatchart.js',
  format: 'umd',
  name: "Seatchart"
};
const input = 'src/seatchart.ts';
const plugins = [rollupTypescript()];

gulp.task('watch', function () {
  const watcher = rollup.watch({
    input,
    output,
    plugins,
    watch: [
      'src'
    ]
  });

  console.log('\n' + '\x1b[32m' + 'Watching files...' + '\x1b[0m', '\n');

  watcher.on('event', (event) => {
    if (event.code === 'BUNDLE_START') {
      console.log('\x1b[36m' + 'File changed' + '\x1b[0m' + ', bundling', '\x1b[35m' + event.input + '\x1b[0m');
    } else if (event.code === 'BUNDLE_END') {
      console.log('\x1b[36m' + 'Project bundled' + '\x1b[0m', 'in', event.duration, 'ms to', '\x1b[35m' + 'dist/seatchart.js' + '\x1b[0m' + '\n');
    } else if (event.code === 'ERROR') {
      console.log(event.error + '\n');
    } else if (event.code === 'FATAL') {
      console.log(event.error + '\n');
    }
  });

  return watcher;
});

gulp.task('default', async function () {
  console.log('\n' + '\x1b[32m' + 'Build project...' + '\x1b[0m');

  try {
    const bundle = await rollup.rollup({
      input,
      plugins,
    });

    await bundle.write(output);

    gulp.src('dist/seatchart.js')
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('dist'));

    console.log('\x1b[32m' + 'Built successfully!' + '\x1b[0m', '\n');
  } catch (e) {
    console.log('\x1b[31m' + 'WARNING! An error occurred...' + '\x1b[0m');
    console.log(e.message, '\n');
  }
});