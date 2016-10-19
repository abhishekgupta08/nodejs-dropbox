require('./helper')
let Boom = require('boom')
let archiver = require('archiver')

const path = require('path')
const fs = require('fs').promise
const file = require('fs')

const ls = require('./ls')
const cat = require('./cat')
const rm = require('./rm')
const mkdir = require('./mkdir')
const touch = require('./touch')
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const getLocalFilePathFromRequest = (request) => {
  var f =  request.params.file ? request.params.file : "/"
  return path.join(__dirname, 'files', f)
};
async function getDirHandler(request, reply) {
  // TODO: If req.url points to a directory
  // TODO: If has the 'Accept: application/x-gtar' header
  console.log("\n-------- process.cwd() \n "+ process.cwd());
  const filePath = getLocalFilePathFromRequest(request);
  const stat = await fs.stat(filePath);
  console.log(" \n getDirHandler headers :: ", request.headers);
  if (request.headers['accept'] === 'application/x-gtar') {
    let archive = archiver.create('zip', {});
    reply(archive)
    archive.directory(filePath);
    // archive.bulk([
    //   { expand: true, cwd: 'source', src: ['**'], dest: 'source'}
    // ])
    archive.finalize()
  }
  else reply(ls(filePath, true));
};

export async function readHandler(request, reply) {
  console.log("\n-------- process.cwd() \n "+ process.cwd());
  const filePath = getLocalFilePathFromRequest(request)
  console.log(`Reading ${filePath}`)
  const stat = await fs.stat(filePath).catch(reason =>
    console.log("\n Error reason :: "+reason));
  if (filePath.endsWith("/") && stat && stat.isDirectory()) {
    await getDirHandler(request, reply);
  }
  else if (!filePath.endsWith("/") && stat && stat.isFile()) {
    var data = file.createReadStream(filePath);
    console.log("printing data----  " + data.toString());
    reply(data).header('Content-Length', data.length)
      .header('Content-Type', 'text/html')
      .header('usename', 'abhishekgupta');
  }
  else {
    reply(Boom.notFound(`${filePath} Resource not found!!!`));
  }
};

export async function setHeaders(request, reply) {
  const filePath = getLocalFilePathFromRequest(request);
  const data = await fs.promise.readFile(filePath);
  return reply({'Content-Length': data.length,
    'Content-Type': 'text/html'});
};

export async function createHandler(request, reply) {
  /* eslint no-unused-expressions: 0 */
  const filePath = getLocalFilePathFromRequest(request)

  const stat = await fs.stat(filePath).catch(reason =>
    console.log("\n Error reason :: "+reason));
  if (filePath.endsWith("/") && stat && stat.isDirectory()) {
    reply(Boom.methodNotAllowed('Directory already exists!!'));
  }
  else if (!filePath.endsWith("/") && stat && stat.isFile()) {
    reply(Boom.methodNotAllowed('File already exists!!'));
  }
  else if (!filePath.endsWith("/") ) {
    await mkdir(path.dirname(filePath));
    await fs.writeFile(filePath, request.payload)
    reply()
  } else if (filePath.endsWith("/")) {
    await mkdir(filePath);
    reply()
  }
};

export async function updateHandler(request, reply) {
  const filePath = getLocalFilePathFromRequest(request);
  fs.stat(filePath)
    .then((stat) => { if (stat.isDirectory()) {
      throw Error("cannot POST on a directory")
    } else {
      console.log(`\n Updating ${filePath} \n`);
      fs.writeFile(filePath, request.payload);
      reply()
    }
  })
    .catch(()=>reply(Boom.methodNotAllowed('File does not exist')))
};

export async function deleteHandler(request, reply) {
  const filePath = getLocalFilePathFromRequest(request)
  console.log("request.params.file :: ", request.params.file);
  if (!request.params.file) {
    reply(Boom.forbidden(`Cannot delete root directory, give another path!!!`));
  } else if (!filePath.endsWith("/")) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err.stack);
        reply(Boom.notFound(`${filePath} Could not delete a single file!!!`));
      } else {
        reply(`${filePath}  deleted successfully!!`)
      }
    });
  } else {
    rimraf(filePath, (error) => { if (error) {
      reply(Boom.notFound(`${filePath} Could notdelete!!!`))
    }});
  }
};

