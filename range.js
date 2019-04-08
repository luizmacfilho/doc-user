const GithubGraphQLApi = require('node-github-graphql')
const fs = require('fs')

const github = new GithubGraphQLApi({
  token: '1f3e467f9560260d9d0f5533b3439b2784aaf57d'
});
const rangeFile = {
  mdFiles: {},
  otherFiles: {},
};

async function getRangeContent(content, dir) {
  await getRangeMdFiles(content, dir);
  return getRangePackOtherFiles(content, dir).then(() => {
    return rangeFile;
  });
}

function getRangeMdFiles(content, dir) {
  const promises = [];
  content.mdFiles.forEach((file) => {
    const clearedFile = file.replace(dir, '');
    promises.push(getRanges(content.name, content.owner, clearedFile, content.username)
      .then((range) => {
        rangeFile.mdFiles[file] = range;
      })
    )
    console.log(file);
  })
  return Promise.all(promises);
}

function getRangeOtherFiles(content, dir) {
  return getOtherFiles(content.otherFiles, content, 0, dir)
}

function getOtherFiles(loops, content, i, dir) {
  const file = loops[i];
  const clearedFile = file.replace(dir, '');
  return getRanges(content.name, content.owner, clearedFile, content.username)
  .then((range) => {
    rangeFile.otherFiles[file] = range;
    console.log(i + 1, file);
    i+= 1;
    if (i < loops.length) {
      return getOtherFiles(loops, content, i, dir);
    } else {
      return;
    }
  });
}

function getRangePackOtherFiles(content, dir) {
  const size = 2;
  const numberOfArrays = Math.ceil(content.otherFiles.length / size);
  const arrays = [];
  for (i = 1; i <= numberOfArrays; i++) {
    arrays.push(content.otherFiles.slice((i - 1) * size, i * size));
  }
  return getPackOtherFiles(arrays, content, 0, dir);
}

function getPackOtherFiles(loops, content, i, dir) {
  const promises = [];
  loops[i].forEach((file) => {
    const clearedFile = file.replace(dir, '');
    promises.push(getRanges(content.name, content.owner, clearedFile, content.username).then((range) => {
      console.log(i + 1, file);
      rangeFile.otherFiles[file] = range;
      return;
    }));
  });
  return Promise.all(promises).then(() => {
    i+= 1;
    if (i < loops.length) {
      return getPackOtherFiles(loops, content, i, dir);
    } else {
      return;
    }
  })
}
function getRanges(name, owner, path, username) {
  return new Promise((resolve, reject) => {
    github.query(`
    {
      repository(name: ${name}, owner: ${owner}) {
        ref(qualifiedName:"master") {
          target {
            ... on Commit {
              blame(path: "${path}") {
                ranges {
                  commit {
                    author {
                      name
                      user {
                        login
                      }
                    }
                  }
                  startingLine
                  endingLine
                  age
                }
              }
            }
          }
        }
      }
    }
    `, null, (res, err) => {
      if (err) {
        console.log(JSON.stringify(err));
        resolve([]);
      } else {
        const ranges = res.data.repository.ref.target.blame.ranges;
        const authorRanges = ranges.filter((range) => {
          return range.commit.author
            &&  range.commit.author.user
            && range.commit.author.user.login === username;
        }).map((range) => {
          return {
            start: range.startingLine,
            end: range.endingLine,
          }
        });
        console.log('Github get finished')
        resolve(authorRanges);
      }
    })
  });
}

module.exports = {
  getRangeContent
}