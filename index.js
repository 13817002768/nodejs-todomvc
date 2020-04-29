
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

	});



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
  //console.log('ttest');
  if (request.url === '/' || request.url === '/index') {
    //console.log('////');
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