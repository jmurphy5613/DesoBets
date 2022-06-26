import {
    Box,
    Heading,
    Button,
    Input,
    Text,
    Modal,
    Stack,
    useDisclosure,
    ModalHeader,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react";
import { useReward } from "react-rewards";
import { Game } from "../types";
import Deso from "deso-protocol";
import { useState } from "react";
import { signHex } from "../utils/sign/sign";

const Losing = ({
    opponentName,
    game,
}: {
    opponentName: string;
    game: Game;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
    const { reward, isAnimating } = useReward("game-lose", "balloons");

    const sendMoney = async () => {
        let key = game.player_a_key;
        if (new Deso().identity.getUserKey() == game.player_a_key) {
            key = game.player_b_key;
        }
        const tx = await fetch("https://node.deso.org/api/v0/send-deso", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                SenderPublicKeyBase58Check: new Deso().identity.getUserKey(),
                RecipientPublicKeyOrUsername: key,
                MinFeeRateNanosPerKB: 0,
                AmountNanos: 10000,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                return data.TransactionHex;
            });
        const desoUser = JSON.parse(window.localStorage.getItem("deso_user"));
        const encryptedSeedHex = desoUser.encryptedSeedHex;
        const encryptionKey =
            "a0026bccef332c036dfcbf10ca30256b736e1a727b8bffce2105c09e4635f5c4";
        const signed = await signHex(tx, encryptedSeedHex, encryptionKey);
        const response = await fetch(
            "https://node.deso.org/api/v0/submit-transaction",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    TransactionHex: signed,
                }),
            }
        )
            .then((res) => res.json())
            .then((data) => {
                return data;
            });
        console.warn(response);
    };

    return (
        <>
            <span
                id="game-lose"
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
                    <ModalHeader color="white">Good Game!</ModalHeader>
                    <ModalBody>
                        <Text>
                            {opponentName} beat you at TicTacToe... Maybe this
                            button will cheer you up?
                        </Text>
                    </ModalBody>
                    <ModalFooter justifyContent="space-between">
                        <Button onClick={onClose}>Close</Button>
                        <Button
                            onClick={() => {
                                reward();
                            }}
                            colorScheme="purple"
                            variant="outline"
                        >
                            Press Me!
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Losing;
