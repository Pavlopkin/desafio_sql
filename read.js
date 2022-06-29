const options = require('./options/db')
const knex = require('knex')(options)

knex.from('products').select('*')
    .then( products => {
        for (const prod of products) {
            console.log(`${prod['title']}: ${prod['thumbnail']} (${prod['price']})`)
        }
    })    


    .catch(err => console.log(err))
    .finally(()=> knex.destroy())

