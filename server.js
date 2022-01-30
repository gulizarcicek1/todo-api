var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos =[];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/',function(req,res){
	res.send('Todo API Root');
});

//Get /todos
app.get('/todos', function(req,res){
	res.json(todos);
});

//Get /todos/:id  
app.get('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id, 10);
    var machecTodo = _.findWhere(todos, {id: todoId});
    

    if (machecTodo) {
    	res.json(machecTodo);
    }else{
    	res.status(404).send() ;
    }
});

app.post('/todos', function (req,res) {
	var body =_.pick(req.body,'description','completed');



	if(!_.isBoolean(body.completed) || !_.isString(body.description)|| body.description.trim().lenght===0){
		return res.status(400).send();
	}
	
    // set body.description to be trimmed value
    body.description = body.description.trim();
	body.id=todoNextId ++;
	todos.push(body)
	//push body into array

	res.json(body);


});

app.listen(PORT, function(){
	console.log('express listening on port' + PORT + '!');
});
