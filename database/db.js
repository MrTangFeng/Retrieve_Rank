var MongodbClient=require('mongodb').MongoClient;
var assert=require('assert');

var url='http://localhost:27017/users';
MongodbClient.connect(url,function(err,db){
	assert.equal(null,err);
	console.log('成功');
	db.close();
});
