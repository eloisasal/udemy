'use strict'

var express = require("express")

var ArticleController = require('../controllers/article');

var router = express.Router();

//rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);



var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './upload/articles'});


//rutas utiles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:articleID', ArticleController.getArticle);

router.put('/article/:articleID', ArticleController.update);
router.delete('/article/:articleID', ArticleController.delete);
router.post('/upload-image/:articleID', md_upload, ArticleController.upload);
router.get('/get-image/:image', md_upload, ArticleController.getImage);
router.get('/search/:search', md_upload, ArticleController.search);


module.exports = router;