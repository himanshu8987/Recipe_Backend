import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { UserModel } from "../models/Users.js";

const router = express.Router()

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    //check if users exists or not
    if (user) {
        return res.json({ message: "User already exists" });
    }
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User successfully registered" });
});


//routing of login------------
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

});

export { router as userRouter }
