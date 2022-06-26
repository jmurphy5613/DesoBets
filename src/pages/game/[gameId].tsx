import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Deso from "deso-protocol";
import { PrismaClient } from "@prisma/client";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { Game } from "../../types";
import { TicTacToe } from "../../components/TicTacToe/TicTacToe";
import NavBar from "../../components/NavBar";

export default function GamePage() {
    const router = useRouter();
    const [game, setGame] = useState<Game>(null);
    const [loading, setLoading] = useState(true);
    const updateGame = async (key: string) => {
        fetch("/api/getSingleGame", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${key} ${router.query.gameId.toString()}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setGame(data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.status == 404) {
                    router.push("/app");
                }
            });
    };
    useEffect(() => {
        if (!router.query.gameId) {
            return console.log("invalid id");
        }
        const userKey = new Deso().identity.getUserKey();

        if (!userKey) {
            router.push({
                pathname: "/",
                query: {
                    redirectTo: router.pathname,
                    ...router.query,
                },
            });
        } else {
            updateGame(new Deso().identity.getUserKey());
        }
    }, [router]);

    useEffect(() => {
        if (game && !isLoggedUsersTurn()) {
            setTimeout(() => {
                console.log("Updating game");
                updateGame(new Deso().identity.getUserKey());
            }, 1000);
        }
        if (game) {
            updatePhoneNumber();
        }
    }, [game]);

    const isLoggedUsersTurn = () => {
        if (new Deso().identity.getUserKey() == game.player_a_key) {
            return game.player_a_move;
        } else {
            return !game.player_a_move;
        }
    };

    const getOpponentName = () => {
        if (new Deso().identity.getUserKey() == game.player_a_key) {
            return game.player_b_name;
        } else {
            return game.player_a_name;
        }
    };

    const updatePhoneNumber = async () => {
        // check if the current player is player b and they don't have a phone number
        const deso = new Deso();
        try {
            if (
                deso.identity.getUserKey() == game.player_b_key &&
                !game.player_b_number
            ) {
                const playerBJWT = await deso.identity.getJwt().catch((e) => {
                    console.error(e);
                });
                if (!playerBJWT) return;
                const playerBNumber = await fetch(
                    "https://node.deso.org/api/v0/get-user-global-metadata",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            UserPublicKeyBase58Check:
                                deso.identity.getUserKey(),
                            JWT: playerBJWT,
                        }),
                    }
                ).then((res) => res.json());
                if (playerBNumber) {
                    await fetch("/api/updateBNumber", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${new Deso().identity.getUserKey()} ${
                                game.id
                            }`,
                        },
                        body: JSON.stringify({
                            playerBNumber: playerBNumber.PhoneNumber,
                        }),
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) {
        return (
            <Box
                height="100vh"
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDir="column"
                gap={4}
            >
                <Spinner thickness="4px" />
                <Text fontWeight="semibold">Loading your game...</Text>
            </Box>
        );
    }

    switch (game.gameState["type"]) {
        case "ttt":
            return (
                <TicTacToe
                    gameState={game.gameState}
                    userTurn={isLoggedUsersTurn()}
                    opponentName={getOpponentName()}
                    gameId={game.id}
                    game={game}
                    updateGame={updateGame}
                />
            );
    }
}
