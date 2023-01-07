import { Anchor, Button, Container, Group, Text, Title, createStyles } from "@mantine/core";

import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: 80,
        paddingBottom: 80,
    },

    label: {
        textAlign: "center",
        fontWeight: 900,
        fontSize: 480,
        lineHeight: 1,
        opacity: 0.1,
        zIndex: -1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,

        [theme.fn.smallerThan("md")]: {
            fontSize: 360,
        },

        [theme.fn.smallerThan("sm")]: {
            fontSize: 260,
        },

        [theme.fn.smallerThan("xs")]: {
            paddingTop: 40,
            fontSize: 160,
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        textAlign: "center",
        fontWeight: 900,
        fontSize: 42,
        paddingTop: 220,

        [theme.fn.smallerThan("md")]: {
            paddingTop: 120,
        },

        [theme.fn.smallerThan("sm")]: {
            paddingTop: 60,
            fontSize: 38,
        },
    },

    description: {
        maxWidth: 500,
        margin: "auto",
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
}));

const FourOFour = () => {
    const { classes } = useStyles();

    return (
        <Container className={classes.root}>
            <Text className={classes.label} color="dimmed">404</Text>
            <Title className={classes.title} >Page not found.</Title>
            <Text color="dimmed" size="lg" align="center" className={classes.description}>
                Seems like the page you are looking for does not exist. Please check the URL and try again. Maybe it's just a typo.
            </Text>
            <Group position="center">
                <Button component={Link} to="/" size="md">
                    Take me back to home page
                </Button>
            </Group>
        </Container>
    );
};

export default FourOFour;
