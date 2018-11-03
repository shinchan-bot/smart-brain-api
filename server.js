const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt =require('bcrypt-nodejs');
const register= require('./controllers/register');

const db= knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'smartbrain'
  }
});


const app = express();

 
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req,res)=> {
  res.send(database.users);
})


app.post('/signin', (req, res) => {
  const {email, password, name}= req.body;
  if(!email || !password){
    return res.status(400).json('Insert email and password')
  }
   db.select('email', 'hash').from('login')
   .where('email', '=', req.body.email)
   .then(data=> {
     const isValid = bcrypt.compareSync(req.body.password, data[0].hash); 
     if(isValid){
         return  db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(users => { 
              res.json(users[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
              }
      else{
        res.status(400).json('wrong credentials')
      }
   })
   .catch(err => res.status(400).jaon('wrong credentials'))
 })

app.post('/register', (req,res) => {register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => {
     const{ id }= req.params;
     db.select('*').from('users').where({
      id:id
    })
     .then(user =>{
      res.json(user[0]);

     })

    }) 

app.put('/image',(req,res) => {
  const{ id} = req.body;
 db('users').where('id', '=', id)
 .increment('entries',1)
 .returning('entries')
 .then(entries =>{
  res.json(entries[0]);
 })
 .catch(err => res.status(400).json('unable to find legth'))
})

app.listen(3000, () =>{
  console.log('app running on port 3000!')
})


