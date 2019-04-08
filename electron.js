const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../electron'),
    otherFiles: [],
    name: 'electron',
    owner: 'electron',
    username: 'nornagon',
  };
  const directories = ['../electron'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./electron/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../electron/')
  return fs.writeFileSync('./electron/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./electron/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./electron/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  result.otherFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  fs.writeFileSync('./electron/compare.json', JSON.stringify(result, null, 2), 'utf8')
  calc.calc(result, './electron');
}

start().then(() => {
  compare();
});
