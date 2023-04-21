import { MongoClient, Db as MongoDb } from "mongodb";

const uri = process.env.MONGODB_URL || "mongodb://localhost:27017/";
const client = new MongoClient("mongodb://127.0.0.1:27017/");

export const getDb = () => {
    return client.db("books");
};

export const getCollection = (name: string) => { 
    const db = getDb();
    return db.collection(name);
};

export const disconnectDb = () => {
    client.close();
};

