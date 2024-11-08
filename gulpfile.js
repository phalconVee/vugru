const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();

// Paths
const paths = {
    html: {
        src: 'src/*.html',
        dest: 'dist'
    },
    css: {
        src: 'src/assets/css/**/*.css',
        dest: 'dist/assets/css'
    },
    js: {
        src: 'src/assets/js/**/*.js',
        dest: 'dist/assets/js'
    },
    images: {
        src: 'src/assets/images/**/*.{jpg,jpeg,png,gif,svg}',
        dest: 'dist/assets/images'
    },
    partials: {
        src: 'src/assets/partials/**/*.html'
    }
};

// HTML Task - Process HTML files and include partials
gulp.task('html', function () {
    return gulp.src(paths.html.src)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream()); // Reload browser after HTML changes
});

// CSS Task - Move CSS files to the dist folder
gulp.task('css', function () {
    return gulp.src(paths.css.src)
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browserSync.stream()); // Inject CSS changes without full reload
});

// JavaScript Task - Move JavaScript files to the dist folder
gulp.task('js', function () {
    return gulp.src(paths.js.src)
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream()); // Inject CSS changes without full reload
});

// Images Task - Move images to the dist folder
gulp.task('images', function () {
    return gulp.src(paths.images.src, {encoding: false})
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream()); // Reload browser after JS changes
});

// BrowserSync Task - Serve files and watch for changes
gulp.task('serve', function () {
    browserSync.init({
        server: './dist'
    });

    // Watch for changes in each task
    gulp.watch(paths.html.src, gulp.series('html'));
    gulp.watch(paths.partials.src, gulp.series('html')); // Watch partials
    gulp.watch(paths.css.src, gulp.series('css'));
    gulp.watch(paths.js.src, gulp.series('js'));
    gulp.watch(paths.images.src, gulp.series('images'));
});

// Watch Task - Watch for changes in HTML, CSS, JavaScript, and images
// gulp.task('watch', function () {
//     gulp.watch(paths.html.src, gulp.series('html'));
//     gulp.watch(paths.partials.src, gulp.series('html')); // Watch partials
//     gulp.watch(paths.css.src, gulp.series('css'));
//     gulp.watch(paths.js.src, gulp.series('js'));
//     gulp.watch(paths.images.src, gulp.series('images'));
// });

// Default Task - Run all tasks and start watching
gulp.task('default', gulp.series('html', 'css', 'js', 'images', 'serve'));
