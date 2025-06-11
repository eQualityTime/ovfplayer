import { replaceInFileSync } from 'replace-in-file';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LICENCE_SUFFIX  = '::END::LICENCE::';
const LICENCE_PREFIX  = '::START::LICENCE::';
const LICENCE_REGEX   = new RegExp(LICENCE_PREFIX + '([\\s\\S]*)' + LICENCE_SUFFIX);
const FILE_EXTENSIONS = ['js', 'ts', 'html', 'css'];
const IGNORE_DIRS     = ['dist', 'node_modules', 'e2e'];

function readHeader() {
  return readFileSync(resolve(__dirname, 'licence-header.txt'), 'utf-8');
}

function buildGlobs() {
  return FILE_EXTENSIONS.map(ext => resolve(__dirname, '**', '*.' + ext));
}

function buildIgnore() {
  return IGNORE_DIRS.map(dir => resolve(__dirname, dir, '**'));
}

function updateFiles() {
  console.log('Updating licence in files');
  console.log(__dirname);
  const globs = buildGlobs();
  console.log(globs);
  const licenceHeader = readHeader();
  const options = {
    files: globs,
    from: LICENCE_REGEX,
    to: LICENCE_PREFIX + licenceHeader + LICENCE_SUFFIX,
    ignore: buildIgnore()
  };
  try {
    const changes = replaceInFileSync(options).filter(result => result.hasChanged);
    if (changes.length === 0) {
      console.log('No files updated');
    } else {
      console.log('Modified files:', changes.map(result => result.file).join('\n\t'));
    }
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}

updateFiles();
