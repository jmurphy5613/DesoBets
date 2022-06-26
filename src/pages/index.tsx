import { Text, Container, Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Deso from "deso-protocol";

const Index = () => {
    const router = useRouter();
    return (
        <Container
            display="flex"
            width="100vw"
            flexDirection="column"
            gap="20px"
            height="100vh"
            alignItems="center"
            justifyContent="center"
            bgColor="background: rgb(18,19,30);"
            textAlign="center"
        >
            <Heading
                size="3xl"
                style={{
                    background:
                        "linear-gradient(90deg, rgba(0,133,201,1) 0%, rgba(130,63,152,1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "Inter",
                    fontWeight: "700",
                }}
            >
                Deso Bets
            </Heading>
            <Text fontSize="1.5rem" width="100vw" fontFamily="Inter">
                The first decentralized betting game running on the Deso
                Blockchain.
            </Text>
            <Button
                variant="solid"
                width="10rem"
                onClick={async () => {
                    await new Deso().identity.login();
                    if (router.query.redirectTo) {
                        const { redirectTo, ...queries } = router.query;
                        router.push({
                            pathname: redirectTo as string,
                            query: queries,
                        });
                    } else {
                        router.push("/app");
                    }
                }}
            >
                Login
            </Button>
        </Container>
    );
};

export default Index;
