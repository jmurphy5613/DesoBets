import { Box, Heading, Button, Input } from "@chakra-ui/react";

const Losing = () => {
    return (
        <Box
            height="100vh"
            width="100vw"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgColor="rgba(0, 0, 0, 0.7)"
            position="absolute"
            flexDirection="column"
        >
            <Heading color="white">You lost :(</Heading>
        </Box>
    );
};

export default Losing;
