const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../flutter'),
    otherFiles: [],
    name: 'flutter',
    owner: 'flutter',
    username: 'jonahwilliams',
  };
  const directories = ['../flutter'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./flutter/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../flutter/')
  return fs.writeFileSync('./flutter/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./flutter/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./flutter/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  result.otherFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  fs.writeFileSync('./flutter/compare.json', JSON.stringify(result, null, 2), 'utf8')
  calc.calc(result, './flutter');
}

start().then(() => {
  compare();
});
