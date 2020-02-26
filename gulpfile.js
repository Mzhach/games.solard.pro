const {series, parallel} = require('gulp');
const cleanBuild = require('./gulp/cleanBuild');
const buildServer = require('./gulp/buildServer');
const buildClient = require('./gulp/buildClient');

module.exports.build = series(cleanBuild, parallel(buildServer, buildClient));