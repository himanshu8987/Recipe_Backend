import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { UserModel } from "../models/Users.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config();
const router = express.Router();

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });
  
  async function sendEmail(to,subject,text){
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER, 
        to: to,
        subject: subject,
        html: text, 
      });
      console.log("Email sent successfully");
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;

    const user = await UserModel.findOne({ username });
    //check if users exists or not
    if (user) {
        return res.json({ message: "User already exists" });
    }
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({ username, password: hashedPassword, email });
    await newUser.save();

    const subject = "Welcome to Recipe-Hub";
    const text = `<h2>You have successfully registered to your Recipe-Hub. Enjoy exploring!!</h2>
    <p>This is an online web application where you can see a variety of dishes.</p>`;
    await sendEmail(email, subject, text);

    res.json({ message: "User successfully registered" });
});


// routing of login------------
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) {
        return res.json({ message: "User doesn't exists" });
    }
    //if it is valid its comes true and if not valid then comes false
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.json({ message: "User or password is incorrect" });
    }
    const token = jwt.sign({ id: user._id || null }, "secret");
    res.json({ message: "Login success", token, userID: user._id || null });

});


export { router as userRouter }

