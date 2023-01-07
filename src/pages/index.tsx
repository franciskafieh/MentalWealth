import { Box, Center, Text, Title, createStyles } from "@mantine/core";

import { FeaturesSection } from "../components/featuresSection";
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
}));

const Home = (): JSX.Element => {
    const { classes } = useStyles();

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
            </Center>
            <Box ref={firstSectionRef as any}>
                <FeaturesSection title="Something for everyone" description="Whether it's getting or giving help, we've got you covered." />
            </Box>
        </>
    );
};

export default Home;
