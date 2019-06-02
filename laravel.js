const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../laravel'),
    otherFiles: [],
    name: 'laravel',
    owner: 'laravel',
    username: 'taylorotwell',
  };
  const directories = ['../laravel'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./laravel/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../laravel/')
  return fs.writeFileSync('./laravel/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./laravel/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./laravel/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  const compareFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  result.otherFiles = compareFiles.otherFiles;
  fs.writeFileSync('./laravel/quality.json', JSON.stringify(compareFiles.hasQuality, null, 2), 'utf8')
  // fs.writeFileSync('./laravel/compare.json', JSON.stringify(result, null, 2), 'utf8')
  // calc.calc(result, './laravel');
}

// start().then(() => {
  compare();
// });
