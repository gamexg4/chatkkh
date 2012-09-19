
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

/* location */
app.get('/tracker', function(req, res){
    res.render('location/tracker');
});

app.get('/observer', function(req, res){
	res.render('location/observer');
});

app.get('/showdata', function(req, res){
	//client.query('select * from locations where name = ?',[req.query.name], function(err, data){	
	
	var data = room_list[req.query.name]['list'];
	var cnt = Object.keys(room_list[req.query.name]['list']).length;
		
	res.writeHead(200, {'Content-Type':'application/json'});
	res.end(JSON.stringify(data));		
	//});
});
/* location */

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
    
    /* location */
    socket.on('join', function(data){		
		socket.join(data);
	});
	
	socket.on('location', function(data){				
		
		if(!room_list[data.name]) {
			room_list[data.name] = new Object();
			room_list[data.name]['list'] = new Object();			
		}

		var cnt = Object.keys(room_list[data.name]['list']).length ? Object.keys(room_list[data.name]['list']).length : 0;
		
		if(cnt == 3) {
			data.latitude = 38;
			data.longitude = 128;			
		}
		
		room_list[data.name]['list'][cnt] = new Object();
		room_list[data.name]['list'][cnt]['latitude'] = data.latitude;
		room_list[data.name]['list'][cnt]['longitude'] = data.longitude;		
		
		
		console.log('######################################################################');
		io.sockets.in(data.name).emit('receive', {latitude:data.latitude,longitude:data.longitude});
	});
	/* location */
});



