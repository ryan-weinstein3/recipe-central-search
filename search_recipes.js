var http = require('http');
var url = require('url');
const MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
let db_url = "mongodb+srv://Jaysonpit:Giamo@cluster0.jfe6e.mongodb.net/Finaldb?retryWrites=true&w=majority"

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.get('/', (req, res)=>{ 
	res.render('Home'); 
}); 

app.get('/About', (req, res)=>{ 
	res.render('About'); 
}); 

app.get('/BlogChickenRecipes', (req, res)=>{ 
	res.render('BlogChickenRecipes'); 
}); 

app.get('/BlogHealthyRecipes', (req, res)=>{ 
	res.render('BlogHealthyRecipes'); 
}); 

app.get('/BlogHolidayRecipes', (req, res)=>{ 
	res.render('BlogHolidayRecipes'); 
}); 

app.get('/BlogPastaRecipes', (req, res)=>{ 
	res.render('BlogPastaRecipes'); 
}); 

app.get('/BlogWinterRecipes', (req, res)=>{ 
	res.render('BlogWinterRecipes'); 
}); 

app.get('/Blogs', (req, res)=>{ 
	res.render('Blogs'); 
}); 

app.get('/SubmitRecipe', (req, res)=>{ 
	res.render('SubmitRecipe'); 
}); 

app.get('/Recipes', (req, res)=>{ 
    MongoClient.connect(db_url, {useUnifiedTopology: true}, async function(err, db) {
	    try {
		    if(err) { return console.log(err); }
		    var dbo = db.db("Finaldb");
			var collection = dbo.collection('Recipes');
			var query = {};

			await collection.find(query, {projection: {strMeal: 1, strInstructions: 1, strMealThumb: 1}}).toArray(function (err, result) {
				if (err) throw err;
				console.log(result);
				var data = "";
				for (var i = 0; i < result.length; i++){
                    			data += "<h3>" + result[i].strMeal + "</h3>" + result[i].strInstructions + "<br /><br />";
                		}
				data = data.replace(/\r\n/g, "<br/>");
				res.render('Recipes', {data:data});
			})
			await db.close();
			await res.end();
		}
		catch(err) {
			console.log(err);
		}
 
	});
}); 

app.get('/SearchResults', (req, res)=>{ 
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
				var data = "";
				for (var i = 0; i < result.length; i++){
                    			data += "<h3>" + result[i].strMeal + "</h3>" + result[i].strInstructions + "<br /><br />";
                		}
				data = data.replace(/\r\n/g, "<br/>");
				res.render('SearchResults', {data:data});
			})
			await db.close();
			await res.end();
		}
		catch(err) {
			console.log(err);
		}
 
	});
}); 

var server = app.listen((process.env.PORT || 3000), function() { 
    console.log('listening to port'); 
}); 
