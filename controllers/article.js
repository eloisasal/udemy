'use strict'

var validator = require('validator');
var fs = require('fs'); //filesystem
var path = require('path'); //sacar el path de un a archivo en el sistema del servidor
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
        console.log('params:', params);

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
            console.log('article:', article);
            
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    console.log('err:', err);
                    console.log('articleStored:', articleStored);
                    
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

        if (last || last != undefined) {
            try {
                query.limit(parseInt(last));
            } catch (err) {
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
    getArticle: (req, res) => {
        //recoger el id de la url
        var articleID = req.params.articleID;

        //comprobar que existe
        if (!articleID || articleID == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo!'
            });

        }
        //buscar el articulo
        Article.findById(articleID, (err, article) => {
            if (err || !article) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los datos!'
                });
            }
            //devolverlo en json

            return res.status(404).send({
                status: 'success',
                message: 'Funcion devolver articulo simple!',
                article
            });
        });
    },

    update: (req, res) => {
        //Recoger la id
        var articleID = req.params.articleID;

        //Recoger los datos que llegan por put
        var params = req.body;

        // validar datos
        try {

            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);

        } catch (error) {
            console.log(error);

            return res.status(500).send({
                status: 'error',
                message: 'Error en los datos proporcionados'
            });
        }

        if (!validateContent || !validateTitle) {
            return res.status(500).send({
                status: 'error',
                message: 'Los datos proporcionados no son validos'
            });
        }
        //find and update
        Article.findOneAndUpdate({ _id: articleID }, params, { new: true }, (err, articleUpdated) => {
            if (err || !articleUpdated) {
                return res.status(200).send({
                    status: 'error',
                    message: 'No existe el articulo'
                });
            }
            //devolver respuesta
            return res.status(200).send({
                status: 'success',
                message: 'Soy la acción update de mi controlador de articulos',
                article: articleUpdated
            });
        })


    },
    delete: (req, res) => {
        //recoger la id
        var articleID = req.params.articleID;
        //find and delete
        Article.findOneAndDelete({ _id: articleID }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, seguramente no existe actualmente'
                });
            }
            return res.status(200).send({
                status: 'success',
                message: 'Se ha borrado correctamente',
                article: articleRemoved
            });
        });
    },
    upload: (req, res) => {
        //configurar el modulo del connect multiparty (router/article.js)

        //recoger el fichero de la peticion
        var fileName = 'Imagen no subida...';

        if (!req.files || req.files == undefined) {
            return res.status(404).send({
                status: 'error',
                message: fileName
            });
        }

        //conseguir nombre y extension del archivo
        var filesPath = req.files.file0.path;
        //file0 puede tener otro nombre, ponemos este porque nos fiamos
        //de que lo que dice que el middleware usa este tipo de nombres
        var fileSplitted = filesPath.split('\\');
        /** 
         * Advertencia en linux o mac
         * en lugar de poner \\tocaria poner /
         */

        fileName = fileSplitted[fileSplitted.length - 1];
        var extension = fileName.split('.');
        extension = extension[extension.length - 1];

        var formats = ['gif', 'jpeg', 'jpg', 'png', 'png'];
        if (!formats.includes(extension)) {
            //Borrar el archivo subido
            fs.unlink(filesPath, (err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida ' + extension
                });
            });
        } else {
            //si todo es valido: buscar el articulo, asignarle el nombre de la imagen y actualizarlo 


            var articleID = req.params.articleID;

            //comprobar que existe
            if (!articleID || articleID == null) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo!'
                });

            }

            Article.findOneAndUpdate({ _id: articleID }, { image: fileName }, { new: true }, (err, articleUpdated) => {


                if (err || !articleUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al guardar la imagen'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    message: 'Soy la acción upload de mi controlador de articulos',
                    name: fileName,
                    extension
                });
            });


        }
    }, //end upload file
    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        }); 
    },
    search: (req, res)=>{
        var searchString = req.params.search;
        console.log(searchString);
        
        Article.find({"$or":[
            {'title': {'$regex': searchString, '$options': 'i'}},
            {'content': {'$regex': searchString, '$options': 'i'}}
        ]})
        .sort([['date', 'descending']]).exec((err, articles)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
                
            }
            if(!articles || articles.length<=0){
                return res.status(404 ).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda'
                });
                
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    }


};//end controller

module.exports = controller;