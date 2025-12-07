import express ,{ Application, Request, Response, Router } from "express";
import cors from "cors"
import router from "./app/routes/route";
import globalerrorhandler from "./app/middleware/globalerror";

const app: Application = express()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json()) 

app.use("/api/v1", router)

app.get("/", (req: Request , res: Response) => {
    res.send({message: "this is tecvibe wevsite"})
})


app.use(globalerrorhandler)

export default app