/**
 * <REPO_LOCAL_PATH> - local onde o repositório foi clonado
 * <REPO_NAME> - nome do repositório no Github
 * <REPO_OWNER> - nome do proprietário do repositório
 * <REPO_USER_LOGIN> - nome do usuário desejado para avaliação
 * <REPO_DIRECTORIES> - strings com diretórios a serem avaliados
 * <DIR_RESULT> - nome do diretório onde serão criados os arquivos de resultados
 */

const fs = require('fs');
const ownFs = require('./files');
const range = require('./range');
const calc = require('./calc');

async function start() {

  const content = {
    mdFiles: ownFs.getRootMdFiles('<REPO_LOCAL_PATH>'),
    otherFiles: [],
    name: '<REPO_NAME>',
    owner: '<REPO_OWNER>',
    username: '<REPO_USER_LOGIN>',
  };
  const directories = ['<REPO_DIRECTORIES>'];

  directories.forEach((dir) => {
    ownFs.findFiles(dir, content);
  });

  fs.writeFileSync('./<DIR_RESULT>/files.json', JSON.stringify(content, null, 2), 'utf8')

  const ranges = await range.getRangeContent(content, '<REPO_LOCAL_PATH>/')
  return fs.writeFileSync('./<DIR_RESULT>/range.json', JSON.stringify(ranges, null, 2), 'utf8')
}

function compare() {
  const content = JSON.parse(fs.readFileSync('./<DIR_RESULT>/files.json'));
  const ranges = JSON.parse(fs.readFileSync('./<DIR_RESULT>/range.json'));
  const result = {};
  result.mdFiles = ownFs.compareMdFiles(content.mdFiles, ranges.mdFiles);
  result.otherFiles = ownFs.compareOtherFiles(content.otherFiles, ranges.otherFiles);
  fs.writeFileSync('./<DIR_RESULT>/compare.json', JSON.stringify(result, null, 2), 'utf8')
  calc.calc(result, './<DIR_RESULT>');
}

start().then(() => {
  compare();
});
