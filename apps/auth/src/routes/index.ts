import { Router } from "express";
import systemRoutes from "./system.route.js";
import oidcRoutes from "./oidc.route.js";
import authRoutes from "./auth.route.js";

const routes = Router();

routes.use("/", systemRoutes);
routes.use("/auth", authRoutes);
routes.use("/oauth", oidcRoutes);

export default routes;