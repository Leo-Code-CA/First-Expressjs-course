import { Router} from "express";
import userRouter from "./users.mjs";
import productRouter from "./products.mjs";
import cartRouter from "./cart.mjs";

const router = Router();

router.use(userRouter);
router.use(productRouter);
// router.use(cartRouter);

export default router;