const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const uuid = require('uuid/v4');

// Create server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './views');
app.set('view engine', 'pug');
const router = express.Router();
app.use("/", router);
app.listen(3000);

(async () => {

// Setup lowDB
const adapter = new FileAsync('./db/db.json');
const db = await low(adapter);

router.route('/')
	.get((req, res) => {
		let personList = db.get('people').value();
	  res.render('personList', {"people": personList});
	})
router.route('/person/:id')
  .get((req, res) => {
    const person = db.get('people').find({ id: req.params.id }).value();
	  res.render('person', { 'person': person });
	});
router.route('/add')
	.get((req, res) => { res.render('addPerson'); })
	.post((req, res) => {
		req.body.id = uuid();
    db.get('people').push(req.body).last().write();
    res.redirect('/person/'+req.body.id);
	});
router.route('/action')
	.post((req, res) => {
		const person = db.get('people').find({ id: req.body.id }).value();
		console.log(person);
		res.redirect('/person/'+req.body.id);
	});
})();