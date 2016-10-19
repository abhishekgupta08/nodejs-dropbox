#!/usr/bin/env babel-node

require('./helper')

async function echo(text) {
    // Use 'await' in here
    // Your implementation here
    if (text.length > 0) {
        console.log(text.reduce((a, b) => a + " " + b));
    }
}

module.exports = echo
