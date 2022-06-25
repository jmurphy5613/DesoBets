import { Text, Container, Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Deso from "deso-protocol";

const Index = () => {
    const router = useRouter();
    return (
        <Container
            display="flex"
            width="100%"
            marginX={4}
            flexDirection="column"
            marginY={20}
            gap="20px"
        >
            <Heading size="3xl">Deso Bets</Heading>
            <Text size="xl">
                This is a simple example of a decentralized betting application.
            </Text>
            <Button
                variant="solid"
                colorScheme="blue"
                onClick={async () => {
                    const response = await new Deso().identity.login();
                    router.push({ pathname: "/app" });
                }}
            >
                Login
            </Button>
        </Container>
    );
};

export default Index;
