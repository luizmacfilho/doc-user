const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../Font-Awesome'),
    otherFiles: [],
    name: 'Font-Awesome',
    owner: 'FortAwesome',
    username: 'robmadole',
  };
  const directories = ['../Font-Awesome/js', '../Font-Awesome/less', '../Font-Awesome/scss', '../Font-Awesome/css'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./font-awesome/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../font-awesome/')
  return fs.writeFileSync('./font-awesome/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./font-awesome/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./font-awesome/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  result.otherFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  fs.writeFileSync('./font-awesome/compare.json', JSON.stringify(result, null, 2), 'utf8')
  calc.calc(result, './font-awesome');
}

start().then(() => {
  compare();
});
