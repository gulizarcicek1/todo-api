var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos =[{
	id:1,
	description: "Meet mom for lunch",
	completed: false
},{
	id: 2,
	description: "markete gitmek",
	completed:false
},{
	id:3,
	description:"uyumak",
	completed: true

}];

app.get('/',function(req,res){
	res.send('Todo API Root');
});

//Get /todos
app.get('/todos', function(req,res){
	res.json(todos);
});

//Get /todos/:id  
app.get('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id,10);
    var machecTodo;
    
    todos.forEach(function(todo){
    	 if(todoId==todo.id){
    	 	machecTodo=todo;
    	 }
    });
    if (machecTodo) {
    	res.json(machecTodo);
    }else{
    	res.status(404).send ;
    }
});


app.listen(PORT, function(){
	console.log('express listening on port' + PORT + '!');
});

