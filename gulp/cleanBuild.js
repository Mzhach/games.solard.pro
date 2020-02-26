const {src} = require('gulp');
const clean = require('gulp-clean');

module.exports = function cleanBuild(cb) {
    return src('build', {read: false, allowEmpty: true})
        .pipe(clean());
}