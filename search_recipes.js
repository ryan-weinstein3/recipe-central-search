var nodemailer = require('nodemailer');
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

app.get('/Search', (req, res)=>{
	res.render('Search');
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

app.get('/ThankYou', (req, res)=>{ 
	res.render('ThankYou'); 
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
				var data = "<ul id='recipesfilter'>";
				for (var i = 0; i < result.length; i++){
                    			data += "<li><h4>" + result[i].strMeal + "</h4><img src=" + result[i].strMealThumb + " alt='mealImg' width='300' class='center'><br/><h3>Instructions</h3>" + result[i].strInstructions + "<br /><br /></li>";
                		}
				data += "</ul>";
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
	if (query_string == undefined) {
		res.render('SearchResults', {data:""});
	}
	else {

	    MongoClient.connect(db_url, {useUnifiedTopology: true}, async function(err, db) {
		    try {
			    if(err) { return console.log(err); }
			    var dbo = db.db("Finaldb");
				var collection = dbo.collection('Recipes');
				var query = {strMeal: {$regex: new RegExp('.*' + query_string.toLowerCase() + '.*', 'i')}};

				await collection.find(query, {projection: {strMeal: 1, strInstructions: 1, strMealThumb: 1}}).toArray(function (err, result) {
					if (err) throw err;
					var data = "";
					for (var i = 0; i < result.length; i++){
						data += "<h4>" + result[i].strMeal + "</h4><img src=" + result[i].strMealThumb + " alt='mealImg' width='300' class='center'><br/><h3>Instructions</h3>" + result[i].strInstructions + "<br /><br />";
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
	}
}); 

app.get('/SendEmail', (req, res)=>{
	var qobj = url.parse(req.url, true).query;
	var mailTo = qobj.email; 
	var name = qobj.fname;
	
	var transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
		user: 'recipecent@gmail.com',
		pass: 'RecipeYum123',
		}
	});
	var mailOptions = {
	    from: 'recipecent@gmail.com',
	    to: mailTo,
	    subject: 'Thank you for joining, ' + name + '!',
	    text: name + ', your information has been confirmed. Thank you for joining the Recipe Central community!'
	};
	transporter.sendMail(mailOptions, function(error, info) {
	    if(error){
		console.log(error);
	    } else {
		console.log('Email sent: ' + info.response);
	    }
	});
	res.render('ThankYou');
});

var server = app.listen((process.env.PORT || 3000), function() { 
	console.log("Listening to port");
}); 
