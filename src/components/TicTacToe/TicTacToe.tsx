import {
    Grid,
    GridItem,
    Container,
    Text,
    Box,
    Spinner,
    Heading,
    useToast,
} from "@chakra-ui/react";
import { Game, TicTacToeGameState } from "../../types";
import Deso from "deso-protocol";
import ticTacToePreview from "../../utils/TicTacToePreview";
import { useEffect, useState } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import Winning from "../Winnning";

type TTTProps = {
    gameState: TicTacToeGameState;
    userTurn: boolean;
    opponentName: string;
    gameId: string;
    game: Game;
    updateGame: (key: string) => Promise<void>;
};

type TileProps = {
    board: string[][];
    x: number;
    y: number;
};

const TTTTile: React.FC<TileProps> = ({ board, x, y }) => {
    const tile = board[x][y];
    const filled = tile != "";
    return (
        <>
            {filled && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100%"
                >
                    {tile == "A" ? (
                        <Heading size="4xl" color="red.600">
                            X
                        </Heading>
                    ) : (
                        <Heading size="4xl" color="gray.600">
                            O
                        </Heading>
                    )}
                </Box>
            )}
        </>
    );
};

export const TicTacToe: React.FC<TTTProps> = ({
    gameState,
    userTurn,
    opponentName,
    gameId,
    game,
    updateGame,
}) => {
    const [loading, setLoading] = useState(null);
    const [winner, setWinner] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (!userTurn) {
            setLoading(`Waiting for ${opponentName} to move...`);
        } else {
            setLoading(false);
        }
    }, [userTurn]);
    const isValidMove = (row: number, column: number) => {};
    const getEmojiArray = (board: Array<Array<string>>) => {
        let newBoard = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] == "") newBoard[row][col] = "⬛";
                else if (board[row][col] == "A") newBoard[row][col] = "❌";
                else if (board[row][col] == "B") newBoard[row][col] = "⚪";
            }
        }
        return newBoard;
    };

    const checkForWinner = (turn: string) => {
        if (
            game.gameState.board[0][0] == turn &&
            game.gameState.board[0][1] == turn &&
            game.gameState.board[0][2] == turn
        )
            return true;
        else if (
            game.gameState.board[1][0] == turn &&
            game.gameState.board[1][1] == turn &&
            game.gameState.board[1][2] == turn
        )
            return true;
        else if (
            game.gameState.board[2][0] == turn &&
            game.gameState.board[2][1] == turn &&
            game.gameState.board[2][2] == turn
        )
            return true;
        else if (
            game.gameState.board[0][0] == turn &&
            game.gameState.board[1][0] == turn &&
            game.gameState.board[2][0] == turn
        )
            return true;
        else if (
            game.gameState.board[0][1] == turn &&
            game.gameState.board[1][1] == turn &&
            game.gameState.board[2][1] == turn
        )
            return true;
        else if (
            game.gameState.board[0][2] == turn &&
            game.gameState.board[1][2] == turn &&
            game.gameState.board[2][2] == turn
        )
            return true;
        else if (
            game.gameState.board[0][0] == turn &&
            game.gameState.board[1][1] == turn &&
            game.gameState.board[2][2] == turn
        )
            return true;
        else if (
            game.gameState.board[2][0] == turn &&
            game.gameState.board[1][1] == turn &&
            game.gameState.board[2][0] == turn
        )
            return true;
        return false;
    };

    const handleMove = async (row: number, column: number) => {
        let newBoard = gameState.board;

        if (newBoard[row][column] != "") return;

        let won = false;

        if (new Deso().identity.getUserKey() == game.player_a_key) {
            newBoard[row][column] = "A";
            won = checkForWinner("A");
        } else {
            newBoard[row][column] = "B";
            won = checkForWinner("B");
        }

        //update board on the server
        const newGame = await fetch("/api/updateGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameId: gameId,
                playerKey: new Deso().identity.getUserKey(),
                board: newBoard,
                gameOver: won,
            }),
        }).then((res) => {
            toast({
                title: "Sent your move!",
                icon: <CheckIcon />,
                status: "success",
            });
            return res.json();
        });

        //check if there is a winner
        if (won) {
            setWinner(true);
            return;
        }

        setLoading("Sending your move...");

        const postResponse = await new Deso().posts
            .submitPost({
                UpdaterPublicKeyBase58Check: new Deso().identity.getUserKey(),
                BodyObj: {
                    Body: `Hey @${opponentName}, I just made my move in our game. Here's what the board looks like. Your Move!`,
                    VideoURLs: [],
                    ImageURLs: [ticTacToePreview(newBoard)],
                },
            })
            .then((res) => console.log(res))
            .catch((e) => console.error(e));
        setLoading(`Waiting for ${opponentName} to move...`);
        updateGame(new Deso().identity.getUserKey());
    };

    return (
        <Box
            width="100%"
            height="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            {winner && (
                <Winning
                    opponentName={opponentName}
                    gameState={gameState}
                    game={game}
                />
            )}
            {loading && (
                <Box
                    position="absolute"
                    backgroundColor="rgba(0, 0, 0, 0.4)"
                    height="100vh"
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDir="column"
                    gap={4}
                >
                    <Spinner thickness="4px" />
                    <Text fontWeight="semibold">{loading}</Text>
                </Box>
            )}
            <Grid
                templateRows="repeat(3, 200px)"
                templateColumns="repeat(3, 200px)"
                gap="2"
            >
                {gameState.board.map((row, i) => {
                    return row.map((cell, j) => {
                        return (
                            <GridItem
                                key={`${i}-${j}`}
                                border="1px solid #3750A8"
                                borderRadius="1rem"
                                backgroundColor="rgb(40, 44, 68)"
                                display="flex"
                                flexDirection="column"
                                fontSize="1.2rem"
                                fontWeight="500"
                                onClick={async () => {
                                    await handleMove(i, j);
                                }}
                                cursor={
                                    gameState.board[i][j] == ""
                                        ? "pointer"
                                        : "not-allowed"
                                }
                                _hover={{
                                    backgroundColor: "rgb(40, 44, 68)",
                                }}
                            >
                                <TTTTile board={gameState.board} x={i} y={j} />
                            </GridItem>
                        );
                    });
                })}
            </Grid>
        </Box>
    );
};
