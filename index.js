const express = require('express');
const app = express();
require('dotenv').config()

const cors=require('cors')
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

const ObjectId = require('mongodb').ObjectId;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7poyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log('conncet')
      const database = client.db('watch-vally');
      const productCollection = database.collection('products');
      const orderProductCollection = database.collection('addOrders')
      const usersCollection = database.collection('users');
      const ratingCollection = database.collection('ratings');
  // GET API SERVICES DATA__
  app.get('/products', async(req, res)=> {
    const cursor = productCollection.find({});
    const products = await cursor.toArray();
    res.send(products)
})
  app.get('/ratings', async(req, res)=> {
    const cursor = ratingCollection.find({});
    const ratings = await cursor.toArray();
    res.send(ratings)
})
app.get('/addOrders', async(req, res)=> {
    const cursor = orderProductCollection.find({});
    const orderProduct = await cursor.toArray();
    res.send(orderProduct)
})
// GET API EVERY SINGLE SERVICE of SERVICES __






// POST API SERVICES DATA__
app.post('/products', async(req, res)=> {
    const product = req.body;
    const result = await productCollection.insertOne(product);
    res.json(result);
    
})
app.post('/ratings', async(req, res)=> {
    const rating = req.body;
    const result = await ratingCollection.insertOne(rating);
    res.json(result);
    
})

app.delete('/products/:id', async(req, res)=>{
    const id =req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await productCollection.deleteOne(query)
    res.json(result)

})

// Add ORDER SERVICE POST
app.post('/addOrders', async (req, res)=> {
    const order = req.body;
   const result = await orderProductCollection.insertOne(order);
   console.log(result);
})
// delete
app.delete('/addOrders/:id', async(req, res)=>{
    const id =req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await orderProductCollection.deleteOne(query)
    res.json(result)

})

// update
app.put('/addOrders/:id', async(req, res)=>{
const id = req.params.id;
const query={_id: ObjectId(id)}
const option ={unset:true};
const updateDoc={
    $set : {
        status:'shipped'

    },
};
const result = await orderProductCollection.updateOne(query,updateDoc,option)
res.json(result)

});

app.post('/users', async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    // console.log(result);
    res.json(result);
});

app.get('/users/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let isAdmin = false;
    if (user?.role === 'admin') {
        isAdmin = true;
    }
    res.json({ admin: isAdmin });
})

app.put('/users/admin', async(req, res)=>{
    const user=req.body;
    // console.log('put',user);
    const filter={email:user.email};
    const updateDoc ={$set: {role: 'admin'}};
const result= await usersCollection.updateOne(filter,updateDoc)
req.send(result)
    })

}

 finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('My CURD server')
});
app.listen(port,()=>{
    console.log('server running',port)
});