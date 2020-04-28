


// const express = require('express');
// const path = require('path');
// const app = express();
// // 在 app 文件夹开启静态服务
// app.use(express.static('../server'));
// app.listen(8090, () => {
//   console.log('Demo server listening on port 8090');
// });

// var express = require('express')
// var app = express();
// var bodyParser = require('body-parser');

// var http = require("http");

// var fs = require("fs");

// var path = require("path");
// var url = require("url");
// // 加载 mime 模块
// var mime = require("mime");

// var mysql = require("mysql");
// 	var client = mysql.createConnection({
// 		"host":"localhost",
// 		"port":"3306",
// 		"user":"root",
// 		"password":"root"
// 	});

// 	client.query("USE test",function(error,results){
// 		if(error){
// 			console.log("ClientConnectionReady Error:"+error.message);
// 			client.end();
// 			return;
// 		}
// 		// InsertData(client);
// 	});

	// InsertData=function(){
	// 	var values = [12,"hello","node mysql at:"+Math.random()];
	// 	client.query("INSERT INTO todo SET id=?,title=?,content=?",values,function(error,results){
	// 		if(error){
	// 			console.log("InsertData Error:"+ error.message);
	// 			client.end();
	// 			return;
	// 		}
	// 		console.log("inserted: "+results.affectedRows+" row.");
	// 	});

	// };

// function render(filePath, response) {
//   fs.readFile(filePath, function (err, data) {
//     if (err) {
//       throw err;
//     } else {
//       response.end(data);
//     }
//   });
// }

// app.use(bodyParser.urlencoded({extended:true}));//用于解析表单数据 Context-Type 为application/x-www-form-urlencoded 时 返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
// app.use(bodyParser.json());//用于解析json 会自动选择最为适宜的解析方式


// app.get('/',function(req,res){
//     filePath = path.join(__dirname, "index.html");
//     render(filePath, res);
// });

// app.get('/static',function(request,response){
//     filePath = path.join(__dirname, request.url);
//     // 读取静态文件
//     fs.readFile(filePath, function (err, data) {
//     if (err) {
//         throw err;
//     }
//       // 设置请求头
//     response.setHeader("Content-Type", mime.getType(request.url));
//     response.end(data);
//   });
// });

// app.get('/insert',function(req,res){
//   console.log(req.body);
//   if(req.body.username=='nyan'&&req.body.password=='nyannyannyan'){
//       res.status(200);
//       mans[2] = req.body;
//       res.json(mans);
//   }else{
//       res.json({failed:404});
//   }
//   res.end();
// });

// var server = app.listen(8080, function(){

//   var port = server.address().port;

//   console.log('Example app listening on port:%s',port);
// });

// const { Pool } = require('pg');
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true
// });

// const client = pool.connect();


var http = require("http");

var fs = require("fs");

var path = require("path");
var url = require("url");
// 加载 mime 模块
var mime = require("mime");

var mysql = require("mysql");
	var client = mysql.createConnection({
		"host":"localhost",
		"port":"3306",
		"user":"root",
		"password":"root"
	});

	client.query("USE test",function(error,results){
		if(error){
			console.log("ClientConnectionReady Error:"+error.message);
			client.end();
			return;
		}
		// InsertData(client);
	});

	// InsertData=function(){
	// 	var values = [12,"hello","node mysql at:"+Math.random()];
	// 	client.query("INSERT INTO todo SET id=?,title=?,content=?",values,function(error,results){
	// 		if(error){
	// 			console.log("InsertData Error:"+ error.message);
	// 			client.end();
	// 			return;
	// 		}
	// 		console.log("inserted: "+results.affectedRows+" row.");
	// 	});

	// };

function render(filePath, response) {
  fs.readFile(filePath, function (err, data) {
    if (err) {
      throw err;
    } else {
      response.end(data);
    }
  });
}

http.createServer(function (request, response) {
  if (request.url === '/' || request.url === '/index') {
    filePath = path.join(__dirname, "index.html");
    render(filePath, response);
    
  }
  else if (request.url.startsWith('/insert')) {
    console.log("成功调用插入函数");
    var params = url.parse(request.url, true).query;
    var values = [params.id,params.content,params.completed]
    console.log(params);

    // var client = pool.connect();
    client.query("INSERT INTO todo SET id=?,content=?,completed=?",values);
    response.end();

  }
  // else if (request.url.startsWith("/insert")) {
  //   console.log('成功');

    
  //   pool.connect(function(error,client,done){
  //     let sqlStr = 'SELECT * FROM todo';      // 查表的SQL语句
  //     client.query(sqlStr, [], function(err, response) {
  //     done();
  //     console.log(response.rows)  		  // 根据SQL语句查出的数据
  //   })

  //   });
     
    

  // }
  else if (request.url.startsWith("/update")) {
    console.log("成功调用update函数");
    var params = url.parse(request.url, true).query;
    var values = [params.content,params.completed,params.id]

    client.query("UPDATE todo SET content=?,completed=? WHERE id=?", values);
    response.end();
  }
  else if (request.url.startsWith("/delete")) {
    console.log("成功调用delete函数");
    var params = url.parse(request.url, true).query;
    console.log(params);
    //var values = [params.id,params.content,params.completed]

    client.query("DELETE FROM todo WHERE id=?", parseInt(params.id));
    response.end();
  }
  // 判断路由是否是 /static/index.css
  // 是就读取我们的 index.css 文件
  else if (request.url.startsWith("/static")) {
    // 路由
    filePath = path.join(__dirname, request.url);
    // 读取静态文件
    fs.readFile(filePath, function (err, data) {
      if (err) {
        throw err;
      }
      // 设置请求头
      response.setHeader("Content-Type", mime.getType(request.url));
      response.end(data);
    })
  }
  else {
    // filePath = path.join(__dirname, "template", "404.html");
    // render(filePath, response);
  }
}).listen(8080, function () {
  console.log("OK,访问：localhost:8080");
});