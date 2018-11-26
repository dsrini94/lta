const express = require('express'),
      http = require('http'),
      path = require('path'),
      app = express(),
      port = process.env.PORT || 3001;

app.use(express.static(__dirname+'/dist/LTA/'));

app.get('/',(req,res) => res.sendFile(path.join(__dirname)));

const server = http.createServer(app);

server.listen(port,()=>{
  console.log('server started');
})
