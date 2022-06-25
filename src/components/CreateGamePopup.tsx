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
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import Deso from "deso-protocol";

const CreateGamePopup = ({
    target,
}: {
    target: (onOpen: () => void) => void;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [publicKey, setPublicKey] = useState("");
    const [game, setGame] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        console.log(publicKey);
        console.log(game);
        console.log(message);

        const deso = new Deso();
        console.log(deso.identity.getUserKey());

        const postResponse = await deso.posts
            .submitPost({
                UpdaterPublicKeyBase58Check: deso.identity.getUserKey(),
                BodyObj: {
                    Body: `Hi @${publicKey} I'm challenging you to a game of ${game}. ${message}`,
                    VideoURLs: [],
                    ImageURLs: [],
                },
            })
            .then((res) => console.log(res));
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
                                placeholder="Type in a public key ex: QRY3161.."
                                onChange={(e) => setPublicKey(e.target.value)}
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
                        <Alert status="info">
                            <AlertIcon />
                            This will create an on-chain post that is tied to
                            your account permanently
                        </Alert>
                    </ModalBody>

                    <ModalFooter display="flex">
                        <Button
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
