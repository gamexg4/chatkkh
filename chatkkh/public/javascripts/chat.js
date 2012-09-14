var socket = new function(){
	this.chat_socket = null;
	
	// connect socket
	this.socket_connect = function(){	
		if(!socket.chat_socket) socket.chat_socket = io.connect();		
		
		socket.chat_socket.on('recv_msg', function(data){
			var html = '<li>';
			html += '<h3>'+data.name+'</h3>';
			html += '<p>'+data.msg+'</p>';
			html += '<p>'+data.date+'</p>';
			html += '</li>';
						
			//$(html).prependTo('#msg');
			$('#msg').append(html);
			$('#msg').listview('refresh');
			var currentScrollTop = $(window).scrollTop();
			$(window).scrollTop(currentScrollTop+1000);
		});
		
		socket.chat_socket.on('room_list', function(data){			
			var html = '';			
			for(var item in data){				
				html += '<li><a href="#" data-role="button" onclick="room.join_room(\''+data[item]+'\');return false;">'+data[item]+'</a></li>';
			}
			$('#room_list').append(html);
			$('#room_list').listview('refresh');
		});
	}
	
	// init
	this.init = function(){
		socket.socket_connect();				
	}
}

var chat = new function(){	
	// init
	this.init = function(){	
		socket.init();
		
		var room_name = $('#room_name').val();
		
		var param = {room_name:room_name};		
		socket.chat_socket.emit('join_room',param);
	}
	
	this.send_msg = function(){
		var name = $('#name').val();
		var content = $('#content').val();
		var date = new Date().toUTCString();
		
		var param = {msg:content,name:name,room_name:chat.room_name,date:date};
		
		socket.chat_socket.emit('send_msg', param);
		$('#content').val('');
	}
}


var room = new function(){
	// init
	this.init = function(){
		socket.init();	
		
		socket.chat_socket.emit('room_list');
		
	}
	
	this.create_room = function(){
		var room_name = prompt('room name');
		if(room_name) window.open('/chat/chat_room?room_name='+room_name,'chat_room','scrollbars=yes,fullscreen=yes');
	}
	
	this.join_room = function(room_name){
		if(room_name) window.open('/chat/chat_room?room_name='+room_name,'chat_room','scrollbars=yes,fullscreen=yes');
	}
}