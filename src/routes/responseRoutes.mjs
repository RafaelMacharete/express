import express from "express";
import { prisma } from "../prismaClient.mjs";
import { authenticateToken } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

// Criar respostas para uma sessão
router.post("/:sessionId", authenticateToken, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { responses } = req.body;

        // Verifica se a sessão pertence ao usuário
        const session = await prisma.session.findUnique({ where: { id: sessionId } });
        if (!session || session.userId !== req.user.id)
            return res.status(404).json({ error: "Session not found" });

        // responses deve ser um array [{ question, answer }]
        if (!Array.isArray(responses))
            return res.status(400).json({ error: "Responses must be an array" });

        const created = await prisma.$transaction(
            responses.map(r =>
                prisma.response.create({
                    data: {
                        question: r.question,
                        answer: r.answer,
                        sessionId,
                    },
                })
            )
        );

        res.status(201).json(created);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Atualizar uma resposta específica
router.put("/:responseId", authenticateToken, async (req, res) => {
    try {
        const { responseId } = req.params;
        const { answer } = req.body;

        const response = await prisma.response.findUnique({
            where: { id: responseId },
            include: { session: true },
        });

        if (!response || response.session.userId !== req.user.id)
            return res.status(404).json({ error: "Response not found" });

        const updated = await prisma.response.update({
            where: { id: responseId },
            data: { answer },
        });

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
