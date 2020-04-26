import express, {Application, Request, Response, NextFunction} from "express";
import bodyParser from "body-parser";
import { TemplateRoutes } from "./routes/api/template";
import { constants } from "./config/constants";
import mongoose from "mongoose";
import { AuthRoutes } from "./routes/api/auth";


const app: Application = express();

// Bodyparser middleware
app.use(bodyParser.json());

app.listen(constants.PORT, () => {
    mongoose.connect(constants.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.log(err);
});

db.once("open", () => {
    //Routes
    app.use("/api/template", TemplateRoutes);
    app.use("/api/auth", AuthRoutes);
});