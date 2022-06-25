import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Deso from "deso-protocol";
import { PrismaClient } from "@prisma/client";

export default function GamePage() {
    const router = useRouter();
    const [game, setGame] = useState(null);

    useEffect(() => {
        if (!router.query.gameId) {
            return console.log("invalid id");
        }
        fetch("/api/getSingleGame", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${new Deso().identity.getUserKey()} ${router.query.gameId.toString()}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setGame(data);
            });
    }, []);
}

export async function getStaticPaths() {
    const prisma = new PrismaClient();
    const games = await prisma.games.findMany();
    const paths = games.map((game) => ({
        params: {
            gameId: game.id.toString(),
        },
    }));
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps(context) {
    const prisma = new PrismaClient();
    const game = await prisma.games.findFirst({
        where: {
            id: parseInt(context.params.gameId),
        },
    });
    return {
        props: {
            game,
        },
    };
}
