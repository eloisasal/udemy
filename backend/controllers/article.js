'use strict'

var validator = require('validator');
var Article = require('../models/article');
//importa el modelo, tiene la conexion y el objeto que vamos a usar
//para cargar y guardar de la bd

var controller = {

    datosCurso: (req, res) => {

        var hola = req.body.hola;
        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Victor Robles Web',
            url_autor: 'victorroblesweb.es',
            url: 'https://www.malt.es/profile/eloisasalirenom',
            hola
        });
    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test del controlador de articulos'
        });
    },

    save: (req, res) => {
        //recoger parametros por post
        var params = req.body;
        console.log(params);

        //validar los datos con la libreria validator
        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(220).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
        if (validateTitle && validateContent) {
            //crear el objeto a guardar
            var article = new Article();
            //asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = params.image;

            //guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado!'
                    });
                } else {
                    //devolver una respuesta
                    return res.status(200).send({
                        status: 'success',
                        message: 'Soy la acción SAVE de mi controlador de articulos',
                        article: articleStored
                    });
                }
            })
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }
    },
    getArticles: (req, res) => {
        
        var last = req.params.last;
        console.log(req.params);
        
        var query = Article.find({});

        if(last || last != undefined){
            try{
                query.limit(parseInt(last));
            }catch(err){
                console.log(err);                
            }
        }
        

        query.sort('-id').exec((err, articles) => {
            if (err) {
                return res.status(220).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }
            if (!articles) {
                return res.status(220).send({
                    status: 'error',
                    message: 'No hay articulos que mostrar'
                });
            }
            return res.status(200).send({
                status: 'success',
                message: 'Soy la acción getArticles de mi controlador de articulos',
                articles
            });
        });
    }, 
    getArticle: (req, res)=>{
        return res.status(200).send('Respuesta de articulo simple');
    }


};//end controller

module.exports = controller;