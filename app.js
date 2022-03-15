const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`O Express está funcionando na porta ${PORT}`);
});

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));


//handle-bars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//db
db
    .authenticate()
    .then(() => {
        console.log('conectou ao banco com sucesso');
    })
    .catch(err => {
        console.log('ocorreu um erro ao conectar ' + err);
    });

//routes
app.get('/', (req, resp) => {

    let search = req.query.job;
    let query = '%' + search + '%';

    if (!search) {
        Job.findAll({
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            .then(jobs => {
                resp.render('index', {
                    jobs
                });
            })
            .catch(err => {
                console.log('ocorreu um erro ao consultar ' + err);
            });
    } else {
        Job.findAll({
                where: {
                    title: {
                        [Op.like]: query
                    }
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            .then(jobs => {
                resp.render('index', {
                    jobs
                });
            })
            .catch(err => {
                console.log('ocorreu um erro ao consultar'.err);
            });
    }
});

app.use('/jobs', require('./routes/jobs'));