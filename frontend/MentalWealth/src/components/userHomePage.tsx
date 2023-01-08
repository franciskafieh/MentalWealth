import { Center, Button, Title, Loader, Text, Card, SimpleGrid, useMantineTheme, Anchor } from "@mantine/core";
import { fetcher } from "../utils/fetcher";
import { MoodChart } from "./moodLineChart";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";

export const UserHome = () => {
    return <>
        <Title order={2} mb="xl" fw={300}>Your Mood Over the Last Week</Title>
        <MoodChart></MoodChart>
        <Title order={2} mt="xl" mb="xl" fw={300}>Your Recent Journal Entries</Title>
        <JournalEntries></JournalEntries>
        <Title order={2} mt="xl" mb="xl" fw={300}>Chat History</Title>
        <Center><Button></Button></Center>
    </>;
}

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
                    <HomeScreenJournalEntry key={entry.id} id={entry.id} title={entry.title} updatedAt={entry.updatedAt}></HomeScreenJournalEntry>
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

function HomeScreenJournalEntry(props: {id: number, title: string, updatedAt: string}) {
    return <>
        <Card p="xl" radius="md" withBorder component="a" href={"/journal/" + props.id}>
            <Text fz="xl" truncate>{props.title}</Text>
            Last edited
            {" " + dayjs(props.updatedAt).format("MMM D, YYYY [at] h:mm A")}
        </Card>
    </>;
}
