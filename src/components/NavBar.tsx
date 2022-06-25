import { ReactNode, useEffect, useState } from "react";
import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    Heading,
    Tooltip,
} from "@chakra-ui/react";
import {
    HamburgerIcon,
    CloseIcon,
    PlusSquareIcon,
    AddIcon,
} from "@chakra-ui/icons";
import Deso from "deso-protocol";
import { useRouter } from "next/router";
import CreateGamePopup from "./CreateGamePopup";

const Links = [];

const NavLink = ({ children }: { children: ReactNode }) => (
    <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href={"#"}
    >
        {children}
    </Link>
);

export default function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (window) {
            const deso = new Deso();
            const user = deso.user
                .getSingleProfile({
                    PublicKeyBase58Check: deso.identity.getUserKey(),
                })
                .catch((e) => router.push("/"));
            const pfp = deso.user.getSingleProfilePicture(
                deso.identity.getUserKey()
            );
            setUser({
                ...user,
                pfp,
            });
        }
    }, []);
    return (
        <>
            <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
                <Flex
                    h={16}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <IconButton
                        size={"md"}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={"Open Menu"}
                        display={{ md: "none" }}
                        onClick={isOpen ? onClose : onOpen}
                    />

                    <HStack spacing={8} alignItems={"center"}>
                        <Box>
                            <Heading size="lg">Deso Bets</Heading>
                        </Box>
                        <HStack
                            as={"nav"}
                            spacing={4}
                            display={{ base: "none", md: "flex" }}
                        >
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={"center"} gap={4}>
                        <CreateGamePopup
                            target={(onOpen) => (
                                <Tooltip label="Create Game">
                                    <IconButton
                                        size="sm"
                                        aria-label="Create Game"
                                        onClick={onOpen}
                                        icon={<AddIcon />}
                                    ></IconButton>
                                </Tooltip>
                            )}
                        />
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={"full"}
                                variant={"link"}
                                cursor={"pointer"}
                                minW={0}
                            >
                                <Avatar size={"sm"} src={user?.pfp ?? ""} />
                            </MenuButton>
                            <MenuList>
                                <MenuItem
                                    onClick={async () => {
                                        const deso = new Deso();
                                        await deso.identity.logout(
                                            deso.identity.getUserKey()
                                        );
                                        router.push("/");
                                    }}
                                >
                                    Log Out
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: "none" }}>
                        <Stack as={"nav"} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}
