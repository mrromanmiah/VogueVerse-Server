const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.jjwufqp.mongodb.net/?retryWrites=true&w=majority`;

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
        
        

        const productCollection = client.db('vogueVerseDB').collection('products');
        const cartCollection = client.db('vogueVerseDB').collection('cart');


        app.get('/products/:brandName', async (req, res) => {
            const brandName = req.params.brandName || '';
            const query = {brandName: brandName};
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id || '';
            const query = {_id: new ObjectId(id)};
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.get('/updateProduct/:id', async (req, res) => {
            const id = req.params.id || '';
            const query = {_id: new ObjectId(id)};
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        app.put('/updateProduct/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const updatedProduct = req.body;
            const updateProduct = {
                $set: {
                    productImage: updatedProduct.productImage, 
                    productName : updatedProduct.productName, 
                    brandName : updatedProduct.brandName, 
                    productType : updatedProduct.productType, 
                    price : updatedProduct.price, 
                    rating : updatedProduct.rating, 
                    description : updatedProduct.description
                }
            }
            const result = await productCollection.updateOne(filter, updateProduct, options);
            res.send(result);
        })

        app.post('/cart', async (req, res) => {
            const cart = req.body;
            const result = await cartCollection.insertOne(cart);
            res.send(result);
        }) 

        app.get('/cart/:email', async (req, res) => {
            const email = req.params.email || '';
            const query = {userEmail: email};
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await cartCollection.deleteOne(query);
            res.send(result); 
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
    res.send('vogue server is running');
});

app.listen(port, () => {
    console.log(`vogue server is listening on port: ${port}`);
});