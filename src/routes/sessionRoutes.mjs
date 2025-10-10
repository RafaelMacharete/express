import express from "express";
import { prisma } from "../prismaClient.mjs";
import { authenticateToken } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

// Criar sessão
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });

        const session = await prisma.session.create({
            data: {
                title,
                userId: req.user.id,
            },
        });

        res.status(201).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Listar todas as sessões do usuário logado
router.get("/", authenticateToken, async (req, res) => {
    try {
        const sessions = await prisma.session.findMany({
            where: { userId: req.user.id },
            include: { responses: true },
            orderBy: { createdAt: "desc" },
        });

        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Buscar sessão específica com respostas
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const session = await prisma.session.findUnique({
            where: { id: req.params.id },
            include: { responses: true },
        });

        if (!session || session.userId !== req.user.id)
            return res.status(404).json({ error: "Session not found" });

        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
