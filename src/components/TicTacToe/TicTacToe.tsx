import {
    Grid,
    GridItem,
    Container,
    Text,
    Box,
    Spinner,
    Heading,
    useToast,
    SimpleGrid,
    Center,
    Stack,
    HStack,
} from "@chakra-ui/react";
import { Game, TicTacToeGameState } from "../../types";
import Deso from "deso-protocol";
import ticTacToePreview from "../../utils/TicTacToePreview";
import { useEffect, useState } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import Winning from "../Winnning";
import Losing from "../Losing";

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
        if (!userTurn && !game.winner) {
            setLoading(`Waiting for ${opponentName} to move...`);
        } else {
            setLoading(false);
        }
    }, [userTurn]);

    const checkForWinner = (turn: string) => {
        const board = game.gameState.board;
        // check for a tic-tac-toe win
        for (let row = 0; row < 3; row++) {
            if (
                board[row][0] == turn &&
                board[row][1] == turn &&
                board[row][2] == turn
            ) {
                setWinner(true);
                return true;
            }
        }
        for (let col = 0; col < 3; col++) {
            if (
                board[0][col] == turn &&
                board[1][col] == turn &&
                board[2][col] == turn
            ) {
                setWinner(true);
                return true;
            }
        }
        if (board[0][0] == turn && board[1][1] == turn && board[2][2] == turn) {
            setWinner(true);
            return true;
        }
        if (board[0][2] == turn && board[1][1] == turn && board[2][0] == turn) {
            setWinner(true);
            return true;
        }
        return false;
    };

    const currentUserLost = () => {
        if (new Deso().identity.getUserKey() == game.winner) {
            return false;
        } else {
            return true;
        }
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
        setLoading("Sending your move...");
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
            setLoading(false);
            setWinner(true);
            return;
        }

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
        <HStack width="100%" height="100vh" display="flex" spacing={4}>
            <Stack paddingX={10} paddingY={8} h="90vh" w="25%">
                <Heading size="md" color="gray.300">
                    Playing Against
                </Heading>
                <Text
                    fontSize="xl"
                    color="gray.400"
                    onClick={() => {
                        location.href = `https://diamondapp.com/u/${opponentName}?tab=posts&feedTab=Hot`;
                    }}
                    _hover={{
                        cursor: "pointer",
                        color: "blue.300",
                    }}
                >
                    {`@${opponentName}`}
                </Text>
                <Heading size="md" color="gray.300">
                    Turn
                </Heading>
                <Text fontSize="xl" color="gray.400">
                    {gameState.turn}
                </Text>
            </Stack>
            {(winner || game.winner == new Deso().identity.getUserKey()) && (
                <Winning
                    opponentName={opponentName}
                    gameState={gameState}
                    game={game}
                />
            )}
            {game.winner != null && currentUserLost() && (
                <Losing game={game} opponentName={opponentName} />
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
            <Center>
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
                                        if (!game.winner) {
                                            await handleMove(i, j);
                                        }
                                    }}
                                    cursor={
                                        !game.winner &&
                                        gameState.board[i][j] == ""
                                            ? "pointer"
                                            : "not-allowed"
                                    }
                                    _hover={{
                                        backgroundColor: "rgb(40, 44, 68)",
                                    }}
                                >
                                    <TTTTile
                                        board={gameState.board}
                                        x={i}
                                        y={j}
                                    />
                                </GridItem>
                            );
                        });
                    })}
                </Grid>
            </Center>
        </HStack>
    );
};
