import dotenv from 'dotenv';
import cors from 'cors';
import { Router } from "express";
import usersRouter from './users.mjs';
import productsRouter from './products.mjs';
import eventsRouter from './events.mjs';

import responseRoutes from './responseRoutes.mjs';
import sessionRoutes from './sessionRoutes.mjs';
import authRoutes from './authRoutes.mjs';

dotenv.config();

const router = Router();
router.use(cors());


router.use(usersRouter);
router.use(productsRouter);
router.use(eventsRouter);
router.use("/api/auth", authRoutes);
router.use("/api/sessions", sessionRoutes);
router.use("/api/responses", responseRoutes);




export default router;