const { render } = require('ejs');
const express = require('express'); // uma biblioteca para criar o servidor
const routes = express.Router() // parte das rotas (caminhos para as outras abas)
const ProfileController = require('./controllers/ProfileController')
const JobController = require('./controllers/JobController');
const DashboardController = require('./controllers/DashboardController');

routes.get('/', DashboardController.index)
routes.get('/job', JobController.create)
routes.post('/job', JobController.save) // Enviando os dados coletados pelo formulário
routes.get('/job/:id', JobController.show)
routes.post('/job/:id', JobController.update)
routes.post('/job/delete/:id', JobController.delete)
routes.get('/profile', ProfileController.index)
routes.post('/profile', ProfileController.update)

module.exports = routes;