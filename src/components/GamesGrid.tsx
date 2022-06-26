import { Grid, Text, GridItem, Container, Wrap, Box } from "@chakra-ui/react";
import { Game } from "../types";
import { useRouter } from "next/router";

import Deso from "deso-protocol";

type GamesGridProps = {
    games: Array<Game>;
};

const GamesGrid: React.FC<GamesGridProps> = ({ games }: { games: Game[] }) => {
    if (games.length == 0) {
        return (
            <>
                <Text>None</Text>
            </>
        );
    }

    const getDisplayName = (game: Game, key: string) => {
        const deso = new Deso();
        const userKey = deso.identity.getUserKey();
        if (userKey == key) {
            return "You";
        } else {
            if (userKey == game.player_a_key) {
                return game.player_b_name;
            } else {
                return game.player_a_name;
            }
        }
    };

    const router = useRouter();

    return (
        <Wrap width="90vw" marginTop="2rem" spacing={4} paddingY="4">
            {games.map((game, i) => (
                <Box
                    key={i}
                    border="3px solid #2a3354"
                    borderRadius="1rem"
                    backgroundColor="rgb(40, 44, 68)"
                    display="flex"
                    flexDirection="column"
                    fontSize="1.2rem"
                    fontWeight="500"
                    minWidth="300px"
                    h="180px"
                    cursor="pointer"
                    transition="all 0.2s ease"
                    marginY="4"
                    onClick={() => {
                        location.href = `http://localhost:3000/game/${game.id}`;
                    }}
                    _hover={{
                        boxShadow: "6px 8px 45px -12px rgba(0,0,0,0.75)",
                    }}
                >
                    <Container height="10%" paddingTop="0.5rem">
                        {!game.winner ? (
                            <Text>In Progress</Text>
                        ) : (
                            <Text>Completed</Text>
                        )}
                    </Container>
                    <Container
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                        justifyContent="center"
                        height="100%"
                        width="100%"
                        position="relative"
                        bottom="0.8rem"
                    >
                        <Text>{getDisplayName(game, game.player_a_key)}</Text>
                        <Text
                            bgGradient="linear(to-r, #de69da, #b91ce5)"
                            bgClip="text"
                            fontWeight="extrabold"
                        >
                            VS
                        </Text>
                        <Text>{getDisplayName(game, game.player_b_key)}</Text>
                    </Container>
                </Box>
            ))}
        </Wrap>
    );
};

export default GamesGrid;
