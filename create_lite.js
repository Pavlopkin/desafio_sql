const options = require('./options/db_sqlite')
const knex = require('knex')(options)

knex.schema.createTable('chats', table =>{
    table.string('author')
    table.string('text')
    table.string('time')
})
    .then(() => console.log('table created'))
    .catch(err => {console.log(err); throw err})
    .finally(()=> {
        knex.destroy()
    })

