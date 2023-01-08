import { Text, Title, createStyles, Loader, Card, SimpleGrid, Center, Group, Space, Anchor, useMantineTheme, Button } from "@mantine/core";
import { fetcher } from "../utils/fetcher";
import { useApiStore } from "../store/apiStore";
import { useQuery } from "@tanstack/react-query";
import { IconDots } from "@tabler/icons";
import { hexToRgb } from "../utils/colors";
import dayjs from "dayjs";
import { MoodChart } from "../components/moodLineChart";

function getHalfOpacityFromHex(hex: string) {
    const [r, g, b] = hexToRgb(hex);
    console.log(hex);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
}

const useStyles = createStyles((theme) => ({
    createJournalCard: {
        borderColor: theme.fn.primaryColor(),
        color: theme.fn.primaryColor(),
        boxShadow: theme.colorScheme === "dark" ? "inset 1px 1px 24px 0 " + getHalfOpacityFromHex(theme.fn.primaryColor()) : "",

    },
}));

const Home = (): JSX.Element => {
    return (
        <>
            <Title order={1} mb="xl">Good to see you, {useApiStore((state) => state.user).userName}.</Title>
            <Title order={2} mb="xl" fw={300}>Your Mood Over the Last Week</Title>
            <MoodChart></MoodChart>
            <Title order={2} mt="xl" mb="xl" fw={300}>Your Recent Journal Entries</Title>
            <JournalEntries></JournalEntries>
            <Title order={2} mt="xl" mb="xl" fw={300}>Chat History</Title>
            <Center><Button></Button></Center>
            
        </>

        // or check /User/Roles and show different thing if support agent
    );
};

function JournalEntries() {
    const theme = useMantineTheme();

    const { status, data } = useQuery({
        queryKey: ["JournalEntries"],
        queryFn: () => {
            const journalEntries = fetcher.path("/Journals").method("get").create();
            return journalEntries({});
        }
    });



    if (status === "loading") return <Loader variant="bars"></Loader>;
    if (status === "error") return <Text>Error</Text>;
    if (status === "success") {
        return (
            <div>
            <SimpleGrid spacing="xs" verticalSpacing="xs" mb="lg"
                  breakpoints={[
                        { minWidth: 'sm', cols: 2 },
                        { minWidth: 'md', cols: 3 },
                        { minWidth: 'lg', cols: 4 },
                    ]}
            
            >
                {data.data.sort((a, b) => Number.parseInt(b.updatedAt) - Number.parseInt(a.updatedAt)).slice(0,12).map((entry) => 
                    <Card p="xl" radius="md" withBorder component="a" href={"/journal/" + entry.id}>
                        <Text fz="xl" truncate>{entry.title}</Text>

                        Last edited
                        {" " + dayjs(entry.updatedAt).format("MMM D, YYYY [at] h:mm A")}
                    </Card>
                )}
                {/* <Card shadow="sm" p="lg" radius="md" withBorder component="a"
                href="/journal" className={classes.createJournalCard}> 
                    <Center>
                        <Group spacing="xs">
                            <Text fw={700} fz="xl">See All</Text>
                            <IconDots size={48}></IconDots>
                        </Group>
                    </Center>
                </Card> */}
            </SimpleGrid>
            <Anchor c={theme.fn.primaryColor()} fw={700} fz="xl" href="/journal">See all →</Anchor>
            </div>
        )
    }
}

export default Home;