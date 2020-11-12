const project_folder = 'dist';
const source_folder = 'src';

const path = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    images: project_folder + '/images/',
    icons: project_folder + '/icons/'
  },
  src: {
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
    css: source_folder + '/sass/style.sass',
    js: source_folder + '/js/index.js',
    images: source_folder + '/images/',
    icons: source_folder + '/icons/'
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/sass/**/*.sass',
    js: source_folder + '/js/**/*.js',
    images: source_folder + '/images/**/*.*',
    icons: source_folder + '/icons/**/*.*'
  },
  clean: './' + project_folder + '/'
}

const { src, dest } = require('gulp');
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const del = require('del');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const imageMin = require('gulp-imagemin')

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/'
    },
    port: 3000,
    notify: false
  });
};

function html() {
  return src(path.src.html)
    .pipe(fileInclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
};

function css() {
  return src(path.src.css)
    .pipe(
      scss(
        {
          outputStyle: 'expanded'
        })
    )
    .pipe(
      groupMedia()
    )
    .pipe(
      autoprefixer({
        cascade: true
      })
    )
    .pipe(dest(path.build.css))
    .pipe(
      cleanCss()
    )
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
};

function js() {
  return src(path.src.js)
    .pipe(fileInclude())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js'
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
};

function img() {
  return src(path.src.images)
    .pipe(dest(path.build.images))
    .pipe(browsersync.stream());
};

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], img);
};

function clean() {
  return del(path.clean);
};

const build = gulp.series(clean, gulp.parallel(js, css, html, img));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
