Server = require "#{__dirname}/src/Server"

exports.createServer = (options, callback)->
  return new Server(options) if (typeof options == "function")
  return new Server(options, callback)