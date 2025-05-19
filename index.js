const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port =process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =`mongodb+srv://${process.env.SHOP_USER}:${process.env.SHOP_PASS}@trmcamp0.7libfgs.mongodb.net/?retryWrites=true&w=majority&appName=trmcamp0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCllection = client.db('productdb').collection('products')

    // get all data 
    app.get('/products',async(req,res)=>{
        const result = await productCllection.find().toArray();
        res.send(result)
    })
    //get all data 
    app.get('/products/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await productCllection.findOne(query)
        res.send(result)
    })

    // server data add 
    app.post('/products',async(req,res)=>{
         const newProduct = req.body
         const result = await productCllection.insertOne(newProduct);
         res.send(result)
        })

        //edit data 
        app.put('/products/:id', async(req,res)=>{
            const id = req.params.id;
            const filter = { _id: new ObjectId(id)}
            const options = { upsert: true };
            const updatedData = req.body;
            const updatedDoc ={
                $set:updatedData
            }
            const result = await productCllection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        // server data delet 
    app.delete('/products/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCllection.deleteOne(query)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
