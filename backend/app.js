/*
####################################################################################################################
####################################################################################################################
=============  Aqui escribiremos la "Piedra angular" de nuestro backend   =============
####################################################################################################################
####################################################################################################################
*/
'use strict'

// cargar modulos de node para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

// ejercutar express (http)
var app = express();

// cargar ficheros de rutas
var article_routes = require('./routes/article');

// Middlelwares (antes de ejecutar la ruta se ejecutara esto)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); //Convierto cualquier peticion que me llegue a un objeto JSON

//CORS para peticiones de front end

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos a rutas / guardar rutas

app.use('/', article_routes);

//Ruta o metodo de prueba
app.get('/probando', (req, res)=>{
    console.log('he accedido');
    return res.status(200).send({
        hola: 'hi',
        test:'just a test bro',
        wen: 'https://www.malt.es/profile/eloisasalirenom'
    });
    //return res.status(200).send(`
    //<ul>
    //    <li>Node</li>
    //    <li>Angular</li>
    //    <li>React</li>
    //</ul>
    //`);
    
});

// Exportar modulo (Fichero actual)
module.exports = app;
