const options = require('./options/db_sqlite')
const knex = require('knex')(options)

knex.from('chats').select('*')
    .then( chats => {
        for (const chat of chats) {
            console.log(`${chat['author']}: ${chat['text']} (${chat['time']})`)
        }
    })    


    .catch(err => console.log(err))
    .finally(()=> knex.destroy())
