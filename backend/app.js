import bodyParser from 'body-parser';
import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();

const uri = "mongodb+srv://svetaden:1234@food-app.vbuts.mongodb.net/?retryWrites=true&w=majority&appName=food-app";
const client = new MongoClient(uri);

let mealsCollection;
let ordersCollection;

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const database = client.db("food-app");
        mealsCollection = database.collection("meals");
        ordersCollection = database.collection("orders");
    } catch (e) {
        console.error("Could not connect to MongoDB", e);
        process.exit(1);
    }
}

connectDB();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/meals', async (req, res) => {
    try {
        const meals = await mealsCollection.find({}).toArray();
        res.json(meals);
    } catch (e) {
        console.error("Error fetching meals:", e);
        res.status(500).json({ message: "Failed to fetch meals" });
    }
});

app.post('/orders', async (req, res) => {
    const orderData = req.body.order;

    if (!orderData || !orderData.items || orderData.items.length === 0) {
        return res.status(400).json({ message: 'Missing data: Order items are required.' });
    }

    if (!orderData.customer.email.includes('@') || orderData.customer.name.trim() === ''
        || orderData.customer.street.trim() === ''
        || orderData.customer['postal-code'].trim() === ''
        || orderData.customer.city.trim() === '') {
        return res.status(400).json({
            message: 'Missing data: Email, name, street, postal code, or city is missing.',
        });
    }

    try {
        const result = await ordersCollection.insertOne(orderData);
        res.status(201).json({ message: 'Order created!', orderId: result.insertedId });
    } catch (e) {
        console.error("Error creating order:", e);
        res.status(500).json({ message: "Failed to create order due to an internal error" });
    }
});

app.use((req, res) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    res.status(404).json({ message: 'Not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});
