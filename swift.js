const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../swift'),
    otherFiles: [],
    name: 'swift',
    owner: 'apple',
    username: 'slavapestov',
  };
  const directories = ['../swift/lib'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./swift/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../swift/')
  return fs.writeFileSync('./swift/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./swift/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./swift/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  const compareFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  result.otherFiles = compareFiles.otherFiles;
  fs.writeFileSync('./swift/quality.json', JSON.stringify(compareFiles.hasQuality, null, 2), 'utf8')
  // fs.writeFileSync('./swift/compare.json', JSON.stringify(result, null, 2), 'utf8')
  // calc.calc(result, './swift');
}

// start().then(() => {
  compare();
// });
