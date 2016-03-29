var express = require('express');
var router = express.Router();
var watson = require('watson-developer-cloud');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var CronJob = require('cron').CronJob;

var retrieve_and_rank = watson.retrieve_and_rank({
	username : 'ab43c847-4b7a-4fcf-a79b-1073432a38b7',
	password : 'R7jJFNN9US48',
	version : 'v1'
});

retrieve_and_rank.listConfigs({
	cluster_id : 'sc8624291e_d97e_46c3_bb65_f2c6f49d3bf9'
}, function(err, response) {
	if (err) {
		console.log('Error', err);
	} else {
		console.log(JSON.stringify(response, null, 2));

	}
});

/* GET home page. */
router.get('/', function(req, res, next) {
	/*if (!req.query.action) {
	 return res.json({'Status':-1,'Error':'No action!'});
	 };*/

	res.render('value');

});
router.get('/view', function(req, res, next) {
	res.render('view');

});
router.get('/index', function(req, res, next) {
	res.render('index');

});

/*router.get('/', function(req, res, next) {
 res.render('view');
 });
 */

router.post('/text', function(req, res, next) {

	var jquery = {
		title : req.body.cluster_title,
	};
	var paramss = {
		cluster_id : 'sc8624291e_d97e_46c3_bb65_f2c6f49d3bf9',
		collection_name : 'Demo_coll',
		wt : 'json'
	};
	var values = {};
	
	solrClient = retrieve_and_rank.createSolrClient(paramss);
	console.log('Searching all documents.');
	var query = solrClient.createQuery();

	query.q({

		'body' : jquery.title
	});
	var join=new CronJob('*/10 * * * * *', function() {
		var index = 0;
		var xhr = new XMLHttpRequest();
		xhr.open('get', 'http://diagnosisjp.mybluemix.net/api/vibration', false);
		xhr.send();
		var return_data = JSON.parse(xhr.responseText);
		console.log(return_data);
		console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$    ' + return_data['status']);
		console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$      ' + return_data['Vibration']);
		if (return_data['Vibration'] === true) {
			/*1添加API
			 2.添加判断 API是否出现异常
			 * */
			
			solrClient.search(query, function(err, searchResponse) {
				if (err) {
					console.log('Error searching for documents: ' + err);
				} else {
					console.log('Found ' + searchResponse.response.numFound + ' documents.');
					console.log('First document: ' + JSON.stringify(searchResponse.response.docs[0].title, null, 2));
					console.log(jquery.title);
					var values = {
						name : searchResponse.response.docs[0].title,
						value : searchResponse.response.docs[0].body
					};
					console.log('First document: ' + JSON.stringify(searchResponse.response.docs[0].body, null, 2));
					res.render('text', {
						doc : values
					});
				}
			});
		} else {
			console.log('-----------------' + index++);
			console.log('not Document......');
			//res.send(return_data);
			//join.start();
		}

	}, null, true, 'America/Los_Angeles');

});

router.post('/alert', function(req, res, next) {
	var index = 0;
	var jquery = {
		title : req.body.cluster_title,
		body : req.body.cluster_body
	};
	console.log(jquery.title + '----' + jquery.body);
	var paramss = {
		cluster_id : 'sc8624291e_d97e_46c3_bb65_f2c6f49d3bf9',
		collection_name : 'Demo_coll',
		wt : 'json'
	};

	var doc = {
		id : index,
		author : 'brenckman,m.',
		bibliography : 'j. ae. scs. 25, 1958, 324.',
		body : jquery.body,
		title : jquery.title
	};
	solrClient = retrieve_and_rank.createSolrClient(paramss);
	console.log('Indexing a document...');
	solrClient.add(doc, function(err, response) {
		if (err) {
			console.log('Error indexing document: ', err);
		} else {

			console.log('Indexed a document.');
			solrClient.commit(function(err) {
				if (err) {
					console.log('error', err);
				} else {
					index++;
					console.log('Successfully committed changes.');
					console.log('-------------' + response);
					var alertto = {
						name : '上传成功',
						value : '谢谢'
					};
					res.render('alert', {
						doc : alertto
					});

				}
			});
		}

	});

});
module.exports = router;
