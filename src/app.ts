import express ,{ Application, Request, Response, Router } from "express";
import cors from "cors"
import router from "./app/routes/route";
import globalerrorhandler from "./app/middleware/globalerror";
import cookieParser from "cookie-parser";


const app: Application = express()

app.use(express.json()) 
app.use(cookieParser());

app.use(cors({
    origin: "https://tecvibe-frontend-lhh3.vercel.app",
    credentials: true
}))

app.use("/api/v1", router)

app.get("/", (req: Request , res: Response) => {
    res.send({message: "this is tecvibe wevsite"})
})


app.use(globalerrorhandler)

export default app