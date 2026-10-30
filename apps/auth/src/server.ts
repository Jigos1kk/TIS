import express from "express"
import cors from "cors";
import routes from "./routes";

import { env } from "./config/env";

const server = express();
const port = env.port;

server.use(express.json())

server.use(cors({
    origin: "*",
    credentials: false
}))

server.use("/", routes)

export const initServer = () : void  => {
    server.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    })
}