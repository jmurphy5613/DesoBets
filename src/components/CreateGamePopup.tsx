import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    ModalCloseButton,
    Button,
    InputLeftElement,
    Select,
    Input,
    InputGroup,
    Text,
    Alert,
    AlertIcon,
    Box,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import Deso from "deso-protocol";

const CreateGamePopup = ({
    target,
}: {
    target: (onOpen: () => void) => void;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [username, setUsername] = useState("");
    const [game, setGame] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | false>(false);

    const checkIfNameExists = async () => {
        const deso = new Deso();
        return await deso.user
            .getSingleProfile({
                Username: username,
            })
            .then((res) => {
                return res.Profile.PublicKeyBase58Check;
            })
            .catch((e) => {
                setError(e);
                return null;
            });
    };

    const getGameName = (name: string) => {
        if (name == "ttt") return "Tic Tac Toe";
        else if (name == "rps") return "Rock Paper Sissors";
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(false);
        console.log(username);
        console.log(game);
        console.log(message);

        const deso = new Deso();
        console.log(deso.identity.getUserKey());
        const playerBKey = await checkIfNameExists();
        if (!playerBKey) {
            setLoading(false);
            setError("That user doesn't exist :(");
            return;
        }
        await fetch("/api/createGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                playerAKey: deso.identity.getUserKey(),
                playerBKey,
                gameState: {
                    type: game,
                    board: [],
                },
            }),
        })
            .then((res) => res.json())
            .then(async (data) => {
                const postResponse = await deso.posts
                    .submitPost({
                        UpdaterPublicKeyBase58Check: deso.identity.getUserKey(),
                        BodyObj: {
                            Body: `Hi @${username} I'm challenging you to a game of ${getGameName(
                                game
                            )}. ${message}
                            ${window.location.origin}/game/${data.id}`,
                            VideoURLs: [],
                            ImageURLs: [],
                        },
                    })
                    .then((res) => console.log(res));
            });
        setLoading(false);
        onClose();
    };

    return (
        <>
            {target(onOpen)}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Game</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <InputGroup marginBottom="1rem">
                            <Input
                                placeholder="Type in a public DeSo username"
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                            />
                            <InputLeftElement
                                children="$"
                                color="grey.300"
                                pointerEvents="none"
                                fontSize="1.2rem"
                            />
                        </InputGroup>
                        <Select
                            placeholder="Select Game"
                            marginBottom="1rem"
                            onChange={(e) => setGame(e.target.value)}
                        >
                            <option value="ttt">TicTacToe</option>
                            <option value="rps">Rock Paper Sissors</option>
                        </Select>
                        <Input
                            placeholder="Type in a custom message (shown on profile)"
                            marginBottom="1rem"
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Box display="flex" flexDir="column" gap={2}>
                            <Alert status="info" rounded="md">
                                <AlertIcon />
                                This will create an on-chain post that is tied
                                to your account permanently
                            </Alert>
                            {error && (
                                <Alert status="error" rounded="md">
                                    <AlertIcon />
                                    {error}
                                </Alert>
                            )}
                        </Box>
                    </ModalBody>

                    <ModalFooter display="flex">
                        <Button
                            isLoading={loading}
                            colorScheme="blue"
                            mr={3}
                            onClick={() => handleSubmit()}
                        >
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreateGamePopup;
