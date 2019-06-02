const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../vscode'),
    otherFiles: [],
    name: 'vscode',
    owner: 'Microsoft',
    username: 'mjbvz',
  };
  const directories = ['../vscode/src/vs/platform', '../vscode/src/vs/base'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./vscode/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../vscode/')
  return fs.writeFileSync('./vscode/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./vscode/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./vscode/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  const compareFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  result.otherFiles = compareFiles.otherFiles;
  fs.writeFileSync('./vscode/quality.json', JSON.stringify(compareFiles.hasQuality, null, 2), 'utf8')
  // fs.writeFileSync('./vscode/compare.json', JSON.stringify(result, null, 2), 'utf8')
  // calc.calc(result, './vscode');
}

// start().then(() => {
  compare();
// });
