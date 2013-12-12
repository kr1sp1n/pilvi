uuid = require 'node-uuid'
WebSocketServer = require('ws').Server

class Server
  constructor: (@options, callback) ->
    @onConnection = callback
    if typeof @options == "function"
      @onConnection = @options
      @options = undefined

    @setupWebSocketServer(@options)

  broadcast: (message, from)->
    for client in @wss.clients
      unless from == client.client_id
        client.send message

  setupWebSocketServer: (options, callback)->
    self = @
    @wss = new WebSocketServer options, callback
    @wss.on 'connection', (ws)->
      client_id = uuid.v1()
      ws.client_id = client_id

      ws.on 'message', (message)->
        console.log 'received: %s from %s', message, ws.client_id
        self.broadcast message, ws.client_id

      ws.on 'close', ->
        console.log "ws #{ws.client_id} closed"

      self.onConnection(ws)


module.exports = Server



