// 定义一个模块, 并引入依赖的angular模块
var app = angular.module( 'UserManage', [ 'starter.services','ngRoute','angular-clipboard' ] );

function umRouteConfig ( $routeProvider ) {
	// console.log( $routeProvider );
	$routeProvider
	.when( '/example/:case/:jsonID', {
		controller: ExampleController,
		templateUrl: 'example.html'
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
      redirectTo: '/example/0/0'
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