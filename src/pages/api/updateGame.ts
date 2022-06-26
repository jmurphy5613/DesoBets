import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import twilio from "twilio";

const prisma = new PrismaClient();
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {
        const { gameId, playerKey, board, gameOver } = req.body;
        const game = await prisma.games.findFirst({
            where: {
                AND: [
                    {
                        id: gameId
                    },
                    {
                        OR: [
                            {
                                player_a_key: playerKey
                            },
                            {
                                player_b_key: playerKey
                            }
                        ]
                    }
                ]
            }
        })

        if (!game) {
            res.status(400).json({
                error: "Game not found"
            });
            return;
        }
        if (!gameOver) {
            if (game.player_a_key == playerKey) { // player A's turn
                if (game.player_b_number) {
                    await client.messages.create({
                        body: `${game.player_a_name} has made a move in your game of Tic Tac Toe!`,
                        to: game.player_b_number,
                        messagingServiceSid: process.env.TWILIO_MESSAGER_SID,
                    }).catch((e) => {
                        console.error("Twilio Error", e);
                    })
                }
                game.player_a_move = false;
            }
            if (game.player_b_key == playerKey) { // Player B's turn
                if (game.player_a_number) {
                    await client.messages.create({
                        body: `${game.player_b_name} has made a move in your game of Tic Tac Toe!`,
                        to: game.player_a_number,
                        messagingServiceSid: process.env.TWILIO_MESSAGER_SID,
                    }).catch((e) => {
                        console.error("Twilio Error", e)
                    })
                }
                game.player_a_move = true;
            }
            game.gameState['turn'] = game.gameState['turn'] + 1;
        }
        if (gameOver) {
            game.winner = playerKey;
            if (game.player_a_key == playerKey && game.player_b_number) { // Player A won
                await client.messages.create({
                    body: `${game.player_a_name} has won your game!`,
                    to: game.player_b_number,
                    messagingServiceSid: process.env.TWILIO_MESSAGER_SID,
                }).catch((e) => {
                    console.error("Twilio Error", e)
                })
            }
            if (game.player_b_key == playerKey && game.player_a_number) { // Player B Won
                await client.messages.create({
                    body: `${game.player_b_name} has won your game!`,
                    to: game.player_a_number,
                    messagingServiceSid: process.env.TWILIO_MESSAGER_SID,
                }).catch((e) => {
                    console.error("Twilio Error", e)
                })
            }
        }

        game.gameState['board'] = board;
        await prisma.games.update({
            where: {
                id: gameId
            },
            data: {
                gameState: game.gameState,
                player_a_move: game.player_a_move,
                winner: game.winner
            }
        })
        res.status(200).json(game);
    }
}