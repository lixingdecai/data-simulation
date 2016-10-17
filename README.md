## datasimulation 模拟json数据生成工具

## 简介
datasimulation是为了让前端开发人员脱离后端依赖，可以生成前台所需求的数据，不用等待后端接口开发完成才能进展工作。
根据你的需求，在页面的树形结构配置出你需要的数据的结构、类型和一些特定数据（地址、名称、金额、邮箱等等）。并将生成的数据存储本地，生成一个可提供前端调用的接口。在等待后端提供可用接口后，与之替换就好。
避免手写容易产生的格式化问题 和 减少大数据生成的庞大工作量

##截图<br>

  数据配置生成页面<br> 
  ![](https://github.com/lixingdecai/data-simulation/raw/master/src/images/screenShot1.png)  
  我的接口<br>  
  ![](https://github.com/lixingdecai/data-simulation/raw/master/src/images/screenShot2.png)

##启动
安装node 
切换到工程当前文件夹
输入命令：node app.js

##功能
数据类型：object、array、integer、string、faker

object:		对象类型。可添加子节点、设置对象名；
array: 		数组类型。可添加子节点、设置数组数量、数组名称、枚举(当设置了枚举范围就不可添加子节点)；
integer:	数字类型。可设置名称、大小范围、多少的倍数、枚举（当输入非数字时会自动转为null）
string:		字符类型。可设置名称、字符长度、枚举
boolean: 	boolean类型。随机生成true false。
faker:		特殊类型。一种生成策略，可以选择生成随机邮箱、金额、名称等等

**枚举：	设置特定的取值范围。

## 技术
服务：node.js

json数据结构：json-schema-faker (github:https://github.com/json-schema-faker/json-schema-faker) 

生成策略：faker.js、 (chance.js、randexp 功能还未添加)

前端架构：angular.js


##树形模型结构
    ——id			标识符
    ——parent		父节点标识id
    ——type			类型
    ——num			数量（array）
    ——length		长度（string）
    ——enumString	枚举内容
    ——minimum		最小值（integer）
    ——maximum		最大值（integer）
    ——multipleOf	倍数（integer）
    ——fakerData1
    	——module	faker的模块名
    ——fakerData2
    	——name		faker的方法名称
	

##bug

**对象包涵一个无key值对象[{},{},{}]  这种类型无法创建 无法反向解析。无法动态添加
