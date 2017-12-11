// server.js

// init project
var https = require('https');
var mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();


app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/search/:query', (req, res) => {
  var page = req.query.offset || 1;
  if(page > 10)
    res.send("Invalid page");
  var start = (page - 1) * 10 + 1;
  var query = encodeURIComponent(req.params.query);
  var url = '/customsearch/v1?q=' + query + '&cx=' + process.env.CSE_ID + '&searchType=image&start=' + start + '&key=' + process.env.API_KEY;
  var options = {
    hostname: 'www.googleapis.com',
    path: url,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
  };
  
  // make request to google custom search API
  const request = https.request(options, (response) => {
    var output = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      output += chunk;
    });
    response.on('end', () => {
      var obj = JSON.parse(output);
      var result = obj.items.map(item => {
        return {
          url: item.link,
          snippet: item.snippet,
          page: item.image.contextLink 
        };
      });
      
      mongo.connect(process.env.MLAB_URI, (err, db) => {
        if(err)
          throw err;
        db.collection('recent-search').insertOne({searchString: req.params.query, when: new Date()})
          .then(db.close());
      });
      // send json
      res.set('Content-Type', 'application/json');
      res.send(result);
    });
  });
  request.on('error', (err) => {
      throw err;
  });
  request.end();
});

app.get('/recent', (req, res) => {
  // mongo db top 10 recent search
  mongo.connect(process.env.MLAB_URI, (err, db) => {
    if(err)
      throw err;
    db.collection('recent-search').aggregate([
      {$sort: {when: -1}},
      {$limit: 10},
      {$project: {_id: 0}}
    ], (err, result) => {
      db.close();
      res.send(result);
    });
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
