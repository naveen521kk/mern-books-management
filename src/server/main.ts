import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import cors from "cors";
import { getCollection } from "./db/conn";
import { ObjectId } from "mongodb";
import {
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";

const PORT = (process.env.PORT || 3000) as number;

const app = express();

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

app.use(cors());
app.use(express.json());

// api to get all books titles
app.get("/api/book-titles", async (_, res) => {
  const collection = getCollection("book");
  const db_res = await collection
    .find(
      {},
      {
        projection: {
          title: 1,
        },
      }
    )
    .sort({ title: 1 })
    .toArray();
  if (db_res) {
    res.send(db_res);
  } else {
    res.send({ error: "No data found" });
  }
});

// api to get all books
app.get("/api/books", async (_, res) => {
  const collection = getCollection("book");
  const db_res = await collection.find({}).sort({ title: 1 }).toArray();
  if (db_res) {
    res.send(db_res);
  } else {
    res.send({ error: "No data found" });
  }
});

// api to get a book by id
app.get("/api/books/:id", async (req, res) => {
  const collection = getCollection("book");
  let id;
  try {
    id = new ObjectId(req.params.id);
  } catch (err) {
    res.status(400).send({ error: "Invalid id" });
    return;
  }
  try {
    const db_res = await collection.findOne({ _id: id });
    if (db_res) {
      res.send(db_res);
    } else {
      res.status(404).send({ error: "No data found" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
});

// api to delete a book by id
app.delete("/api/books/:id", ClerkExpressWithAuth(), async (req, res) => {
  if (!req.auth.userId) {
    res
      .status(401)
      .send({
        error:
          "Unauthorized, please login using the sign-in button to continue!",
      });
    return;
  }
  const collection = getCollection("book");
  let id;
  try {
    id = new ObjectId(req.params.id);
  } catch (err) {
    res.status(400).send({ error: "Invalid id" });
    return;
  }
  try {
    const db_res = await collection.deleteOne({ _id: id });
    res.send(db_res);
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
});

// api to create a book
app.post("/api/books", ClerkExpressWithAuth(), async (req, res) => {
  if (!req.auth.userId) {
    res
      .status(401)
      .send({
        error:
          "Unauthorized, please login using the sign-in button to continue!",
      });
    return;
  }
  const collection = getCollection("book");
  // make sure the request body is valid
  // also check for the type of fields, title is string,
  // authors is string and thumbnail is string
  if (
    !req.body.title ||
    typeof req.body.title !== "string" ||
    !req.body.authors ||
    typeof req.body.authors !== "string" ||
    !req.body.thumbnail ||
    typeof req.body.thumbnail !== "string"
  ) {
    res.status(400).send("Invalid request body");
    return;
  }

  const to_insert = {
    title: req.body.title,
    authors: req.body.authors,
    thumbnail: req.body.thumbnail,
  };
  try {
    const db_res = await collection.insertOne(to_insert);
    res.send(db_res);
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
});

// api to search books
app.get("/api/search", async (req, res) => {
  const collection = getCollection("book");
  const query = req.query.q as string;
  if (!query) {
    res.status(400).send({ error: "Invalid query" });
    return;
  }
  try {
    const db_res = await collection
      .find({ $text: { $search: query } })
      .sort({ title: 1 })
      .toArray();
    res.send(db_res);
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
});

ViteExpress.listen(app, PORT, () =>
  console.log("Server is listening on port 80...")
);
