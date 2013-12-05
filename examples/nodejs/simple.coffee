pilvi = require './../../pilvi'

console.log "pilvi v#{pilvi.VERSION}"

x = (collection, items)->
  console.log "POST!!!"
  console.log items

y = (collection, items)->
  console.log "again!"
  console.log items

pilvi.on 'post', x
pilvi.on 'post', y

pilvi.post 'task', [{name:'test', status: 'todo'}]