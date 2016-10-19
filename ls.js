#!/usr/bin/env babel-node

require('./helper')

let fs = require('fs').promise;
let path = require('path');
let dir = require('yargs')
  .argv['_'];
let recursive = require('yargs')
  .argv['R'];
let shouldFetchDir = require('yargs')
  .argv['D'];

async function ls(dir, recurisive, shouldFetchDir) {
  let stat = await fs.stat(dir);

  if (!stat.isDirectory(dir)) {
    process.stdout.write('\n\n Filename \n\n ::' + filePath +"\n");
    return [dir];
  }

  let lsPromises = []

  let promise = fs.readdir(dir)
  let fileNames = await promise


  for (let fileName of fileNames) {

    let filePath = path.join(dir, fileName);

    let stats = await fs.stat(filePath);
    if (stats.isDirectory(filePath) && recurisive) {
      let promise = ls(filePath, recurisive)
      lsPromises.push(promise)
    } else if (!stats.isDirectory(filePath)){
      lsPromises.push(filePath)
    }
  }

  let ret = await Promise.all(lsPromises)
  if (!shouldFetchDir) return ret.reduce((c, n) => {
    return c.concat(n)
  }, []);
    else {
    return ret;
  }
}

// async function main() {
//   let filePaths = await ls(dir.toString(),recursive)
//   console.log(filePaths);
// }
//
// main()
module.exports = ls
