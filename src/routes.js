const express = require('express'); // uma biblioteca para criar o servidor
const routes = express.Router() // parte das rotas (caminhos para as outras abas)

const views = __dirname + "/views/" // adicionando a parte fixa à uma const para encurtar o código

const profile = {
    name: "Vinicius",
    avatar: "https://avatars.githubusercontent.com/u/52111824?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4
}

routes.get('/', (req, res) => res.render(views + "index"))
routes.get('/job', (req, res) => res.render(views + "job"))
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', (req, res) => res.render(views + "profile", { profile }))

module.exports = routes;