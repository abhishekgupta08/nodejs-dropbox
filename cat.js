#!/usr/bin/env babel-node

require('./helper')
let fs = require('fs').promise

let fileName = require('yargs')
  .argv['_'];

async function cat(fileName) {
  let data = await fs.readFile(fileName);
  process.stdout.write(data);
}
//cat(fileName.toString())
module.exports = cat
