const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../bootstrap'),
    otherFiles: [],
    name: 'bootstrap',
    owner: 'twbs',
    username: 'XhmikosR',
  };
  const directories = ['../bootstrap'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./bootstrap/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../bootstrap/')
  return fs.writeFileSync('./bootstrap/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./bootstrap/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./bootstrap/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  const compareFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  result.otherFiles = compareFiles.otherFiles;
  fs.writeFileSync('./bootstrap/quality.json', JSON.stringify(compareFiles.hasQuality, null, 2), 'utf8')
  // fs.writeFileSync('./bootstrap/compare.json', JSON.stringify(result, null, 2), 'utf8')
  // calc.calc(result, './bootstrap');
}

// start().then(() => {
  compare();
// });
