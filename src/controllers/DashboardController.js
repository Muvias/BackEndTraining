const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
    index(req, res) {
        const jobs = Job.get();
        const profile = Profile.get();
    
        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        // total de horas por dia de cada projeto em progress
        let jobTotalHours = 0

        const updatedJobs = jobs.map((job) => {
            //ajustes no job
            const remaining = JobUtils.remainingDays(job)
            const status = remaining <= 0 ? 'done' : 'progress'

            // status = done or progress
            // statusCount[done or progress] += 1
            // atribuindo a quantidade ao statusCount
            statusCount[status] += 1;
            
            jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours

            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            }
        })
        
        // quantidade de hrs que quero trabalhar/dia - quantidade de h/dias de cada job em progress
        const freeHours = profile["hours-per-day"] - jobTotalHours;

        return res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours })
    }
}