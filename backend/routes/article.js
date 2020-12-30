'use strict'

var express = require("express")

var ArticleController = require('../controllers/article');

var router = express.Router();

//rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);

//rutas utiles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:last', ArticleController.getArticle);


module.exports = router;