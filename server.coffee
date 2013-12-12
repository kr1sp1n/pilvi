http = require 'http'
st = require 'node-static'
fileServer = new st.Server "#{__dirname}"
pilvi = require "#{__dirname}/index"

port = 8888

http_server = http.createServer (req, res)->
  req.addListener('end', ->
    fileServer.serve req, res
  ).resume()

http_server.listen port, ->
  console.log "Server is listening on #{port}"

pilvi.createServer
  server: http_server
,(conn)->
  console.log "New connection"
  console.log conn.client_id

