import { ActionIcon, Box, Button, Center, Group, Text, Title, createStyles, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconMoonStars, IconSun } from "@tabler/icons";

import { FeaturesSection } from "../components/featuresSection";
import { Link } from "react-router-dom";
import { ScrollAction } from "../components/scrollAction";
import { useScrollIntoView } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
    landingContainer: {
        height: "100vh",
        flexDirection: "column",
    },
    landingTitle: {
        fontSize: "10vw",
        lineHeight: 0.8,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            fontSize: "12vw"
        },
    },
    landingDescription: {
        fontSize: "3vw",

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            fontSize: "4vw"
        },
    },
    featuresContainer: {
        minHeight: "100vh",
    },
    navigationContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
    },
}));

const Index = (): JSX.Element => {
    const { classes } = useStyles();

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const { scrollIntoView: scrollToFirstSection, targetRef: firstSectionRef } = useScrollIntoView({
        duration: 500,
    });

    return (
        <>
            <Center className={classes.landingContainer}>
                <Title
                    variant="gradient"
                    gradient={{ from: "red", to: "orange", deg: 45 }}
                    order={1}
                    className={classes.landingTitle}
                    align="center"
                    mb="sm"
                >
                    MentalWealth
                </Title>
                <Text align="center" className={classes.landingDescription} color="dimmed" mt="xs">
                    A mental health app for the modern world.
                </Text>
                <ScrollAction callback={scrollToFirstSection} />
                <Box className={classes.navigationContainer}>
                    <Group position="apart" m="sm">
                        <ActionIcon
                            variant="outline"
                            color="orange"
                            onClick={() => toggleColorScheme()}
                        >{colorScheme === "dark" ? <IconSun /> : <IconMoonStars />}</ActionIcon>
                        <Group>
                            <Button component={Link} to="/auth/login" variant="outline" color="orange">
                            Log in
                            </Button>
                            <Button component={Link} to="/auth/register" variant="outline" color="orange">
                            Register
                            </Button>
                        </Group>
                    </Group>
                </Box>
            </Center>
            <Center className={classes.featuresContainer} ref={firstSectionRef as any}>
                <FeaturesSection title="Something for everyone" description="Whether it's getting or giving help, we've got you covered." />
            </Center>
        </>
    );
};

export default Index;