const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../bitcoin'),
    otherFiles: [],
    name: 'bitcoin',
    owner: 'bitcoin',
    username: 'MarcoFalke',
  };
  const directories = ['../bitcoin'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./bitcoin/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../bitcoin/')
  return fs.writeFileSync('./bitcoin/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./bitcoin/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./bitcoin/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  result.otherFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  fs.writeFileSync('./bitcoin/compare.json', JSON.stringify(result, null, 2), 'utf8')
  calc.calc(result, './bitcoin');
}

start().then(() => {
  compare();
});
