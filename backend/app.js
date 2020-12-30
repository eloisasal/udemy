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


// Middlelwares (antes de ejecutar la ruta se ejecutara esto)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json); //Convierto cualquier peticion que me llegue a un objeto JSON

//CORS para peticiones de front end


//Añadir prefijos a rutas


//Ruta o metodo de prueba
app.get('/probando', (req, res)=>{
    console.log('he accedido');
    return res.status(200).send(`
    <ul>
        <li>Node</li>
        <li>Angular</li>
        <li>React</li>
    </ul>
    `);
    
});

// Exportar modulo (Fichero actual)
module.exports = app;
