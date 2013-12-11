uuid = require 'node-uuid'
WebSocketServer = require('ws').Server


class Server
  constructor: (options, callback) ->
    @onConnection = callback
    if typeof options == "function"
      @onConnection = options
      options = undefined

  broadcast: (message, from)->
    for client in @wss.clients
      unless from == client.client_id
        client.send message

Server::listen = (port, host, callback)->
  self = @
  options =
    port: port
    host: host

  if typeof host == "function"
    callback = host
    host = undefined

  @wss = new WebSocketServer options, callback
  
  @wss.on 'connection', (ws)->
    client_id = uuid.v1()
    ws.client_id = client_id
    # console.log "Client connected with ID: #{client_id}"


    ws.on 'message', (message)->
      console.log 'received: %s from %s', message, ws.client_id
      self.broadcast message, ws.client_id

    ws.on 'close', ->
      console.log "ws #{ws.client_id} closed"

    self.onConnection(ws)

  
  return @




module.exports = Server



