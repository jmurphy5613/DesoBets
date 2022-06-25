import { Container, Button, Text } from "@chakra-ui/react";
import Deso from "deso-protocol";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateGamePopup from "../components/CreateGamePopup";
import NavBar from "../components/NavBar";
const App = () => {
    const router = useRouter();

    const [numberOfGames, setNumberOfGames] = useState(0);

    useEffect(() => {
        //go through all game entries and find the ones that involve this wallet
    }, []);

    return (
        <div>
            <NavBar />
            <Container
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="90vh"
            >
                {numberOfGames == 0 && (
                    <>
                        <Text fontSize="2rem">No games in progress</Text>
                        <CreateGamePopup
                            target={(onOpen) => (
                                <Button onClick={onOpen}>Create Game</Button>
                            )}
                        />
                    </>
                )}
            </Container>
        </div>
    );
};

export default App;
