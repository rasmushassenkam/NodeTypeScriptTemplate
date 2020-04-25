import express, {Application, Request, Response, NextFunction} from "express";
import bodyParser from "body-parser";
import { TemplateRoutes } from "./routes/api/template";

const app: Application = express();

// Bodyparser middleware
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello world");
});

app.use("/api/template", TemplateRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));