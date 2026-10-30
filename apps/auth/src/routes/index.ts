import { Router } from "express"
import systemRoutes from "./system.route"

const routes = Router();

routes.use("/", systemRoutes)

export default routes;