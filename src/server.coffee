uuid = require 'node-uuid'
WebSocketServer = require('ws').Server

wss = new WebSocketServer
  port: 8888

wss.broadcast = (message, from)->
  for client in this.clients
    unless from == client.client_id
      client.send message

wss.on 'connection', (ws)->
  client_id = uuid.v1()
  ws.client_id = client_id
  console.log "Client connected with ID: #{client_id}"

  # id = setInterval ->
  #   ws.send 'hello', ()->
  # , 5000

  ws.on 'message', (message)->
    console.log 'received: %s from %s', message, ws.client_id
    wss.broadcast message, ws.client_id

  ws.on 'close', ->
    console.log 'stopping client interval'
    # clearInterval id