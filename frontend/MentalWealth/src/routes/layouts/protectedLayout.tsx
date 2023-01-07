import {
    ActionIcon,
    AppShell,
    Burger,
    Center,
    Container,
    Drawer,
    Group,
    Header,
    Menu,
    Stack,
    Text,
    Title,
    createStyles,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import { IconLogout, IconMoonStars, IconSun, IconUser } from "@tabler/icons";
import { Link, Outlet } from "react-router-dom";

import { apiStateHandler } from "../../utils/apiStateHandler";
import { fetcher } from "../../utils/fetcher";
import { useApiStore } from "../../store/apiStore";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";

const links = [
    {
        link: "/home",
        label: "Home",
    },
    {
        link: "/journal",
        label: "Journal",
    },
    {
        link: "/chats",
        label: "Chats",
    },
];

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    inner: {
        height: HEADER_HEIGHT,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    links: {
        [theme.fn.smallerThan("sm")]: {
            display: "none",
        },
    },
    burger: {
        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },
    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 12px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },
    linkLabel: {
        marginRight: 5,
    },
}));

export const ProtectedLayout = (): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const user = useApiStore((state) => state.user);

    const logout = useMutation({
        mutationFn: async () => {
            const logout = fetcher.path("/Auth/Logout").method("delete").create();
            try {
                await logout({});
            } finally {
                apiStateHandler.setAuthToken("");
                apiStateHandler.setUser(undefined);
            }
        }
    });

    const [opened, { toggle }] = useDisclosure(false);

    const items = links.map((link) => {
        return (
            <Center key={link.label}>
                <Link to={link.link} className={classes.link}>
                    {link.label}
                </Link>
            </Center>
        );
    });

    return (
        <AppShell
            padding="md"
            fixed={true}
            header={
                <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }}>
                    <Container className={classes.inner} fluid={true}>
                        <Title order={3} style={{ margin: 0 }} color={theme.fn.primaryColor()}>
                            MentalWealth
                        </Title>
                        <Group spacing={5} className={classes.links}>
                            {items}
                        </Group>
                        <Group>
                            <Menu>
                                <Menu.Target>
                                    <ActionIcon
                                        variant="transparent"
                                        radius="xl"
                                        sx={{ height: 30 }}
                                    >
                                        <IconUser
                                            color={
                                                theme.colorScheme === "light"
                                                    ? theme.black
                                                    : theme.white
                                            }
                                            size={28}
                                            stroke={1.5}
                                        />
                                    </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>Logged in as <Text component="span" weight="bold">{user.userName}</Text></Menu.Label>
                                    <Menu.Item icon={colorScheme === "dark" ? <IconSun /> : <IconMoonStars />} onClick={() => toggleColorScheme()}>Change theme</Menu.Item>
                                    <Menu.Item icon={<IconLogout />} onClick={() => logout.mutate()} color="red">Logout</Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                            <Burger
                                opened={opened}
                                onClick={toggle}
                                className={classes.burger}
                                size="sm"
                            />
                        </Group>
                    </Container>
                </Header>
            }
        >
            <Drawer
                opened={opened}
                onClose={toggle}
                position="right"
                size="md"
                padding="xl"
                title="Navigation"
            >
                <Stack spacing="lg">{items}</Stack>
            </Drawer>
            <Outlet />
        </AppShell>
    );
};

export default ProtectedLayout;
