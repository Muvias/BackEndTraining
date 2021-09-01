const { render } = require('ejs');
const express = require('express'); // uma biblioteca para criar o servidor
const routes = express.Router() // parte das rotas (caminhos para as outras abas)

const views = __dirname + "/views/" // adicionando a parte fixa à uma const para encurtar o código

const Profile = {
    data: {
        name: "Vinicius",
        avatar: "https://avatars.githubusercontent.com/u/52111824?v=4",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75
    },

    controllers: {
        index(req, res) {
            return res.render(views + "profile", { profile: Profile.data })
        },

        update(req, res){
            // req.body para pegar os dados
            const data = req.body

            // definir quantas semanas tem um ano: 52
            const weeksPerYear = 52
            // remover as semanas de férias do ano, para pegar quantas semanas tem em um mês
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12
            
            // quantas horas por semana estou trabalhando
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

            //horas trabalhadas no mês
            const monthlyTotalHours = weekTotalHours * weeksPerMonth

            //qual será o valor da minha hora?
            const valueHour = data["monthly-budget"] / monthlyTotalHours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }
            
            return res.redirect('/profile')
        }
    }
}

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 60,
            created_at: Date.now()
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now()
        }
    ],

    controllers: {
        index(req, res) {
            const updatedJobs = Job.data.map((job) => {
                //ajustes no job
                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? 'done' : 'progress'
                
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Profile.data[("value-hour")] * job[("total-hours")]
                }
            })
            
            return res.render(views + "index", { jobs: updatedJobs })
        },

        create(req, res){
            return res.render(views + "job")
        },

        save(req, res) {
            const lastId = Job.data[Job.data.length - 1]?.id || 1;

            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now() // atibuindo data do momento que o formulário for enviado
            })
            return res.redirect('/')
        }
    },

    services: {
        remainingDays(job){
            //calculo de tempo restante
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
    
            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(remainingDays)
            const dueDateInMs = createdDate.setDate(dueDay)
    
            const timeDiffInMs = dueDateInMs - Date.now()
            //transformar MS em DIAS
            const dayInMs = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)
    
            //restam x dias
            return dayDiff
        }
    }
}


routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save) // Enviando os dados coletados pelo formulário
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)

module.exports = routes;