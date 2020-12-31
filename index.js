/*
####################################################################################################################
####################################################################################################################
=============     conexion a la bd y el ersto de la aplicacion back end   =============
####################################################################################################################
####################################################################################################################
*/
'use strict'


var mongoose = require('mongoose'); //los require parece igual que con php!
var app = require('./app');
var port = process.env.PORT;//3900;


const Parse = require('parse/node');

Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
Parse.initialize(
  '7DUkHtBcWGFQ6iXahsMxiMXePsH8IoPskadZooSn', // This is your Application ID
  'RzywwMlEOgfxLS3BDx6CCaO7I8pVCMFvXe7ofcaG', // This is your Javascript key
  'CdeiXAZYcLWrqZp0VMCnROUvukwm8EozMsATC3Dn' // This is your Master key (never use it in the frontend)
);

//ahora la conexion a mongodb


mongoose.set('useFindAndModify', false);//forzamos que metodos antiguos de trabajr con la BD se desactiven para poner los nuestros
//En concreto desactivamos useFindAndModify
// mongoose.adminCommand( { setFeatureCompatibilityVe


//rsion: '3.4' } )

// let url = 'mongodb://localhost:27017/api_rest_blog'; //la url de nuestra bd/la bd que queremos usar
// let opciones = { useNewUrlParser: true };

mongoose.Promise = global.Promise;
var url = 'mongodb://admin:XlmL4dQEz1CEeKysfMg7tAK3@MongoS3601A.back4app.com:27017/e45b7197a51042f58e10295936029485?ssl=true&retrywrites=false'; //back4app
//var url = 'mongodb://localhost:27017/api_rest_blog'; //localhost
mongoose.connect(url, { useNewUrlParser:true, useUnifiedTopology: true})
    .then(() => {
        console.log('la conexion a la BD se ha realizado con exito!!!');

        //Crear servidor y ponerme a escuchar peticiones http
        app.listen(port, ()=>{
            console.log('Servidor corriendo en http://localhost:'+port);            
        })


    });