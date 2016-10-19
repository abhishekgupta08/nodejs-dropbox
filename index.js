#!/usr/bin/env babel-node

require('./helper')
import { readHandler, setHeaders, createHandler, updateHandler, deleteHandler } from "./crud";

const Hapi = require('hapi')
const asyncHandlerPlugin = require('hapi-async-handler')

async function main() {

  const port = 8000
  const server = new Hapi.Server({
    debug: {
      request: ['error']
    }
  })
  server.register(asyncHandlerPlugin)
  server.connection({ port })

  server.route([
    // READ
    {
      method: 'GET',
      path: '/{file*}',
      handler: {
        async: readHandler
      }
    },
    // CREATE
    {
      method: 'PUT',
      path: '/{file*}',
      handler: {
        async: createHandler
      }
    },
    // UPDATE
    {
      method: 'POST',
      path: '/{file*}',
      handler: {
        async: updateHandler
      }
    },
    // DELETE
    {
      method: 'DELETE',
      path: '/{file*}',
      handler: {
        async: deleteHandler
      }
    }
  ])

  await server.start()
  console.log(`LISTENING @ http://127.0.0.1:${port}`)
}
main()
