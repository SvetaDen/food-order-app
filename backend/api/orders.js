import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://svetaden:1234@food-app.vbuts.mongodb.net";
const client = new MongoClient(uri);
let ordersCollection;

async function connectDB() {
    if (!ordersCollection) {
        await client.connect();
        const database = client.db("food-app");
        ordersCollection = database.collection("orders");
    }
}

export default async (req, res) => {
    await connectDB();
    if (req.method === 'POST') {
        try {
            const orderData = req.body.order;
            if (!orderData || !orderData.items || orderData.items.length === 0) {
                return res.status(400).json({ message: 'Missing data: Order items are required.' });
            }
            if (!orderData.customer.email.includes('@') || orderData.customer.name.trim() === '' ||
                orderData.customer.street.trim() === '' || orderData.customer['postal-code'].trim() === '' ||
                orderData.customer.city.trim() === '') {
                return res.status(400).json({
                    message: 'Missing data: Email, name, street, postal code, or city is missing.',
                });
            }

            const result = await ordersCollection.insertOne(orderData);
            res.status(201).json({ message: 'Order created!', orderId: result.insertedId });
        } catch (e) {
            console.error("Error creating order:", e);
            res.status(500).json({ message: "Failed to create order due to an internal error" });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
};
