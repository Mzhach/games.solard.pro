const {dest} = require('gulp');
const ts = require('gulp-typescript');
const project = ts.createProject('tsconfig.json');

module.exports = function buildServer(cb) {
    return project.src()
        .pipe(project())
        .js
        .pipe(dest('build'))
};