const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../go'),
    otherFiles: [],
    name: 'go',
    owner: 'golang',
    username: 'ianlancetaylor',
  };
  const directories = ['../go/src/syscall'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./go/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../go/')
  return fs.writeFileSync('./go/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./go/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./go/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  result.otherFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  fs.writeFileSync('./go/compare.json', JSON.stringify(result, null, 2), 'utf8')
  calc.calc(result, './go');
}

start().then(() => {
  compare();
});
