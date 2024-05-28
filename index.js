import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"


import { userRouter } from './src/routes/users.js'
import { recipesRouter } from './src/routes/recipes.js'

dotenv.config();
const app = express();

//middlwares 
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend Api Working");
});

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);


const connect = async () => {
  try {
    await mongoose.connect(process.env.MongoURL);
    console.log("Connected To MongoDB.");
  } catch (error) {
    throw error;
  }
};
connect();


app.listen(8000, () => {
  console.log("SERVER STARTED")
})


