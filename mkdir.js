#!/usr/bin/env babel-node

require('./helper')

let fs = require('fs').promise;
let path = require('path');
let dir = require('yargs')
  .argv['_'];

async function mkdir(path, root) {

  let dirs = path.split('/');
  let dirName = dirs.shift();
  root = (root || '') + dirName + '/';
  try { await fs.mkdir(root); }
  catch (e) {
    //dir wasn't made, something went wrong
    //throw new Error(e);
  }

  return !dirs.length || mkdir(dirs.join('/'), root);
}

async function main() {
  let filePaths = await mkdir(dir.toString())
  console.log(filePaths);
}
module.exports = mkdir
