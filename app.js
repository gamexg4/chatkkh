var http = require('http');

http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end('dd');
}).listen(process.env.PORT, function(){
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log('server start!');
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
});