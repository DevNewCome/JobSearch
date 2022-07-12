const express = require ('express');
const router = express.Router();
const Job = require ('../models/Job');

router.get('/test', (req, res)=>{
  res.send('boa caray ta no camin');
})

// form da rota de envio
router.get('/add', (req, res) => {
  res.render('add');
})

// detalhe vaga
router.get('/view/:id', (req, res) => Job.findOne({
  where: {id: req.params.id}
}).then(job => {
  res.render('view', {
    job
  }); 
}).catch(error => console.log(err)));


// add job via post
router.post('/add', (req, res) => {

  let {title, salary, company, description, email, new_job} = req.body;

  // insert
  Job.create({
    title,
    description,
    salary,
    company,
    email,
    new_job
  })
  .then(() => res.redirect('/'))
  .catch(err => console.log(err));

});

module.exports = router