var util = require('util');
require('fs')

var TEMPLATE = '' +
  'window.__obz__ = window.__obz__ || {};\n' +
  'window.__obz__[\'%s\'] = \'%s\'';

var convertContent = function (content) {
  var bufferBase64 = content.toString('base64');
  return JSON.stringify({ data: bufferBase64 });
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
    done(util.format(TEMPLATE, fixtureName, convertContent(content)));
  };
  ret.handleBinaryFiles = true;
  return ret;
};

createOBZPreprocessor.$inject = ['logger', 'config.basePath', 'config.OBZPreprocessor'];

module.exports = createOBZPreprocessor;
