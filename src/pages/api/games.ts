import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "GET") {
        const publicKey = req.query.publicKey as string;
        if (!publicKey) {
            res.status(400).json({
                error: "Missing publicKey"
            });
            return;
        }
        const games = await prisma.games.findMany({
            where: {
                OR: [
                    {
                        player_a_key: {
                            equals: publicKey
                        }
                    },
                    {
                        player_b_key: {
                            equals: publicKey
                        }
                    }
                ]
            }
        })
        res.status(200).json(games);
    }
};