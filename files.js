const fs = require('fs');

const extensions = {
  js: {
    start: ['//', '/*', '*'],
    contains: ['//', '/*']
  },
  scss: {
    start: ['//', '/*', '*'],
    contains: ['//', '/*']
  },
  c: {
    start: ['//', '/*', '*'],
    contains: ['//', '/*']
  },
  cc: {
    start: ['//', '/*', '*'],
    contains: ['//', '/*']
  },
  h: {
    start: ['//', '/*', '*'],
    contains: ['//', '/*']
  },
  ts: {
    start: ['//', '/*', '*'],
    contains: ['//', '/*']
  },
  css: {
    start: ['//', '/*', '*'],
    contains: ['//', '/*']
  },
  less: {
    start: ['//', '/*', '*'],
    contains: ['//', '/*']
  },
  dart: {
    start: ['//', '/*', '*'],
    contains: ['//', '/*']
  },
  cpp: {
    start: ['//', '/*', '*'],
    contains: ['//', '/*']
  },
  go: {
    start: ['//', '/*', '*'],
    contains: ['//', '/*']
  },
  php: {
    start: ['//', '/*', '*', '#'],
    contains: ['//', '/*', '#']
  },
  rc: {
    start: ['//'],
    contains: ['//']
  },
  s: {
    start: ['//'],
    contains: ['//']
  },
  proto: {
    start: ['//'],
    contains: ['//']
  },
  yaml: {
    start: ['#'],
    contains: ['#']
  },
  py: {
    start: ['#'],
    contains: ['#']
  },
  bash: {
    start: ['#'],
    contains: ['#']
  },
  sh: {
    start: ['#'],
    contains: ['#']
  },
  yml: {
    start: ['#'],
    contains: ['#']
  },
  include: {
    start: ['#'],
    contains: ['#']
  },
  rc: {
    start: ['#'],
    contains: ['#']
  },
  dist: {
    start: ['#'],
    contains: ['#']
  },
  bat: {
    start: ['::'],
    contains: ['::']
  },
};

const ignoreFileNames = [
  '.json', '.snap', '.spec', '-test', '.internal',
  '.d.ts', '.gitignore', '.freezer', '.hz', '.lock', '.locks',
  '.preempt', 'Makefile', '.config', 'Kconfig', '.debug', '.test',
  '.clang-format', '.mod', '.sum', '.min', '.txt'
];

function getRootMdFiles(dir) {
  const rootFiles = fs.readdirSync(dir);
  return rootFiles.filter((file) => {
    return file.toLowerCase().indexOf('.md') !== -1;
  }).map((file) => {
    return dir + '/' + file;
  });
}

function findFiles(dir, content) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    if (fs.lstatSync(dir + '/' + file).isDirectory()) {
      findFiles(dir + '/' + file, content);
    } else {
      if (!ignoreFile(file)) {
        if (file.toLowerCase().indexOf('.md') !== -1) {
          content.mdFiles.push(dir + '/' + file);
        } else {
          content.otherFiles.push(dir + '/' + file);
        }
      }
    }
  })
}

function ignoreFile(file) {
  return !!ignoreFileNames.filter((name) => {
    return file.toLowerCase().indexOf(name.toLowerCase()) !== -1;
  }).length
}

function compareMdFiles(files, range) {
  const mdFiles = {};
  files.forEach((file) => {
    if (range[file].length) {
      const fileContent = fs.readFileSync(file, 'utf8').split('\n');
      const total = fileContent.length;
      const userLines = range[file].reduce((previous, current) => {
        return previous + ((current.end + 1) - current.start);
      }, 0);
      mdFiles[file] = {
        userLines,
        total,
      }
    }
  })
  return mdFiles;
}

function compareOtherFiles(files, ranges) {
  const otherFiles = {};
  files.forEach((file) => {
    if (ranges[file].length) {
      const fileContent = fs.readFileSync(file, 'utf8').split('\n');
      let splittedFile = file.split('/');
      splittedFile = splittedFile[splittedFile.length - 1].split('.');
      const extension = splittedFile[splittedFile.length - 1];
      otherFiles[file] = { userLines: 0, total: 0 };
      ranges[file].forEach((range) => {
        let lines = [];
        if (range.start === range.end) {
          lines = [fileContent[range.start - 1]];
        } else {
          lines = fileContent.slice(range.start - 1, range.end);
        }
        findCommentOnLine(lines, extension, file, otherFiles, 'userLines');
      });
      findCommentOnLine(fileContent, extension, file, otherFiles, 'total');
    }
  })
  return otherFiles;
}

function findCommentOnLine(lines, extension, file, otherFiles, position) {
  lines.forEach((line) => {
    if (extensions[extension]) {
      let found = false;
      for (let i = 0; i < extensions[extension].start.length; i++) {
        if (line && line.trim().startsWith(extensions[extension].start[i])) {
          otherFiles[file][position] += 1;
          found = true;
          break;
        }
      }
      if (!found) {
        for (let i = 0; i < extensions[extension].contains.length; i++) {
          if (line && line.indexOf(extensions[extension].contains[i]) !== -1) {
            otherFiles[file][position] += 1;
            found = true;
            break;
          }
        }
      }
    }
  })
}

module.exports = {
  getRootMdFiles,
  findFiles,
  compareMdFiles,
  compareOtherFiles,
}
