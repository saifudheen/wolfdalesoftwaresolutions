var express = require('express');
var morgan = require('morgan');
var path = require('path');


var http = require('http');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 8080)
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(app.router);
    app.use(express.static(__dirname + "/client"));
});

// http.createServer(app).listen(app.get('port'), function() {
//     console.log("Express server listening on port " + app.get('port'));
// });
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/demo', function (req, res) {
    
    
                 console.log('error fetching add item: ');
                res.end( '[{ "RESULT" : "0"}]');
}); 
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
