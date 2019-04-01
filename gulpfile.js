'use strict';

const del = require('del');
const path = require('path');
const gulp = require('gulp');
const gulpLess = require('gulp-less');
const gulpPug = require('gulp-pug');
const gulpAutoprefixer = require('gulp-autoprefixer');
const gulpBabel = require('gulp-babel');
const gulpConcat = require('gulp-concat');
const gulpUglify = require('gulp-uglify');
const gulpPlumber = require('gulp-plumber');
const gulpImagemin = require('gulp-imagemin');
const gulpNewer = require('gulp-newer');
const gulpArgs = require('yargs').argv;
const gulpLessGlob = require('gulp-less-glob');
const gulpBrowserSync = require('browser-sync');
const gulpWait = require('gulp-wait2');
const imageminPngquant = require('imagemin-pngquant');

let nameChosenPage = gulpArgs.pg || '*';

const paths = {
  dist: {
  html: 'dist/',
  js: 'dist/js/',
  css: 'dist/css/',
  images: 'dist/images/',
  i: 'dist/i/',
  fonts: 'dist/fonts/'
  },
  src: {
  html: 'src/pug/' + nameChosenPage + '.pug',
  js: 'src/js/*.js',
  jsLib: [
    'node_modules/jquery/dist/jquery.min.js'
  ],
  css: ['src/less/style.less'],
  images: 'src/images/**/*.*',
  i: 'src/i/**/*.*',
  fonts: 'src/fonts/**/*.*'
  },
  watch: {
  html: ['src/pug/**/*.pug','src/blocks/**/*.pug'],
  js: ['src/js/**/*.js'],
  css:['src/less/**/*.less','src/blocks/**/*.less'],
  images: 'src/images/**/*.*',
  i: 'src/i/**/*.*',
  fonts: 'src/fonts/**/*.*'
  }
};


let clean = () => del(paths.dist.html);
let cleanCss = () => del(paths.dist.css);
let cleanHtml = () => del(paths.dist.html + '*.html');
let cleanI = () => del(paths.dist.i);
let cleanFonts = () => del(paths.dist.fonts);
let cleanJs = () => del(paths.dist.js);

let less = () => gulp.src(paths.src.css)
  .pipe(gulpPlumber())
  .pipe(gulpLessGlob())
  .pipe(gulpLess({
  outputStyle: 'compressed'
  }))
  .pipe(gulpAutoprefixer({
    grid: true,
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(paths.dist.css));

let pug = () => gulp.src(paths.src.html)
  .pipe(gulpPlumber())
  .pipe(gulpPug({
  pretty: true,
  cache: true
  }))
  .pipe(gulp.dest(paths.dist.html));

let images = () => gulp.src(paths.src.images, {allowEmpty: true})
  .pipe(gulpNewer(paths.dist.images))
  .pipe(gulpImagemin({
  progressive: true,
  svgoPlugins: [{removeViewBox: false}],
  use: [imageminPngquant()],
  interlaced: true
  }))
  .pipe(gulp.dest(paths.dist.images))
  .pipe(gulpWait(100))
  .pipe(gulpBrowserSync.reload({
  stream: true
  }));

let i = () => gulp.src(paths.src.i, {allowEmpty: true}).pipe(gulp.dest(paths.dist.i));

let fonts = () => gulp.src(paths.src.fonts, {allowEmpty: true}).pipe(gulp.dest(paths.dist.fonts));

let jsLib = () => gulp.src(paths.src.jsLib, {allowEmpty: true})
  .pipe(gulpUglify())
  .pipe(gulpConcat('lib.js'))
  .pipe(gulp.dest(paths.dist.js));

let jsApp = () => gulp.src(paths.src.js, {allowEmpty: true})
  .pipe(gulpBabel({
  presets: ['@babel/env']
  }))
  .pipe(gulpConcat('app.js'))
  .pipe(gulp.dest(paths.dist.js));

let jsAppMinify = () => gulp.src(paths.src.js, {allowEmpty: true})
  .pipe(gulpBabel({
  presets: ['@babel/env']
  }))
  .pipe(gulpUglify())
  .pipe(gulpConcat('app.js'))
  .pipe(gulp.dest(paths.dist.js));

let reloadBrowser = () => gulp.src(paths.src.js, {allowEmpty: true}).pipe(gulpWait(100))
  .pipe(gulpBrowserSync.reload({
  stream: true
}));

let watch = () => {
  gulp.watch(paths.watch.css, gulp.series(cleanCss, less, reloadBrowser));
  gulp.watch(paths.watch.html, gulp.series(cleanHtml, pug, reloadBrowser));
  gulp.watch(paths.watch.i, gulp.series(cleanI, i, reloadBrowser));
  gulp.watch(paths.watch.fonts, gulp.series(cleanFonts, fonts, reloadBrowser));
  gulp.watch(paths.watch.js, gulp.series(cleanJs, jsLib, jsApp, reloadBrowser));

  let imagesWatcher = gulp.watch(paths.watch.images, images);
  imagesWatcher.on('unlink', (unlinkPath) => {
  let filePathFromSrc = path.relative(path.resolve('src/images'), unlinkPath);
  let distFilePath = path.resolve('dist/images', filePathFromSrc);
  del(distFilePath);
  console.log("Delete file: " + distFilePath);
  });
};

let browserSync = () =>
  gulpBrowserSync.init({
  server: {
    baseDir: "dist"
  }
  });

gulp.task('default',
  gulp.series(
  clean,
  gulp.parallel(less, pug, images, i, fonts, jsLib, jsApp),
  gulp.parallel(watch,browserSync)
  )
);

gulp.task('minify',
  gulp.series(
  clean,
  gulp.parallel(less, pug, images, i, fonts, jsLib, jsAppMinify)
  )
);
