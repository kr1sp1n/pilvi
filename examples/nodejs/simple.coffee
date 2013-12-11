pilvi = require './../../pilvi'

console.log "pilvi v#{pilvi.VERSION}"

save = (collection, items)->
  console.log "Save items: "
  console.log items

other = (collection, items)->
  console.log "Do something with items: "
  console.log items

pilvi.on 'set', save
pilvi.on 'set', other

pilvi.set 'task', [{name:'test', status: 'todo'}]