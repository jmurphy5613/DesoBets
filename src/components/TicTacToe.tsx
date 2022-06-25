import { Grid, GridItem } from "@chakra-ui/react";

export const TicTacToe = () => {
    return (
        <Grid
            h="200px"
            templateRows="repeat(3, 1fr)"
            templateColumns="repeat(3, 1fr)"
        >
            <GridItem border="1px solid black"></GridItem>
            <GridItem border="1px solid black"></GridItem>
            <GridItem border="1px solid black"></GridItem>
        </Grid>
    );
};
