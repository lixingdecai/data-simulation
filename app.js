var PORT = 8001;

var http = require('http');
var url=require('url');
var fs=require('fs');
//var faker = require('faker');
var mine={
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};
var path=require('path');

var server = http.createServer(function (request, response) {
    //
    response.setHeader('Access-Control-Allow-Origin', '*');

    //console.log("request.url="+request.url);
    var requestUrl=request.url;
    var pathname = url.parse(request.url).pathname;
    //console.log("pathname: "+pathname);
    if (pathname.charAt(pathname.length - 1) == "/") {
        //如果访问目录
        pathname += "index.html"; //指定为默认网页
    }
    var realPath = path.join("assets", pathname);
    //console.log("realPath="+realPath+";pathname="+pathname);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';//后缀

    fs.exists(realPath, function (exists) {
        if (!exists) {
            if(realPath=="assets\\sentData"){//前台发送数据给后台的空接口
                parseJSON(request, response,requestUrl,ext,null)
            }else{
              // console.log("404");
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            }
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
            	//console.log(ext);
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    console.log(err);
                    response.end();
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                };
               //console.log(file+":file") ;
            });
        }
    });

  /*  request.on("data", function(data) {
      if(request.url="/sentData"){
          var params = url.parse(requestUrl, true).query;
          console.log(request.url+"date: "+params.date);
          writeFile(data,params.date);
      }
      //console.log("接收页面数据：" + data);
    });
    request.on("end", function() {
      console.log("接收页面数据完毕");
    });*/
});

//解析请求data和schema数据 并存入文件
function parseJSON(req,response,requestUrl,ext,next){ 
    var arr = [];
    req.on("data",function(data){
        arr.push(data);
    });
    req.on("end",function(){
        var data= Buffer.concat(arr).toString(),ret;
        try{
            var ret = JSON.parse(data);
        }catch(err){}
        var params = url.parse(requestUrl, true).query;
        console.log(req.url+"date: "+params.date);
        writeFile(data,params.date);

        var contentType = mine[ext] || "text/plain";
        response.writeHead(200, {
            'Content-Type': contentType
        });
        response.write("sent_success");
        response.end();
        /*req.body = ret;
        next();*/
    })
}
var _dirname="assets/JSONData/";
var _schemaDirname="assets/JSONSchema/";
function writeFile(data,name){
    //console.log("data: "+data);
    data=JSON.parse(data);
    //console.log("data2: "+data.jsonData);

    var options={encoding:'utf8',flag:'w'};
    /*var configTxt=JSON.stringify(config);*/
/*    fs.open(_dirname+name+".json","w",function(err,fd){
      if(!err){
        fs.close(fd);
      }
    });*/
    var fileName=_dirname+name+".json";
    var schemaName=_schemaDirname+name+".json";
    var jsonData=JSON.stringify(data.jsonData, true, 2);
    var dataschema=JSON.stringify(data.dataschema, true, 2);
    //写json数据
    fs.writeFile(fileName,
      jsonData,
      options,
      function(err){
      if(err){
        console.log("jsonData write failed: "+err);
      }else{
        console.log("jsonData saved");
      }
    });
    //写faker数据结构
    fs.writeFile(schemaName,
      dataschema,
      options,
      function(err){
      if(err){
        console.log("dataschema write failed: "+err);
      }else{
        console.log("dataschema saved");
      }
    });
}

function readFile(){
  var options={encoding:'utf8',flag:'rootPath'};
  fs.readFile(__dirname+"data.json",options,function(err,data){
    if(err){
      console.log("Failed to open Config File.")
    }else{
      console.log("Config Loaded");
      var config=JSON.parse(data);
    }
  })
}
     



server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
