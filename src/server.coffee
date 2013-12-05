uuid = require 'node-uuid'
WebSocketServer = require('ws').Server

sockets = {}

wss = new WebSocketServer
  port: 8888

wss.on 'connection', (ws)->
  
  client_id = uuid.v1()
  sockets[client_id] = ws
  ws.client_id = client_id
  console.log "Client connected with ID: #{client_id}"
  # ws.send "client_id=#{client_id}"

  # id = setInterval ->
  #   ws.send 'hello', ()->
  # , 5000

  ws.on 'message', (message)->
    console.log 'received: %s', message

    # BROADCAST to all other clients
    for client_id, socket of sockets
      unless ws.client_id == client_id then socket.send message
    # 

  ws.on 'close', ->
    console.log 'stopping client interval'
    delete sockets[ws.client_id]
    # clearInterval id