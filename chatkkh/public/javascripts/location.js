var socket = new function(){
	this.location_socket = null;
	
	this.socket_connect = function(){	
		if(!socket.location_socket) socket.location_socket = io.connect();		
	}
		
	this.init = function(){
		socket.socket_connect();
	}
}

var tracker = new function(){	
	this.tracker_start = function(){
		socket.init();
		
		var name = $('#textinput').val();
		socket.location_socket.emit('join', name);		
		
		socket.location_socket.on('receive', function(data){
			var latitude = data.latitude;
			var longitude = data.longitude;
			
			var output = '<li>';
			output += '<h3>latitude: '+latitude+'</h3>';
			output += '<h3>longitude: '+longitude+'</h3>';			
			output += '</li>';
			
			$('#listview').append(output);			
			$('#listview').listview('refresh');
		});
		
		navigator.geolocation.watchPosition(function (position) {			
			socket.location_socket.emit('location', {name:name, latitude:position.coords.latitude,longitude:position.coords.longitude});
		}, function(err){
			alert('error msg'+err.message);
		});		
	};
}

var obsever = new function(){
	this.init = function(){
		socket.init();
		
		var name = prompt('name','name');
		socket.location_socket.emit('join', name);		
		
		var latlng = new google.maps.LatLng(37, 126);    
		var myOptions = {zoom: 9, center:latlng, mapTypeId:google.maps.MapTypeId.ROADMAP};    
		var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		
		$.getJSON('showdata', {name:name}, function(data){			
			$.each(data, function(index, item){							
				obsever.setMarker(map, item.latitude, item.longitude);				
			});
		});
		
		socket.location_socket.on('receive', function(data){			
			obsever.setMarker(map,data.latitude, data.longitude);
		});
	}
	
	this.setMarker = function(map, latitude, longitude){
		var marker = new google.maps.Marker({
			position:new google.maps.LatLng(latitude, longitude), 
			map:map
		});
	}
}