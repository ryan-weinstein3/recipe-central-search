var http = require('http');
var url = require('url');
const MongoClient = require('mongodb').MongoClient;
var express = require('express');

var port = process.env.PORT || 3000;
let db_url = "mongodb+srv://Jaysonpit:Giamo@cluster0.jfe6e.mongodb.net/Finaldb?retryWrites=true&w=majority"

app.use(express.static('public'));

http.createServer(function (req, res) {
	res.writeHead(200, {
    		'Content-Type': 'text/html'});
	res.write("<h1>Query Result</h1>");
	var qobj = url.parse(req.url, true).query;
	var query_string = qobj.query;

    MongoClient.connect(db_url, {useUnifiedTopology: true}, async function(err, db) {
	    try {
		    if(err) { return console.log(err); }
		    var dbo = db.db("Finaldb");
			var collection = dbo.collection('Recipes');
			var query = {strMeal: query_string};

			await collection.find(query, {projection: {strMeal: 1, strInstructions: 1}}).toArray(function (err, result) {
				if (err) throw err;
				var result_str = JSON.stringify(result, null, 2);
				res.write(result_str);
			})
			await db.close();
			await res.end();
		}
		catch(err) {
			console.log(err);
		}
 
	});
}).listen(port);
