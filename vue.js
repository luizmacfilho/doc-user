const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('../vue'),
    otherFiles: [],
    name: 'vue',
    owner: 'vuejs',
    username: 'yyx990803',
  };
  const directories = ['../vue'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./vue/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '../vue/')
  return fs.writeFileSync('./vue/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./vue/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./vue/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  result.otherFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  fs.writeFileSync('./vue/compare.json', JSON.stringify(result, null, 2), 'utf8')
  calc.calc(result, './vue');
}

start().then(() => {
  compare();
});
