const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

mongoose.connect('mongodb+srv:',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(client => {
    console.log('connected to db')
    server.listen(port);
})
.catch(error => console.log(error));

