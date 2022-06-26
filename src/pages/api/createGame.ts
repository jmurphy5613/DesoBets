import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {
        const { playerAKey, playerBKey, gameType, playerAName, playerBName, playerANumber } = req.body;
        if (!playerAKey || !playerBKey || !gameType || !playerAName || !playerBName || !playerANumber) {
            res.status(400).json({
                error: "Missing required fields"
            });
            return;
        }
        let gameState = null;
        switch (gameType) {
            case "ttt":
                gameState = {
                    type: "ttt",
                    board: [
                        ["", "", ""],
                        ["", "", ""],
                        ["", "", ""]
                    ],
                    turn: 0

                }
        }
        const game = await prisma.games.create({
            //@ts-ignore
            data: {
                player_a_key: playerAKey,
                player_b_key: playerBKey,
                gameState: gameState,
                is_playing: true,
                player_a_move: false,
                player_a_name: playerAName,
                player_b_name: playerBName,
                player_a_number: playerANumber
            }
        })
        res.status(200).json(game);
    }
}