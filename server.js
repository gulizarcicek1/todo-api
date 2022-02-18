var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos =[];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/',function(req,res){
	res.send('Todo API Root');
});

//Get /todos?completed=true
app.get('/todos', function(req,res){
	var queryParams = req.query;
	var filteredTodos = todos;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed ==='true'){
		filteredTodos = _.where(filteredTodos, {completed:true});
	}else if(queryParams.hasOwnProperty('completed')&& queryParams.completed==='false') {
 		filteredTodos = _.where(filteredTodos, {completed:false});
	}
	
	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		filteredTodos = _.filter(filteredTodos, function(todo){
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}
	res.json(filteredTodos);
});

//Get /todos/:id  
app.get('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id, 10);
	db.todo.findByPk(todoId).then(function(todo){
		if(!!todo){
			res.json(todo.toJSON());
		}else{
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
});

app.post('/todos', function (req,res) {
	var body =_.pick(req.body,'description','completed');


	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());	
	}, function(e){
		res.status(400).json(e);
	});

});

// DELETE /todos/:id
app.delete('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var machecTodo = _.findWhere(todos,{id: todoId});

	if(!machecTodo){
		res.status(404).json("error :no todo fpund with that id");
	}else{
		todos = _.without(todos,machecTodo);
		res.json(machecTodo);
	}
});



// PUT / todos/:id
app.put('/todos/:id', function(req,res){
	var body = _.pick (req.body,'description','completed');
	var validAttributes  = {};

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}
});

app.put('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var machecTodo = _.findWhere(todos,{id: todoId});
	var body = _.pick(req.body,'description','completed');
	var validAttributes = {};

	if(!machecTodo){
		return res.status(404).send();
	}
	if(body.hasOwnProperty('completed') &&_.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') &&_.isString(body.description) && body.description.trim().lenght>0){
		validAttributes.description= body.description;	
	}else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}
	_.extend(machecTodo,validAttributes);
	res.json(machecTodo);
});

db.sequelize.sync().then(function(){
	app.listen(PORT, function(){
	console.log('express listening on port' + PORT + '!');
	});
});



