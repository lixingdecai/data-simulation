var appService = angular.module('starter.services', [])

.factory('obListService',function($http,$q,$window){
	var obList=[];
	var fakerData=null;
	return {
		get:function(){
			if(obList.length==0){
				return obList;
			}else{
				return JSON.parse(JSON.stringify(obList)) ;
			}
			
		},
		set:function(obL){
			return obList=obL;
		},
		/*get:function(){
			var data=[]
			if($window.localStorage["page_ObList"]==null||$window.localStorage["page_ObList"]==undefined){
				data=JSON.parse($window.localStorage["page_ObList"]);
			}
			return  data;
		},
		set:function(obL){
			obL=JSON.stringify(obL);
			return  $window.localStorage["page_ObList"]=obL;
		},*/
		getFakerData:function(){
			
			if(fakerData==undefined||fakerData==null){
				var deferred = $q.defer();
				var promise = deferred.promise;
				$http.get('server/faker-module-method.json').success( function ( data, status, headers, config ) {
					deferred.resolve(data);
				})
					return promise;
			}else{
				return fakerData;
			}
			
		}
	}
})
.factory('locals',['$window',function($window){
      return{        //存储单个属性
        set :function(key,value){
          $window.localStorage[key]=value;
        },        //读取单个属性
        get:function(key,defaultValue){
          return  $window.localStorage[key] || defaultValue;
        },        //存储对象，以JSON格式存储
        setObject:function(key,value){
          $window.localStorage[key]=JSON.stringify(value);
        },        //读取对象
        getObject: function (key) {
          return JSON.parse($window.localStorage[key] || '{}');
        }

      }
  }])
.filter("isEmpty",function() { //数字转大写字母
	 
	 return function(input){
		if(input==null||input==undefined||input==''){
			 input="空";
		}
		return input;
	 }
});
;