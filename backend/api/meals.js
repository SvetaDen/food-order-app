import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://svetaden:1234@food-app.vbuts.mongodb.net/?retryWrites=true&w=majority&appName=food-app";
const client = new MongoClient(uri);

let mealsCollection;

async function connectDB() {
    if (!mealsCollection) {
        await client.connect();
        console.log("Connected to MongoDB");
        const database = client.db("food-app");
        mealsCollection = database.collection("meals");
    }
}

export default async (req, res) => {
    await connectDB();
    try {
        const meals = await mealsCollection.find({}).toArray();
        res.status(200).json(meals);
    } catch (e) {
        console.error("Error fetching meals:", e);
        res.status(500).json({ message: "Failed to fetch meals" });
    }
};