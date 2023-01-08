import {
    Anchor,
    Box,
    Button,
    Card,
    Center,
    Group,
    Loader,
    SimpleGrid,
    Space,
    Text,
    Title,
    createStyles,
    useMantineTheme,
} from "@mantine/core";

import { FullScreenLoading } from "../components/fullScreenLoading";
import { HelperHome } from "../components/helperHomePage";
import { IconDots } from "@tabler/icons";
import { Link } from "react-router-dom";
import { MoodChart } from "../components/moodLineChart";
import dayjs from "dayjs";
import { fetcher } from "../utils/fetcher";
import { hexToRgb } from "../utils/colors";
import { useApiStore } from "../store/apiStore";
import { useQuery } from "@tanstack/react-query";

function getHalfOpacityFromHex(hex: string) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
}

const useStyles = createStyles((theme) => ({
    errorContainer: {
        height: "100vh",
        zIndex: -1,
        top: 0,
        left: 0,
        right: 0,
        position: "fixed",
        flexDirection: "column",
    },
}));

const Home = (): JSX.Element => {
    return (
        <>
            <Title order={1} mb="xl">
                Good to see you, {useApiStore((state) => state.user).userName}.
            </Title>
            <SimpleGrid
                cols={2}
                spacing="xl"
                verticalSpacing="xl"
                breakpoints={[{ maxWidth: 1348, cols: 1 }]}
            >
                <Box>
                    <Title order={2} mb="md" fw={300}>
                        Your Mood Over the Last Week
                    </Title>
                    <MoodChart />
                </Box>
                <Box>
                    <Group position="apart">
                        <Title order={2} mt="md" mb="xl" fw={300}>
                            Your Recent Journal Entries
                        </Title>
                        <Button component={Link} variant="outline" to="/journal">
                            See all →
                        </Button>
                    </Group>
                    <JournalEntries />
                </Box>
            </SimpleGrid>
            <Title order={2} mt="xl" mb="xl" fw={300}>
                Chat History
            </Title>
            <Center>
                <Button></Button>
            </Center>
        </>
    );
};

const JournalEntries = () => {
    const { classes } = useStyles();

    const entires = useQuery({
        queryKey: ["JournalEntries"],
        queryFn: () => {
            const journalEntries = fetcher.path("/Journals").method("get").create();
            return journalEntries({});
        },
    });

    if (entires.isLoading) return <FullScreenLoading />;

    if (entires.isError)
        return (
            <Center className={classes.errorContainer} m="xs">
                <Title color="red" align="center">
                    Failed to load journal entries
                </Title>
                <Text color="red" align="center">
                    {" "}
                    Please try again later or try logging out and the back in.
                </Text>
            </Center>
        );

    return (
        <div>
            <SimpleGrid
                spacing="xs"
                verticalSpacing="xs"
                mb="lg"
                breakpoints={[
                    { minWidth: "sm", cols: 2 },
                    { minWidth: "md", cols: 3 },
                    { minWidth: "lg", cols: 4 },
                ]}
            >
                {entires.data.data
                    .sort((a, b) => Number.parseInt(b.updatedAt) - Number.parseInt(a.updatedAt))
                    .slice(0, 8)
                    .map((entry) => (
                        <HomeScreenJournalEntry
                            key={entry.id}
                            id={entry.id}
                            title={entry.title}
                            updatedAt={entry.updatedAt}
                        ></HomeScreenJournalEntry>
                    ))}
            </SimpleGrid>
        </div>
    );
};

const HomeScreenJournalEntry = (props: { id: number; title: string; updatedAt: string }) => {
    return (
        <>
            <Card p="xl" radius="md" withBorder component="a" href={"/journal/" + props.id}>
                <Text fz="xl" truncate>
                    {props.title}
                </Text>
                <Text color="dimmed" size="xs">
                    Last edited:
                </Text>
                <Text size="sm">{dayjs(props.updatedAt).format("DD MMM YYYY")}</Text>
            </Card>
        </>
    );
}

export default Home;
