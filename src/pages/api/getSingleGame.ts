import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "GET") {
        // check Authorization header
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
        const game = await prisma.games.findFirst({
            where: {
                AND: [
                    {
                        id: {
                            equals: parseInt(gameID)
                        }
                    },
                    {
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
                ]
            }
        });
        if (!game) {
            res.status(404).json({
                error: "Game not found"
            });
            return;
        }
        res.status(200).json(game);
    }
    else {
        res.status(405).json({
            error: "Method not allowed"
        });
    }
};