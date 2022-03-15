const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

//detalhe da vaga
router.get('/view/:id', (req, resp) => Job.findOne({
    where: { id: req.params.id }
}).then(job => {
    resp.render('view', {
        job
    });
}).catch(err => console.log(err)));

//form da rota de envio

router.get('/add', (req, resp) => {
    resp.render('add')
});


// add job via post
router.post('/add', (req, resp) => {

    let { title, salary, company, description, email, new_job } = req.body;

    Job.create({
            title,
            salary,
            company,
            description,
            email,
            new_job

        })
        .then(() => resp.redirect('/'))
        .catch(err => console.log(err));
});

module.exports = router