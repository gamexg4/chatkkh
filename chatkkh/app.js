
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')  
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

/* chat */
app.get('/chat', function(req, res){
	res.render('chat');
});

app.get('/chat/chat_room', function(req, res){	
	res.render('chat/chat_room',{room_name:req.param('room_name')});
});
/* chat */

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
	/* chat */
	socket.on('send_msg', function(data){
		var room_name = data.room_name;
		var name = data.name;
		var date = data.date;
		var msg = data.msg;
		
		var param = {msg:msg,name:name,date:date}
		
		io.sockets.in(room_name).emit('recv_msg',param);		
	});
	
	socket.on('join_room', function(data){		
		var room_name = data.room_name;		
		socket.join(room_name);		
	});
	
	socket.on('room_list', function(){
		var room_list = [];		
		console.log(io.sockets.manager.rooms);		
		for(var item in io.sockets.manager.rooms){			
			if(item) room_list.push(item.replace('/',''));
		}
		socket.emit('room_list', room_list);
	});
	/* chat */
});



