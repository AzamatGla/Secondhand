const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

mongoose.connect('mongodb+srv://azamat:zapashna12@cluster0-vsws3.mongodb.net/restful?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(client => {
    console.log('connected to db')
    server.listen(port);
})
.catch(error => console.log(error));

