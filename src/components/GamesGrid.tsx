import { Grid, Text, GridItem, Container } from "@chakra-ui/react";
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
        <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(3, 1fr)"
            gridGap="2rem"
            width="90vw"
            marginTop="2rem"
            height="60vh"
        >
            {games.map((game, i) => (
                <GridItem
                    key={i}
                    border="1px solid #3750A8"
                    borderRadius="1rem"
                    backgroundColor="rgb(40, 44, 68)"
                    display="flex"
                    flexDirection="column"
                    fontSize="1.2rem"
                    fontWeight="500"
                    onClick={() => {
                        location.href = `http://localhost:3000/game/${game.id}`;
                    }}
                    _hover={{ cursor: "pointer" }}
                >
                    <Container height="10%" paddingTop="0.5rem">
                        {game.is_playing ? (
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
                </GridItem>
            ))}
        </Grid>
    );
};

export default GamesGrid;
