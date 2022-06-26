import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {
        const { playerBNumber } = req.body;
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({
                error: "Missing Authorization header"
            });
            return;
        }
        const [, publicKey, gameID] = authorization.split(" ");
        if (!publicKey || !gameID) {
            res.status(400).json({
                error: "Missing publicKey or gameID"
            });
            return;
        }
        if (!playerBNumber) {
            res.status(400).json({
                error: "Missing required fields"
            });
            return;
        }

        const game = await prisma.games.update({
            where: {
                id: parseInt(gameID),
            },
            data: {
                player_b_number: playerBNumber,
            }
        })

        res.status(200).json(game);
    }
}