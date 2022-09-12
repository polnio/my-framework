import http from 'http'
import dotenv from "dotenv";
import Route from './core/Route';

import './routes/routes'

dotenv.config()

http
  .createServer((req, res) => {
    const url = /^([^?]+)(?:\?.*)?$/.exec(req.url)[1]
    Route.run(req.method, url).then(data => {
      res.end(data ?? '404 not found')
    })
  }).listen(process.env.SERVER_PORT, () => {
    console.log(`Server running at http://127.0.0.1:${process.env.SERVER_PORT}`)
  })
