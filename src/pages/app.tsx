import {
    Container,
    Button,
    Text,
    Divider,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    Box,
    AccordionIcon,
    AccordionPanel,
    Spinner,
} from "@chakra-ui/react";
import Deso from "deso-protocol";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateGamePopup from "../components/CreateGamePopup";
import NavBar from "../components/NavBar";
import GamesGrid from "../components/GamesGrid";
import { Game } from "../types";

const App = () => {
    const router = useRouter();

    const [games, setGames] = useState<Game[]>(null);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        //go through all game entries and find the ones that involve this wallet
        fetch("/api/games", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${new Deso().identity.getUserKey()}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setGames(data);
                console.log(data);
            });

        new Deso().posts
            .getPostsForPublicKey({
                Username: "Neesh774",
                NumToFetch: 3,
                MediaRequired: false,
            })
            .then((res) => console.log(res));
    }, []);

    return (
        <div>
            <NavBar />
            <Box
                display="flex"
                flexDirection="column"
                height="90vh"
                width="100%"
                paddingX={8}
                paddingTop={4}
            >
                <Heading>Welcome,</Heading>
                <Text>
                    Create a new game, or check out one of your current games
                    below.
                </Text>
                {games ? (
                    games.length == 0 ? (
                        <>
                            <Text fontSize="2rem">No games in progress</Text>
                        </>
                    ) : (
                        <>
                            <Accordion
                                width="100%"
                                display="flex"
                                flexDir="column"
                                defaultIndex={[0]}
                                allowMultiple
                                marginY={4}
                            >
                                <AccordionItem>
                                    <Heading>
                                        <AccordionButton>
                                            <Text
                                                fontWeight="extrabold"
                                                color="teal.400"
                                                fontSize="xl"
                                            >
                                                Games (
                                                {
                                                    games.filter(
                                                        (game) => !game.winner
                                                    ).length
                                                }
                                                )
                                            </Text>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </Heading>
                                    <AccordionPanel>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            marginBottom="1rem"
                                        >
                                            <Button
                                                onClick={() => {
                                                    setRefresh(refresh + 1);
                                                }}
                                                marginRight="2rem"
                                            >
                                                Refresh
                                            </Button>
                                            <Text>
                                                Click on a game to view it!
                                            </Text>
                                        </Box>
                                        <GamesGrid
                                            games={games.filter(
                                                (game) => !game.winner
                                            )}
                                        />
                                    </AccordionPanel>
                                </AccordionItem>
                                <AccordionItem>
                                    <Heading>
                                        <AccordionButton>
                                            <Text
                                                fontWeight="extrabold"
                                                color="gray.400"
                                                fontSize="xl"
                                            >
                                                Completed (
                                                {
                                                    games.filter(
                                                        (game) => game.winner
                                                    ).length
                                                }
                                                )
                                            </Text>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </Heading>
                                    <AccordionPanel>
                                        <GamesGrid
                                            games={games.filter(
                                                (game) => game.winner
                                            )}
                                        />
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                            <Box justifyContent="center" display="flex">
                                <CreateGamePopup
                                    target={(onOpen) => (
                                        <Button
                                            onClick={onOpen}
                                            marginBottom="2rem"
                                        >
                                            Create Game
                                        </Button>
                                    )}
                                />
                            </Box>
                        </>
                    )
                ) : (
                    <Box display="flex" justifyContent="center">
                        <Spinner />
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default App;
