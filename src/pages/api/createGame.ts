import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {
        const { playerAKey, playerBKey, gameState } = req.body;
        if (!playerAKey || !playerBKey || !gameState) {
            res.status(400).json({
                error: "Missing required fields"
            });
            return;
        }
        const game = await prisma.games.create({
            data: {
                player_a_key: playerAKey,
                player_b_key: playerBKey,
                gameState: gameState,
                is_playing: true,
                player_a_move: false,
            }
        })
        res.status(200).json(game);
    }
}