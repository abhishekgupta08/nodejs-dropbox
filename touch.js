#!/usr/bin/env babel-node

require('./helper')
let fs = require('fs').promise

let fileName = require('yargs')
  .argv['_'];

async function touch(filename) {
  var fd = await fs.open(filename, 'r');
  let atime = fs.stat(filename)['atime'];
  await fs.futimes(fd, new Date(atime), new Date(),
    ()=>{console.log("updating the modified time")});
}
// touch(fileName.toString())
module.exports = touch
