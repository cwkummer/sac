const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');
const uuid = require('uuid/v4');

// Create server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
const router = express.Router();
app.use("/", router);
app.listen(3000);

(async () => {

// Setup lowDB
const adapter = new FileAsync('db.json');
const db = await low(adapter);
// db.defaults({ people: [] }).write();

router.route('/person/:id')
  .get((req, res) => {
    const person = db.get('people')
      .find({ id: req.params.id })
		  .value();
	  res.render('person', { 'person': person });
	});
router.route('/person')
	.get(async (req, res) => {
		let personList = await db.get('people').value();
	  res.render('personList', {"people": personList});
	})
  .post((req, res) => {
		req.body.id = uuid();
    db.get('people')
      .push(req.body)
      .last()
      .write()
      .then(post => res.send(post));
	});
router.route('/add')
	.get((req, res) => {
		res.render('addPerson');
	});

})();