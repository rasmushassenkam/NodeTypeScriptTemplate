import express, { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";
import { IResponse } from "../../interfaces/IResponse";
import { EStatusCode } from "../../enums/EStatusCode";
import { constants } from "../../config/constants";

const router = express.Router();

// Register
router.post("/register", async (req: Request, res: Response) => {
    const { name, email, password, password2 } = req.body;

    if (!name || !email || !password || !password2) {
        return res.send(<IResponse>{ response: "All fields needs to be filled", status: EStatusCode.BAD_REQUEST });
    }

    if (password !== password2) {
        return res.send(<IResponse>{ response: "Passwords must match", status: EStatusCode.BAD_REQUEST });
    }

    if (password.length < 6) {
        return res.send(<IResponse>{ response: "Password length must be at least 6", status: EStatusCode.BAD_REQUEST });
    }

    const user = await User.findOne({ email: email });

    if (user) {
        // User exists
        return res.send(<IResponse>{ response: "Email already in use", status: EStatusCode.BAD_REQUEST });
    } else {
        const newUser: any = new User({
            name,
            email,
            password,
        });
        // Hash Password
        bcryptjs.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcryptjs.hash(newUser.password, salt, async (err, hash) => {
                if (err) throw err;
                // Set password to hashed
                newUser.password = hash;
                // Save user
                await newUser.save((err: any) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.send(<IResponse>{ response: newUser, status: EStatusCode.OK });
                });
            });
        });
    }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
        return res.send(<IResponse>{ response: "Email is required", status: EStatusCode.BAD_REQUEST });
    }

    if (!password) {
        return res.send(<IResponse>{ response: "Password is required", status: EStatusCode.BAD_REQUEST });
    }

    const user: any = await User.findOne({ email: email });

    if (user) {
        bcryptjs.compare(password, user.password, (err, response) => {
            if (err) {
                console.log(err);
            }
            if (response) {
                jwt.sign({ id: user._id}, constants.JWT_SECRET, { expiresIn: "12h" }, (err: any, token: any) => {
                    const loginUser = {
                        user,
                        token
                    }
                    return res.send(<IResponse>{ response: loginUser, status: EStatusCode.OK });
                });
            } else {
                return res.send(<IResponse>{ response: "Password or email incorrect", status: EStatusCode.FORBIDDEN });
            }
        });
    } else {
        return res.send(<IResponse>{ response: "Password or email incorrect", status: EStatusCode.FORBIDDEN });
    }

});

export const AuthRoutes = router;