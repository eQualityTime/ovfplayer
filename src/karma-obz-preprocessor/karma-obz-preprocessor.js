/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020
This file is part of OVFPlayer.
OVFPlayer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
OVFPlayer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with OVFPlayer.  If not, see <https://www.gnu.org/licenses/>.
::END::LICENCE:: */
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
