var Sequelize = require ('sequelize');
const path = require('path');
const Op=Sequelize.Op;
var sequelize = new Sequelize(undefined,undefined,undefined,{
	'dialect' : 'sqlite',
	'storage' : __dirname + '/data/dev-todo-api.sqlite'
});


var db = {};

//db.todo = sequelize.import(__dirname + '/models/todo.js');
db.todo = require(path.join(__dirname, '/models/todo.js'))(sequelize, Sequelize.DataTypes);
db.user = require(path.join(__dirname, '/models/user.js'))(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;