import { Router } from "express"
import systemRoutes from "./system.route"
import oidcRoutes from "./oidc.route"
import router from "./oidc.route.js";


const routes = Router();

routes.use("/", systemRoutes)
routes.use("/oauth", oidcRoutes)

export default routes;