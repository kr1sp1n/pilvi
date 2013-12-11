pilvi = require "#{__dirname}/../../index"

port = 8888

server = pilvi.createServer (conn)->
  console.log "New connection"
  console.log conn.client_id

server.listen port, ->
  console.log "Server is listening on #{port}"