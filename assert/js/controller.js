// 定义一个模块, 并引入依赖的angular模块
var app = angular.module( 'UserManage', [ 'starter.services','ngRoute','angular-clipboard' ] );

function umRouteConfig ( $routeProvider ) {
	// console.log( $routeProvider );
	$routeProvider
	.when( '/home/:case/:jsonID', {
		controller: ExampleController,
		templateUrl: 'home.html'
	})
	.when( '/configForm/:id', {
		controller: ConfigFormController,
		templateUrl: 'config_form.html'
	})
	.when( '/editForm/:id', {
		controller: EditNodeController,
		templateUrl: 'config_form.html'
	})
	.when( '/myInterface', {
		controller: MyInterfaceController,
		templateUrl: 'myInterface.html'
	})
	.otherwise({
      redirectTo: '/home/0/0'
    });
}

app.config( umRouteConfig );

/*app.factory('obListService',function(){
	var obList={};
	return {
		get:function(){
			return obList;
		},
		set:function(obL){
			return obList=obL;
		}
	}
})*/

app.constant('OBJECT_TYPE', {
    OBJECT: 'object',
    STRING: 'string',
    INTEGER: 'integer',
    ARRAY: 'array',
    BOOLEAN:'boolean',
    FAKER:'faker'
})


//递归解析json数组
function parserJson(jsonObject){
	for(var j in jsonObject){
		var flag=false;//当前元素是不是数组

		if(typeof(jsonObject[j])==="object"){
			flag=true;
		
		}
		if(flag){
			parserJson(jsonObject[j]);
		}else{
			var ss=jsonObject[j]+"";

	 		if(ss.indexOf(".")<0){
	 			continue;
	 		}
	 		var arr = jsonObject[j].split('.');
        	var module = arr[0];
        	var method = arr[1];
        	var val = faker[module][method]();
       	 	if (typeof val == "object") {
          		val = JSON.stringify(val, true, 2);
       		 }
       		jsonObject[j]=val;
	 		console.log(jsonObject[j]);
		}
	}

	return jsonObject;
}

//测试：功能验证
function schemaFakerController($scope,$http){
	//var jsf = require('json-schema-faker');
	var refs=[{
		id:'aa',
		type:'string'
	}];
	var schema = {
	  type: 'object',
	  properties: {
	    user: {
	      type: 'object',
	      properties: {
	        id: {
	          $ref: '#/definitions/positiveInt'
	        },
	        name: {
	          type: 'string',
	          faker: 'name.findName'
	        },
	        email: {
	          type: 'string',
	          format: 'email',
	          faker: 'internet.email'
	        },
	        array:{
	          type:"array",
	          minItems:100,
	          maxItems:100,
	          items:{
	          	type: 'object',
	          	properties:{
	          		name: {
				        $ref: '#/definitions/positiveInt'
				    }
	          	},
	          	required: ['name']
	          }	          
	        }
	      },
	      required: ['id', 'name', 'email','array']
	    }
	  },
	  required: ['user'],
	  definitions: {
	    positiveInt: {
	      type: 'integer',
	      minimum: 0,
	      exclusiveMinimum: true
	    }
	  }
	};
	var ss=JSON.stringify(schema);//将json对象转化为json字符
	ss=JSON.parse(ss);

	//$scope.jsonObject3=JSON.stringify(ss, true, 2);

	$http.get('server/example2.json').success( function ( data, status, headers, config ) {
		var sample = jsf(data,refs);
		$scope.jsonObject2=JSON.stringify(sample, true, 2);

		console.log(sample.user);
	})
	
	
}

//测试用
function ListController ( $scope, $http ) {
	var fakerList=[];
	for(var f in faker){
		var fo=new Object;
		var fa=[];
		for(var ff in faker[f]){
			var ffo=new Object;
			ffo.name=ff;
			ffo.decript="";
			fa.push(ffo);
		}
		var fs=f.toString()
		fo.name=fa;
		fo.decript="";
		fo.module=f;
		fakerList.push(fo);
	}
	$scope.jsonObject3=JSON.stringify(fakerList, true, 2);

	var s = schemaFakerController($scope,$http);

	faker.locale = "zh_CN";
/*	var randomName = faker.name.findName(); // Rowan Nikolaus
	var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
	var randomCard = faker.helpers.createCard(); // random contact card containing many properties
	console.log("saaaaa"+randomName);*/
	$http.get( 'server/example1.json' ).success( function ( data, status, headers, config ) {
		console.log( data );
		//data = JSON.stringify(data);
		var newData=new Object;
		for (var i = 0; i < data.length; i++) {
			 jsonData=data[i];
			 for(var j in jsonData){
			 	jsonData[j]=parserJson(jsonData[j]);
			 	// for(var k in jsonData[j]){
			 	// 	var ss=jsonData[j][k]+"";

			 	// 	if(ss.indexOf(".")<0){
			 	// 		continue;
			 	// 	}
			 	// 	var arr = jsonData[j][k].split('.');
     //            	var module = arr[0];
     //            	var method = arr[1];
     //            	var val = faker[module][method]();
     //           	 	if (typeof val === "object") {
     //              		val = JSON.stringify(val, true, 2);
     //           		 }
     //           		jsonData[j][k]=val;
			 	// 	console.log(jsonData[j][k]);
			 	// }
			 }
		}
		$scope.jsonObject=JSON.stringify(jsonData, true, 2);
	});
}

/**
**我的接口控制器
**/
function MyInterfaceController($scope, $http,locals){
	var dataTimestamp=locals.get("data_timestamp",[]);
	console.log("dataTimestamp1:"+dataTimestamp);
	if(dataTimestamp.length!=0){
		dataTimestamp =  JSON.parse(dataTimestamp);  
	}
	$scope.url=getURL();
	$scope.dataTimestamp=dataTimestamp;
}

function getObjById ( id, obj ) {
	var len = obj.length;
	for(var i=0; i<len; i++){
		if( id == obj[i].id ){
			return obj[i];
		}		
	}
	return null;
}

/**
 * @returns 返回URL 如：http://localhost:8080 
 */  
function getURL(){  
    var curWwwPath = window.document.location.href;  
    //获取主机地址之后的目录，如： cis/website/meun.htm  
    var pathName = window.document.location.pathname;  
    var pos = curWwwPath.indexOf(pathName); //获取主机地址，如： http://localhost:8080  
    var localhostPaht = curWwwPath.substring(0, pos); //获取带"/"的项目名，如：/cis  
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);  
    var rootPath = localhostPaht + projectName;  
    return window.document.location.origin;
}

function exampleInit(expcase,$scope,obListService,OBJECT_TYPE,jsonID,$http){
	switch (expcase){
	case "boolean":
		$scope.obList=[{ "name":"root",  "id":"1",  "type":"boolean", "parent":""}];
	 	obListService.set($scope.obList);
	 	break;
	case "string":
	 	$scope.obList=[{ "name":"root",  "id":"1",  "type":"string", "parent":"","length":"12"}];
	  	obListService.set($scope.obList);
	 	break;
	 case "integer":
	 	$scope.obList=[{ "name":"root",  "id":"1",  "type":"integer", "parent":"","minimum":0,"maximum":100}];
	   	obListService.set($scope.obList);
	 	break;
	 case "enums":
	 	$scope.obList=[{ "name":"root",  "id":"1",  "type":"string", "parent":"","enumString":"404&500&300"}];
	 	obListService.set($scope.obList);
	 	break;
	 case "fixed":
	 	$scope.obList=[{ "name":"root",  "id":"1",  "type":"array", "parent":"","num":"10"},
	 					{ "name":"",  "id":"1_1",  "type":"object", "parent":"1"},
	 					{ "name":"int",  "id":"1_1_1",  "type":"integer", "parent":"1_1","minimum":0,"maximum":100},
	 					{ "name":"boolean",  "id":"1_1_2",  "type":"boolean", "parent":"1_1"},
	 					{ "name":"string",  "id":"1_1_3",  "type":"string", "parent":"1_1","parentNum":0,"length":"12"}];
	 	obListService.set($scope.obList);
	 	break;
	 case "faker":
	 	$scope.obList=[{ "name":"root",  "id":"1",  "type":"array", "parent":"","num":"10"},
	 					{ "name":"",  "id":"1_1",  "type":"object", "parent":"1"},
	 					{ "name":"name",  "id":"1_1_1",  "type":"faker", "parent":"1_1","fakerData1":{"module":"name"},"fakerData2":{"name":"findName"}},
	 					{ "name":"email", "id":"1_1_2",  "type":"faker", "parent":"1_1","fakerData1":{"module":"internet"},"fakerData2":{"name":"email"}}];
	 	obListService.set($scope.obList);
	 	break;
	 case "jsonID":
	 	//反向解析存储数据并显示
	 	$http.get(getURL()+'/JSONSchema/'+jsonID+".json").success( function ( data, status, headers, config ) {
			$scope.obList=parserSchema(data,OBJECT_TYPE);
			obListService.set($scope.obList);

			mathParentNum($scope.obList);
			var rootObject=findById("1",obListService);
			if(rootObject!=undefined){
				createJSON($scope,obListService,OBJECT_TYPE);
			}
		});
	 	
	 	break;
	default:
	 	var obList=obListService.get();
		console.log(obList);
		if(obList.length>0){
			$scope.obList=obList;
		}
	}
	mathParentNum($scope.obList);
	var rootObject=findById("1",obListService);
	if(rootObject!=undefined){
		createJSON($scope,obListService,OBJECT_TYPE);
	}
	
}

//生成数据
function createJSON($scope,obListService,OBJECT_TYPE){
	var rootObject=findById("1",obListService);

	var schema=new Object;
	schema.type=rootObject.type;
/*		var enumList=[];
	//枚举类
	if(rootObject.enumString!=undefined&&rootObject.enumString!=""&&rootObject.enumString!=null){
		schema.enum=rootObject.enumString.split("&"); 
	}*/
	if(schema.type==OBJECT_TYPE.OBJECT){
		schema.properties=new Object;
			schema.required=[];
			for(var j=0;j<$scope.obList.length;j++){
				if ("1"==$scope.obList[j].parent){
					schema.required.push($scope.obList[j].name);
				}
			}
		modelChangeSchema($scope.obList,"1",schema.properties,obListService,OBJECT_TYPE);
	}else if(schema.type==OBJECT_TYPE.ARRAY){
		schema.items=new Object;
		schema.minItems=rootObject.num;
		schema.maxItems=rootObject.num;
		//枚举类
		if(rootObject.enumString!=undefined&&rootObject.enumString!=""&&rootObject.enumString!=null){
			schema.items.enum=rootObject.enumString.split("&"); 
		}
		modelChangeSchema($scope.obList,"1",schema.items,obListService,OBJECT_TYPE);
	}else if(schema.type==OBJECT_TYPE.FAKER){
		schema.type=OBJECT_TYPE.STRING;
		if(rootObject.fakerData1!=undefined && rootObject.fakerData2!=undefined){
			schema.faker=rootObject.fakerData1.module+"."+rootObject.fakerData2.name;
		}
	}else{
		schema.faker=rootObject.faker;
		schema.maxLength=rootObject.length;
		schema.minLength=rootObject.length;
		schema.minimum=rootObject.minimum;
		schema.maximum=rootObject.maximum;
		schema.multipleOf=rootObject.multipleOf;
		//枚举类
		if(rootObject.enumString!=undefined&&rootObject.enumString!=""&&rootObject.enumString!=null){
			schema.enum=rootObject.enumString.split("&"); 
		}
	}
	
	//modelChangeSchema($scope.obList,"1",schema.properties,obListService,OBJECT_TYPE);
	try{
		$scope.jsonObject=JSON.stringify(schema, true, 2);
		$scope.jsonObject2=JSON.stringify(jsf(schema), true, 2);
	}catch(err){
		alert("生成失败：数据格式有误！");
	}
}

//数据生成页面
function ExampleController($scope, $http,OBJECT_TYPE,$location,obListService,locals,$routeParams){
	var expcase = $routeParams.case;
	var jsonID = $routeParams.jsonID;
	
	$scope.obList=[]
	exampleInit(expcase,$scope,obListService,OBJECT_TYPE,jsonID,$http);

	
/*	templeParser($http,$scope);*/
	

	/*var obList=obListService.get();
	console.log(obList);
	if(obList.length>0){
		$scope.obList=obList;
	}*/
	
	//mathParentNum($scope.obList);

	//创建根节点
	$scope.creatNote=function(){
		$scope.obList=[];
		obListService.set($scope.obList);
		//$location.path("/configForm/undefined");
		ConfigFormController($scope,$http,OBJECT_TYPE,obListService,"undefined",$location);
		$('#myModal3').modal('show');
	}

	//添加子节点
	$scope.addChild=function(id){
		$('#myModal3').modal('show');
		console.log("addchild");
		obListService.set($scope.obList);
		ConfigFormController($scope,$http,OBJECT_TYPE,obListService,id,$location);
		//$location.path("/configForm/"+id);
	}
	//编辑节点
	$scope.editNode=function(id){
		var idObj=null;

		if(id!=null&&id!=''){
			idObj=findById(id,obListService);
		}
		$scope.exObject=angular.fromJson(idObj);
		//obListService.set($scope.obList);
		//$scope.exObject=new Object;
		EditNodeController($scope,$http,OBJECT_TYPE,obListService,id,idObj,$location);
		$('#myModal3').modal('show');
		/*$location.path("/editForm/"+id);*/
	}

	//删除节点
	var delnote;
	$scope.deleteNode=function(id){
		$('#myModal2').modal('show');
		delnote=id;
	}

	function idelete(oblist,id,delList){
		for(var i=0;i<oblist.length;i++){
			var child=oblist[i];
			if (child.parent!=null &&  child.parent==id){
				delList.push(child.id);
				idelete(oblist,child.id,delList);
			}
		}
	}


	//确定删除
	$scope.sureDel=function(){
		var delList=[];
		for(var i=0;i<$scope.obList.length;i++){
			if($scope.obList[i].id==delnote){
				
				idelete($scope.obList,delnote,delList);	//递归删除所有子节点
				$scope.obList.splice(i,delList.length+1);		//删除节点
			}
		}
		obListService.set($scope.obList);
		
		$('#myModal2').modal('hide');
	}

	//结构转化为数据
	$scope.schemaToData=function(){
		if($scope.jsonObject==undefined||$scope.jsonObject==''||$scope.jsonObject==null){
			alert("请先创建数据结构");
			return false;
		}
		try{
			var jo=JSON.parse($scope.jsonObject);
			$scope.jsonObject2=JSON.stringify(jsf(jo), true, 2);
		}catch(err){
			alert("生成失败：数据格式有误！");
		}
	}
	


	//复制到粘贴板
	$scope.supported = false;

	$scope.textToCopy = 'I can copy by clicking!';

    $scope.success = function () {
        console.log('Copied!');
    };

    $scope.fail = function (err) {
        console.error('Error!', err);
    };
	
    $scope.$watch('jsonObject2', function(newValue, oldValue) {  
	    // console.log(newValue+ '===' +oldValue);  
	   
		$scope.jsonDataChange=true;
	   
	}); 

	//存储json数据
	$scope.sent=function(){
		$scope.jsonDataChange=false;

		var timestamp = Date.parse(new Date());
		var data=new Object;
		data.jsonData=JSON.parse($scope.jsonObject2);
		data.dataschema=JSON.parse($scope.jsonObject);
		//data=JSON.parse(data);
		$http.post(getURL()+'/sentData?date='+timestamp,data).success( function ( data, status, headers, config ) {
			
		})
		$('#myModal').modal('show');
		$scope.jsonURL=getURL()+"/JSONData/"+timestamp+".json";

		//alert(str); 
		var dataTimestamp=locals.get("data_timestamp",[]);
		console.log("dataTimestamp1:"+dataTimestamp);
		if(dataTimestamp.length!=0){
			dataTimestamp =  JSON.parse(dataTimestamp);  
		}
		var newData=new Object;
		newData.id="";
		var rootObject=findById("1",obListService);
		newData.desc=rootObject.desc;
		newData.timestamp=timestamp;
		dataTimestamp.push(newData);
		dataTimestamp=JSON.stringify(dataTimestamp);
		console.log("dataTimestamp2:"+dataTimestamp);
		locals.set("data_timestamp",dataTimestamp);
	}


	//树形结构生成数据
	$scope.createJson=function(){
		var rootObject=findById("1",obListService);
		if(rootObject==undefined){
			alert("请先创建数据结构!");
			return false;
		}
		createJSON($scope,obListService,OBJECT_TYPE);
	}
}

//判断是否json对象
function isJson(obj){
  var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
  return isjson;
}

//编辑子节点
function EditNodeController($scope,$http,OBJECT_TYPE,obListService,id,idObj,$location){
	//var id = $routeParams.id;
	

	$http.get('server/faker-module-method.json').success( function ( data, status, headers, config ) {
		$scope.fakerData=data;
	})
	//$scope.fakerData=obListService.getFakerData();

	$scope.saveExObject=function(){
		if($scope.parentObject!=null && $scope.parentObject.type!=OBJECT_TYPE.ARRAY && ($scope.exObject.name==''|| $scope.exObject.name==undefined)){
			alert("请输入名称");
			return false;
		}

		var obList =obListService.get();
		for(var i=0;i<obList.length;i++){
			if(obList[i].id==id){
				obList[i]=$scope.exObject;
				//$location.path("/example/");
				//alert("修改成功！");
			}
		}

		$scope.obList=obList;
		obListService.set(obList);
		$('#myModal3').modal('hide');
	}
}



//添加子节点
function ConfigFormController($scope,$http,OBJECT_TYPE,obListService,id,$location){
	$('[data-toggle="tooltip"]').tooltip();

	$http.get('server/faker-module-method.json').success( function ( data, status, headers, config ) {
		$scope.fakerData=data;
	})
	//var id = $routeParams.id;
	console.log("ConfigForm");

	var obList=obListService.get();

	$scope.exObject=new Object;
	if(id=="undefined"){
		$scope.exObject.name="root";
		$scope.exObject.parent="";
		$scope.exObject.id="1";
	}else{

		$scope.exObject.parent=id;
		$scope.exObject.id=createId(id,obListService);
		
	}
	//初始值
	$scope.exObject.type=OBJECT_TYPE.OBJECT;
	//获取父节点
	$scope.parentObject=findById(id,obListService);

	$scope.saveExObject=function(){
		if($scope.parentObject!=null && $scope.parentObject.type!=OBJECT_TYPE.ARRAY && ($scope.exObject.name==''|| $scope.exObject.name==undefined)){
			alert("请输入名称");
			return false;
		}

		obList.push($scope.exObject);
		
		if(id=="undefined"){
			//根节点不进行排序
			obListService.set(obList);
			$scope.obList=obList;
		}else{
			var newList=[];
			newList.push(findById(1,obListService));
			sortList(newList,obList,"1",true);
			obListService.set(newList);
			$scope.obList=newList;
		}
		mathParentNum($scope.obList);
		//$location.path("/example");
		$('#myModal3').modal('hide');
	}
}

/*根据id获取对象*/
function findById(id,obListService){
	var ob=null
	var obList=obListService.get();
	for(var i=0;i<obList.length;i++){
		if(obList[i].id==id){
			return ob=obList[i];
		}
	}
	return ob;
}

/*生成id */
function createId(parentId,obListService){
	
	if(parentId!=''&&parentId!=undefined&&parentId!="undefined"){
		var obList=obListService.get();
		var num=1;
		for(var i=0;i<obList.length;i++){
			if(obList[i].parent==parentId){
				num++;
			}
		}
		return parentId+"_"+num;
	}else{
		//根节点
		return obListService.get().length+1;
	}
	
}

//计算父节点数量
function mathParentNum(obList){
	for(var i=0;i<obList.length;i++){
		var id=obList[i].id;
		var parentNum=0;
		if(id.indexOf("_")>0){
			parentNum=(id.split('_')).length-1;
		}
		obList[i].parentNum=parentNum*20;
	}
}

//递归解析schema
function schemaChangeModel(data,parentId,modelList,OBJECT_TYPE){
	
	var num=1;
	for(var name in data){
		
		console.log(typeof(data[name])+" : "+name);
		if(typeof(data[name])!="object" && name=="type"){
				var newObject2=new Object;
				newObject2.id = parentId+"_"+num;
				newObject2.parent=parentId;
				newObject2.type = data[name];
				newObject2.name = '';
			if(data[name]==OBJECT_TYPE.ARRAY){
				
				newObject2.length=data.items.minItems;
				newObject2.faker=data.items.faker;

				schemaChangeModel(data.items,newObject2.id,modelList,OBJECT_TYPE);
				modelList.push(newObject2);
			}else if(data[name]==OBJECT_TYPE.OBJECT){
				
				//newObject2.num=data.items.minItems;
				newObject2.faker=data.properties.faker;

				schemaChangeModel(data.properties,newObject2.id,modelList,OBJECT_TYPE);
				modelList.push(newObject2);
			}else if(data[name]==OBJECT_TYPE.INTEGER){
				
				modelList.push(newObject2);
			}else if(data[name]==OBJECT_TYPE.STRING){
				newObject2.length=data.minLength;
				if(data.faker!=undefined&&data.faker!=''){
					newObject2.fakerData1=new Object;
					newObject2.fakerData2=new Object;
					var fakerString=data.faker.split(".");
					newObject2.fakerData1.module=fakerString[0];
					newObject2.fakerData2.name=fakerString[1];
				}
				modelList.push(newObject2);
			}
			num++;
		}else if(typeof(data[name])=="object"){
			if(name=="enum"){
				for(var i=0;i<modelList.length;i++){
					if(modelList[i].id==parentId){
						for(var enums in data[name]){
							if(modelList[i].enumString==undefined){
								modelList[i].enumString=data[name][enums];
							}else{
								modelList[i].enumString += ("&"+data[name][enums]);
							}
							
						}
					}
				}
			}else{
				var newObject=new Object;
				newObject.id = parentId+"_"+num;
				newObject.parent=parentId;
				newObject.type = data[name].type;
				newObject.name = name;
				newObject.num=data[name].minItems;
				newObject.length = data[name].minLength;
				//存在faker生成策略的情况
				if(data[name].faker!=undefined&&data[name].faker!=''){
					var fakerString=data[name].faker.split(".");
					newObject.type="faker";
					newObject.fakerData1=new Object;
					newObject.fakerData2=new Object;
					newObject.fakerData1.module=fakerString[0];
					newObject.fakerData2.name=fakerString[1];
				}

				if(data[name].type==OBJECT_TYPE.ARRAY){
					newObject.num=data[name].minItems;
					modelList.push(newObject);
					schemaChangeModel(data[name].items,newObject.id,modelList,OBJECT_TYPE);
					
					num++;
				}else if(data[name].type==OBJECT_TYPE.OBJECT){	
					newObject.num=data[name].minItems;
					modelList.push(newObject);
					schemaChangeModel(data[name].properties,newObject.id,modelList,OBJECT_TYPE);
					
					num++;
				}else if(data[name].type==OBJECT_TYPE.STRING){
					modelList.push(newObject);
					num++;
				}else if(data[name].type==OBJECT_TYPE.INTEGER){
					modelList.push(newObject);
					num++;
				}
				
			}
		}
		
		
		
	}



}

//解析schema
function parserSchema(data,OBJECT_TYPE){
	var modelList=[];
	
	var rootObj=data;
	
	rootObj.id="1";
	rootObj.name="root";
	rootObj.type=data.type;
	rootObj.parentId='';
	var newObject = new Object;
	modelList.push(rootObj);
	console.log(modelList);

	if(data.type==OBJECT_TYPE.ARRAY){
		rootObj.num=data.minItems;
		schemaChangeModel(data.items,rootObj.id,modelList,OBJECT_TYPE);
	}else if(data.type==OBJECT_TYPE.OBJECT){
		schemaChangeModel(data.properties,rootObj.id,modelList,OBJECT_TYPE);
	}else if(data.type==OBJECT_TYPE.STRING){

	}else if(data.type==OBJECT_TYPE.INTEGER){

	}
	
	
	var newList=[];
	newList.push(rootObj);
	sortList(newList,modelList,"1",true);
	return newList;
}

//model转schema
//model的数组list
//parentId节点 parentId
//schema fakerSchema的标准化结构model
function modelChangeSchema(obList,parentId,schema,obListService,OBJECT_TYPE){
	

	for(var i=0;i<obList.length;i++){
		var e = obList[i];
		if (e.parent!=null && e.parent==parentId){
			if(e.type==OBJECT_TYPE.ARRAY){

				if(e.name=="undefined"||e.name==undefined||e.name==null||e.name==''){
					
					schema.type=OBJECT_TYPE.ARRAY;
					schema.maxItems=e.num;
					schema.minItems=e.num;
					schema.items=new Object;
					//枚举类
					if(e.enumString!=undefined&&e.enumString!=""&&e.enumString!=null){
						schema.items.enum=e.enumString.split("&"); 
					}
					modelChangeSchema(obList,e.id,schema.items,obListService,OBJECT_TYPE);
				}else{
					var newObject = new Object;
					schema[e.name] = newObject;
					newObject.type = OBJECT_TYPE.ARRAY;
					newObject.maxItems = e.num;
					newObject.minItems = e.num;
					newObject.items = new Object;
					//枚举类
					if(e.enumString!=undefined&&e.enumString!=""&&e.enumString!=null){
						newObject.items.enum=e.enumString.split("&"); 
					}
					modelChangeSchema(obList,e.id,newObject.items,obListService,OBJECT_TYPE);
				}
			}else if(e.type==OBJECT_TYPE.OBJECT){

				if(e.name=="undefined"||e.name==undefined||e.name==null||e.name==''){
					schema.type=OBJECT_TYPE.OBJECT;
					schema.properties=new Object;
					schema.required=[];
					for(var j=0;j<obList.length;j++){
						if (e.id!=null && e.id==obList[j].parent){
							schema.required.push(obList[j].name);
						}
					}
					modelChangeSchema(obList,e.id,schema.properties,obListService,OBJECT_TYPE);
				}else{
					var newObject=new Object;
					schema[e.name]=newObject;
					newObject.type=OBJECT_TYPE.OBJECT;
					newObject.properties=new Object;
					newObject.required=[];
					for(var j=0;j<obList.length;j++){
						if (e.id!=null && e.id==obList[j].parent){
							newObject.required.push(obList[j].name);
						}
					}
					modelChangeSchema(obList,e.id,newObject.properties,obListService,OBJECT_TYPE);
				}
			}else if(e.type==OBJECT_TYPE.STRING){
				var newObject=new Object;
				if(e.name=="undefined"||e.name==undefined||e.name==null||e.name==''){
					//枚举类
					if(e.enumString!=undefined&&e.enumString!=""&&e.enumString!=null){
						schema.enum=e.enumString.split("&"); 
					}
					schema.type=OBJECT_TYPE.STRING;
					schema.maxLength=e.length;
					schema.minLength=e.length;
				}else{
					schema[e.name]=newObject;
					//枚举类
					if(e.enumString!=undefined&&e.enumString!=""&&e.enumString!=null){
						newObject.enum=e.enumString.split("&"); 
					}
					newObject.type=OBJECT_TYPE.STRING;
					newObject.maxLength=e.length;
					newObject.minLength=e.length;
				}
			}else if(e.type==OBJECT_TYPE.INTEGER){
				var newObject=new Object;
				if(e.name=="undefined"||e.name==undefined||e.name==null||e.name==''){
					schema.type=OBJECT_TYPE.INTEGER;
					if(e.minimum){
						schema.minimum=Number(e.minimum);
					}
					schema.multipleOf=e.multipleOf;
					if(e.maximum){
						schema.maximum=Number(e.maximum);
					}
					//枚举类
					if(e.enumString!=undefined&&e.enumString!=""&&e.enumString!=null){
						schema.enum=e.enumString.split("&"); 
						for (ii=0;ii<schema.enum.length ;ii++ ){
							schema.enum[ii]=Number(schema.enum[ii]);
						} 
					}
				}else{
					
					schema[e.name]=newObject;
					newObject.type=OBJECT_TYPE.INTEGER;
					if(e.minimum){
						newObject.minimum=Number(e.minimum);
					}
					if(e.maximum){
						newObject.maximum=Number(e.maximum);
					}
					newObject.multipleOf=e.multipleOf;
					//枚举类
					if(e.enumString!=undefined&&e.enumString!=""&&e.enumString!=null){
						newObject.enum=[];
						var enumLists=e.enumString.split("&"); 
						for (ii=0;ii<enumLists.length ;ii++ ){
							newObject.enum.push(Number(enumLists[ii]));
						} 
					}
				}
			}else if(e.type==OBJECT_TYPE.FAKER){
				var newObject=new Object;
				if(e.name=="undefined"||e.name==undefined||e.name==null||e.name==''){
					schema.type=OBJECT_TYPE.INTEGER;
					if(e.fakerData1!=undefined && e.fakerData2!=undefined){
						schema.faker=e.fakerData1.module+"."+e.fakerData2.name;
					}
				}else{
					schema[e.name]=newObject;
					newObject.type=OBJECT_TYPE.STRING;
					if(e.fakerData1!=undefined && e.fakerData2!=undefined){
						newObject.faker=e.fakerData1.module+"."+e.fakerData2.name;
					}
				}
			}else if(e.type==OBJECT_TYPE.BOOLEAN){
				if(e.name=="undefined"||e.name==undefined||e.name==null||e.name==''){
					schema.type=OBJECT_TYPE.BOOLEAN;
				}else{
					var newObject=new Object;
					schema[e.name]=newObject;
					newObject.type=OBJECT_TYPE.BOOLEAN;
				}
			}
			//modelChangeSchema(obList,e.id,schema.items,obListService);
		}
	}
}


/**
**对象排序
**
**list:新的树形对象 数组
**sourcelist：旧的树形对象 数组
**parentId:父节点
**cascade:判断是否有子节点
**/
function sortList(list, sourcelist, parentId, cascade){
	for (var i=0; i<sourcelist.length; i++){
		
		var e = sourcelist[i];
		if (e.parent!=null && e.parent==parentId){
			list.push(e);
			if (cascade){
				// 判断是否还有子节点, 有则继续获取子节点
				for (var j=0; j<sourcelist.length; j++){
					var child = sourcelist[j];
					if(child==undefined||child==null){
						continue;
					}
					if (child.parent!=null &&  child.parent==e.id){
						sortList(list, sourcelist, e.id, true);
						break;
					}
				}
			}
		}
	}
}
