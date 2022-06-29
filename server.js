const express = require('express')
const { Router } = express;
const http = require('http')
const { Server } = require('socket.io')
const options = require('./options/db')
const knex = require('knex')(options)
const options2 = require('./options/db_sqlite')
const knex2 = require('knex')(options2)

const app = express()
const httpServer = http.createServer(app);
const io = new Server(httpServer)

app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./public'))

//arreglo donde se guardan los mensajes del chat//
const chats = []
//arreglo donde se guardan los productos//
const messages = [
    {
      title: "Campera Gore Tex",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/gore.png",
      price:25000,
    },
    {
      title: "Puffy Shirt",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/puffy.png",
      price: 60000,
    },
    {
      title: "Bolígrafo anti gravedad",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/boligrafo.png",
      price: 1500,
    },
    {
      title: "Jimmy's Shoes",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/shoes.png",
      price: 13000,
    },
    {
      title: "Fusilli Jerry",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/fusilli.png",
      price: 1200,
    },
    {
      title: "The coffee table booky",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/bookof.png",
      price: 3500,
    },
];
//agrega todos los productos del array a la base de datos//
knex('products').insert(messages)
        .then(() => console.log('data inserted'))
        .catch(err => console.log('hubo un error'))
        .finally(()=> knex.destroy())
//ruta
app.get('/', (req, res)=>{
  res.render('desafio/index', { messages })
})

io.on('connection', (socket) => {
    console.log('user conetado, id: ' +  socket.id)

    socket.emit('messages', messages); 

    socket.on('new-message', (newMessage) => {
        console.log({newMessage});
        messages.push(newMessage);
        io.sockets.emit('messages', messages)

        const pos = messages.length - 1;
        console.log("pos es esto", pos)
        
        //incorpora a la base de datos el último producto agregado//
        const options = require('./options/db')
        const knex = require('knex')(options)
        knex('products').insert(messages[pos])
        .then(() => console.log('data inserted'))
        .catch(err => console.log('hubo un error', err))
        .finally(()=> knex.destroy())
        })

    socket.emit('chats', chats);

    socket.on('new-chat', (newChats) => {  
        console.log({newChats});
        chats.push(newChats);
        io.sockets.emit('chats', chats)
        //incorpora a la base sqlite los mensajes del chat//
        knex2('chats').insert(newChats)
        .then(() => console.log('data inserted'))
        .catch(err => console.log('hubo un error', err))
        .finally(()=> knex.destroy())   
    })
});

httpServer.listen(3000, ()=> console.log('server running...'))

