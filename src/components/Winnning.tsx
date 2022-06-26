import { Box, Heading, Input, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Deso from "deso-protocol";
import ticTacToePreview from "../utils/TicTacToePreview";
import { TicTacToeGameState, Game } from "../types";

type WinningProps = {
    gameState: TicTacToeGameState;
    opponentName: string;
    game: Game;
};

const Winning: React.FC<WinningProps> = ({ gameState, opponentName, game }) => {
    const [message, setMessage] = useState("");
    const [sentMessage, setSentMessage] = useState(false);

    useEffect(() => {
        if (game && game.winner) setSentMessage(false);
        else setSentMessage(true);
    }, [game]);

    const sendWinningMessage = async () => {
        if (!game.winner) {
            await new Deso().posts.submitPost({
                UpdaterPublicKeyBase58Check: new Deso().identity.getUserKey(),
                BodyObj: {
                    Body: `I just won my Tic Tac Toe game against @${opponentName}. ${message}`,
                    VideoURLs: [],
                    ImageURLs: [ticTacToePreview(gameState.board)],
                },
            });
            //const { gameId, playerKey, board, gameOver, endGame } = req.body;
            const newGame = await fetch("/api/updateGame", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    endGame: true,
                    gameId: game.id,
                    playerKey: new Deso().identity.getUserKey(),
                    board: game.gameState.board,
                    gameOver: true,
                }),
            });
        }
    };

    return (
        <Box
            height="100vh"
            width="100vw"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgColor="rgba(0, 0, 0, 0.7)"
            position="absolute"
            flexDirection="column"
        >
            <Heading color="white">Congrats you won!</Heading>
            <Input
                placeholder="Send a custom winning message!"
                onChange={(e) => setMessage(e.target.value)}
                width="30%"
            />
            <Button onClick={sendWinningMessage}>Submit</Button>
        </Box>
    );
};

export default Winning;
