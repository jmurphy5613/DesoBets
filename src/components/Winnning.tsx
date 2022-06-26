import {
    Text,
    Input,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Alert,
    AlertIcon,
    Stack,
    Link,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Deso from "deso-protocol";
import ticTacToePreview from "../utils/TicTacToePreview";
import { TicTacToeGameState, Game } from "../types";
import { useReward } from "react-rewards";
import NextLink from "next/link";

type WinningProps = {
    gameState: TicTacToeGameState;
    opponentName: string;
    game: Game;
};

const Winning: React.FC<WinningProps> = ({ gameState, opponentName, game }) => {
    const [message, setMessage] = useState("");
    const [sentMessage, setSentMessage] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
    const { reward, isAnimating } = useReward("game-win", "confetti", {
        spread: 150,
    });

    useEffect(() => {
        if (game && game.winner) setSentMessage(true);
        else setSentMessage(false);
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
            location.href = "http://localhost:3000/app";
        }
    };

    useEffect(() => {
        setTimeout(reward, 500);
    }, []);

    return (
        <>
            <span
                id="game-win"
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    zIndex: 1500,
                }}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Congratulations! You will recieve payment!
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack gap={2}>
                            {!sentMessage && (
                                <>
                                    <Input
                                        placeholder="Send a custom winning message!"
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                    />
                                    <Alert status="info" rounded="md">
                                        <AlertIcon />
                                        This will create an on-chain post that
                                        is tied to your account permanently
                                    </Alert>
                                </>
                            )}
                            <Text>Wanna play another?</Text>
                        </Stack>
                    </ModalBody>
                    <ModalFooter justifyContent="space-between">
                        <Button onClick={onClose}>Close</Button>
                        <Stack direction="row">
                            <NextLink href="/app" passHref>
                                <Button variant="outline" colorScheme="teal">
                                    Play Another Game
                                </Button>
                            </NextLink>
                            {!sentMessage && (
                                <Button
                                    onClick={sendWinningMessage}
                                    colorScheme="teal"
                                >
                                    Submit
                                </Button>
                            )}
                        </Stack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Winning;
