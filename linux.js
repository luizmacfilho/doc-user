const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../linux'),
    otherFiles: [],
    name: 'linux',
    owner: 'torvalds',
    username: 'ColinIanKing',
  };
  const directories = ['../linux/kernel'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./linux/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../linux/')
  return fs.writeFileSync('./linux/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./linux/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./linux/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  const compareFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  result.otherFiles = compareFiles.otherFiles;
  fs.writeFileSync('./linux/quality.json', JSON.stringify(compareFiles.hasQuality, null, 2), 'utf8')
  // fs.writeFileSync('./linux/compare.json', JSON.stringify(result, null, 2), 'utf8')
  // calc.calc(result, './linux');
}

// start().then(() => {
  compare();
// });
