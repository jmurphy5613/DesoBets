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
        const [, publicKey] = authorization.split(" ");
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
    else {
        res.status(405).json({
            error: "Method not allowed"
        });
    }
};