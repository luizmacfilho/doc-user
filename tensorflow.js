const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../tensorflow'),
    otherFiles: [],
    name: 'tensorflow',
    owner: 'tensorflow',
    username: 'yongtang',
  };
  const directories = ['../tensorflow/tensorflow/core/lib'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./tensorflow/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../tensorflow/')
  return fs.writeFileSync('./tensorflow/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./tensorflow/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./tensorflow/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  const compareFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  result.otherFiles = compareFiles.otherFiles;
  fs.writeFileSync('./tensorflow/quality.json', JSON.stringify(compareFiles.hasQuality, null, 2), 'utf8')
  // fs.writeFileSync('./tensorflow/compare.json', JSON.stringify(result, null, 2), 'utf8')
  // calc.calc(result, './tensorflow');
}

// start().then(() => {
  compare();
// });
