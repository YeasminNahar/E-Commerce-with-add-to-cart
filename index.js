const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var formidable = require('formidable');
var https = require('https');
fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use('/files', express.static('files'));
app.get('/images/Graphicloads-100-Flat-2-Chat-2.ico', (req, res) => {
    res.sendFile(__dirname + '/images/Graphicloads-100-Flat-2-Chat-2.ico');
});
app.get('/js/jquery-3.4.1.min.js', (req, res) => {
    res.sendFile(__dirname + '/js/jquery-3.4.1.min.js');
});
app.get('/js/e-commerce.js', (req, res) => {
    res.sendFile(__dirname + '/js/e-commerce.js');
});
app.get('/', function(request, response){
    response.sendFile(__dirname+'/index.html');
});

app.get('/home', function(request, response){
    response.sendFile(__dirname+'/index.html');
});
app.get('/product', function(request, response){
    response.sendFile(__dirname+'/product.html');
});
app.get('/payment', (req, res) => {
    res.sendFile(__dirname + '/public/payment.html');
});

app.get('/cart', function(request, response){
    response.sendFile(__dirname+'/cart.html');
});
http.listen(5000, () => {
    console.log('listening on *:5000');
});
const uri = "mongodb+srv://yeasmin6364:Uv2WSpRRz1WeUN54@cluster0.awwbj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log(uri);
async function run() {
    const client = new MongoClient(uri);
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    await client.close();
  }
}
async function getProducts() {
    const client = new MongoClient(uri);
    try {
        const database = client.db('resturentdb');
        const products = database.collection('Menuitem');
        console.log(products);
        return await products.find().toArray();
    } finally {
        await client.close();
    }
}
async function getProduct(_code) {
    const client = new MongoClient(uri);
    try {
        const database = client.db('resturentdb');
        const products = database.collection('Menuitem');
        const query = { code: _code };
        return await products.findOne(query);
    } finally {
        await client.close();
    }
}
async function addSalesOrder(data) {
    const client = new MongoClient(uri);
    try {
        const database = client.db('resturentdb');
        const SalesOrders = database.collection('SalesOrder');
        let docs =[];
        console.log(data);
        for(var i =0; i < data.products.length; i++){
            docs.push({
                customer: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                code: data.products[i].code,
                price: data.products[i].price,
                qty: data.products[i].qty,
                total:data.products[i].total,
                date: new Date()
            });
        }
        const options = { ordered: true };
        const result = await SalesOrders.insertMany(docs, options);
        return await client.close();
    } finally {
        await client.close();
    }
}
async function addProductOrder(data) {
    const client = new MongoClient(uri);
    try {
        const database = client.db('resturentdb');
        const products = database.collection('Menuitem');
        let doc = {
            code: data.code,
            name: data.name,
            price: data.price,
            path:data.path
        };
        const result = await products.insertOne(doc);
        console.log("Inserted product:", result.insertedId);
    } finally {
        await client.close();
    }
}
app.get('/api/product', (req, res) => {
    try {
        getProduct(req.query.code).then(function(result) {
            console.log('/api/product');
            res.send(result);
         });
    } finally {
    }
});
app.get('/api/products', (req, res) => {
    try {
        getProducts().then(function(result) {
            console.log('/api/products');
            res.send(result);
         });
    } finally {
    }
});
app.post('/api/createsales', function (req, res){
    try {
        addSalesOrder(req.body).then(function(result) {
            console.log('/api/createsales');
            res.sendStatus(200);
         });
    } finally {
    }
});
app.post('/api/createproduct', function (req, res){
    try {
        addProductOrder(req.body).then(function(result) {
            console.log('/api/createproduct');
            res.sendStatus(200);
         });
    } finally {
    }
});
app.post('/uploadfile', function (req, res){
    var strFilePath = '';
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/files/' + file.name;
    });
    form.on('file', function (name, file){
        strFilePath = '/files/' + file.name;
        res.send(JSON.stringify({"filePath":strFilePath,"fileName":file.name}));
    });
});


