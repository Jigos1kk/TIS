import { Request, Response, Router } from "express"

const router = Router();

const healty = (req: Request, res: Response ) => {
    return res.status(200).send("healthy!")
}

router.get("/health", healty)

export default router