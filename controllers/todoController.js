var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//Connect to the database
mongoose.connect('mongodb+srv://admin:admin@trainingcluster-78u92.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
//Create a schema - this is like a blue print
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);


/*var data = [
    { item: 'get coffee' },
    { item: 'walk dog' },
    { item: 'coding' }
];*/

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {

    app.get('/todo', function (req, res) {
        //get data from mongodb and pss it to view
        Todo.find({}, function (err, data) {
            if (err) throw err;
            res.render('todo', { todos: data });
        });
    });

    app.post('/todo', urlencodedParser, function (req, res) {
        var newTodo = Todo(req.body).save(function (err, data) {
            if (err) throw err;
            res.json(data);
            console.log(req.body);
            console.log(data);
        })
    });

    app.delete('/todo/:item', function (req, res) {
        //delete the requested item from mongodb
        Todo.find({ item: req.params.item.replace(/\-/g, " ") }).remove(function (err, data) {
            if (err) throw err;
            res.json(data);
        });
        /*data = data.filter(function (todo) {
            return todo.item.replace(/ /g, '-') !== req.params.item;
        });
        res.json(data);*/
    });

};