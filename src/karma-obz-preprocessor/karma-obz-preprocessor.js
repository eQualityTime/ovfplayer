var util = require('util');

var TEMPLATE = '' +
  'window.__obz__ = window.__obz__ || {};\n' +
  'window.__obz__[\'%s\'] = \'%s\'';

var escapeContent = function (content) {
  return JSON.stringify({ name: 'Simon' });
};

var createOBZPreprocessor = function (logger, basePath, config) {

  var testBasePath = basePath.replace('/src', '');
  var log = logger.create('preprocessor.obz');
  var ret = function (content, file, done) {

    var fixtureName = file.originalPath
      .replace(testBasePath + '/', '')
      .replace('test/fixtures/obz/', '')
      .replace(/\.obz$/, '');
    log.log('Processing "%s" to "%s".', file.originalPath, fixtureName);
    file.path = file.path + '.js';
    done(util.format(TEMPLATE, fixtureName, escapeContent(content)));
  };
  ret.handleBinaryFiles = true;
  return ret;
};

createOBZPreprocessor.$inject = ['logger', 'config.basePath', 'config.OBZPreprocessor'];

module.exports = createOBZPreprocessor;
