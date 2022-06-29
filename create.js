const options = require('./options/db')
const knex = require('knex')(options)

knex.schema.createTable('products', table =>{
    table.string('title')
    table.string('thumbnail')
    table.integer('price')
})
    .then(() => console.log('table created'))
    .catch(err => {console.log(err); throw err})
    .finally(()=> {
        knex.destroy()
    })
