var http = require('http');
var url = require('url');
const MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
let db_url = "mongodb+srv://Jaysonpit:Giamo@cluster0.jfe6e.mongodb.net/Finaldb?retryWrites=true&w=majority"

app.get('/', (req, res)=>{ 
res.render('home'); 
}); 

var server = app.listen((process.env.PORT || 3000), function() { 
    console.log('listening to port'); 
}); 


