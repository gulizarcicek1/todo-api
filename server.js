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
	var query = req.query;
    var where = {};  

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
    	where.completed = true ;
    } else if(query.hasOwnProperty('completed') &&query.completed === 'false'){
    	where.completed = false;
    }
  
    if(query.hasOwnProperty('q') && query.q.lenght > 0){
    	where.description = {
    		$like: '%' + query.q + '%'
    	};
    }
    db.todo.findAll({where: where}).then(function(todos){
    	res.json(todos);
    }, function (e){
    	res.status(500).send();
    })
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

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowDeleted){
		if(rowDeleted === 0){
			res.status(404).json({
				error: 'No todo with id'
			});
		}else {
			res.status(204).send();
		}
	},function(){
		res.status(500).send(); 
	});
});


app.put('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body,'description','completed');
	var attributes = {};

	if(body.hasOwnProperty('completed')){
		attributes.completed = body.completed;
	}

	if(body.hasOwnProperty('description')){
		attributes.description= body.description;	
	}

	db.todo.findByPk(todoId).then(function(todo) {
		if(todo){
			todo.update(attributes).then(function(todo){
				res.json(todo.toJSON());
			}, function(e){
				res.status(400).json(e);
			});  
		}else {
			res.status(404).send();
		}
	},function(){
		res.status(500).send();
	});
});

  

app.post('/users', function(req,res){
	var body =_.pick(req.body,'email','password');

	db.user.create(body).then(function(user){
		res.json(user.toPublicJSON());	
	}, function(e){
		res.status(400).json(e);
	});
});


db.sequelize.sync().then(function(){
	app.listen(PORT, function(){
	console.log('express listening on port' + PORT + '!');
	});
});



