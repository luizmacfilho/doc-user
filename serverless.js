const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../serverless'),
    otherFiles: [],
    name: 'serverless',
    owner: 'serverless',
    username: 'dschep',
  };
  const directories = ['../serverless'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./serverless/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../serverless/')
  return fs.writeFileSync('./serverless/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./serverless/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./serverless/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  const compareFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  result.otherFiles = compareFiles.otherFiles;
  fs.writeFileSync('./serverless/quality.json', JSON.stringify(compareFiles.hasQuality, null, 2), 'utf8')
  // fs.writeFileSync('./serverless/compare.json', JSON.stringify(result, null, 2), 'utf8')
  // calc.calc(result, './serverless');
}

// start().then(() => {
  compare();
// });
