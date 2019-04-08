const fs = require('fs');

function calc(result, dir) {
  const data = { userLines: 0, totalLines: 0 , percent: 0, totalFiles: 0  };
  sumData(result.mdFiles, data);
  sumData(result.otherFiles, data);
  if (data.totalLines !== 0) {
    data.percent = (data.userLines / data.totalLines) * 100;
  }
  fs.writeFileSync(`${dir}/calc.json`, JSON.stringify(data, null, 2));
}

function sumData(files, data) {
  Object.keys(files).forEach(file => {
    data.userLines += files[file].userLines;
    data.totalLines += files[file].total;
    data.totalFiles += 1;
  });
}

module.exports = {
  calc
}