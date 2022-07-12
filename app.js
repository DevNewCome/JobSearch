const express = require('express');
const {engine} = require('express-handlebars');
const app = express();
const path = require ('path');
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const { title } = require('process');
const Sequelize = require ('sequelize');
const { query } = require('express');
const Op =  Sequelize.Op;

const PORT = 3000;

app.listen(PORT, function(){
  console.log(`o express está rodando na porta ${PORT}`);
});

app.use(bodyParser.urlencoded({extended: false}))

//db connection
db
.authenticate()
.then(()=>{
  console.log("conectou ao banco com sucesso");
})
.catch(err =>{
  console.log("erro ao conectar ao banco", err);
}); 

//handle bar

app.engine('handlebars', engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));



// static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.get('/', (req, res) => {

  let search = req.query.job;
  let query = '%' + search + '%';

  if(!search){
      Job.findAll({order: [
          ['createdAt', 'DESC']
      ]})
      .then(jobs => {
          res.render('index', {jobs});
      })
      .catch(err => console.log(err));
  } else {
      Job.findAll({
          where: {title: {[Op.like]: query}},
          order: [
          ['createdAt', 'DESC']
      ]})
      .then(jobs => {
          res.render('index', {
              jobs,
              search
          });
      })
      .catch(err => console.log(err));
  }
  
});

//jobs routes
app.use('/jobs', require('./routes/jobs'));
