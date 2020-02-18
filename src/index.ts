import * as express from 'express';

const app = express();
app.get('/', function(req, res) {
    res.end('Hello world!');
});

app.listen(3000, function() {
    console.log('listening on *:3000');
});