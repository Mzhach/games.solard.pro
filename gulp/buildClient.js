const {dest} = require('gulp');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');
const es = require('event-stream');

const files = [
    'index.ts',
    'game.ts'
];

module.exports = function buildClient(cb) {
    var tasks = files.map(function(entry) {
        return browserify({
             basedir: './src/client',
             entries: [entry]
            })
            .plugin(tsify)
            .bundle()
            .pipe(source(entry))
            .pipe(rename({extname: '.bundle.js'}))
            .pipe(dest('./build/client'));
        }
    );

    es.merge(tasks).on('end', cb);
    //return es.merge.apply(null, tasks);
}