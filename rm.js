#!/usr/bin/env babel-node

require('./helper')
let ls = require('./ls')

let fs = require('fs').promise;
let path = require('path');
let dir = require('yargs')
  .argv['_'];

async function rm(path, root) {
  let stat = await fs.stat(path);

  if (stat.isDirectory(path)) {
    let paths = await ls(path, true);
    console.log("\n File paths = "+ paths+"\n");
    paths.forEach((filepath) => {
      fs.unlink(filepath);
    })
    rm()
  }
  else {
    fs.unlink(path);
    return;
  }

  let promise = fs.readdir(path)
  let fileNames = await promise


  for (let fileName of fileNames) {

    let filePath = path.join(dir, fileName);

    let stats = await fs.stat(filePath);
    process.stdout.write('\n\n Filename \n\n ::' + filePath +"\n");
    if (stats.isDirectory(filePath)) {
      try {
        rm(filePath);
      } catch (e) {
      }
    }
  }
}

// async function main() {
//   let filePaths = await rm(dir.toString())
//   console.log(filePaths);
// }
//
// main()
module.exports = rm
