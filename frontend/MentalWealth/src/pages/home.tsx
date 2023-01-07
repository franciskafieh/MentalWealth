import { Text, Title, createStyles, Loader, Card, SimpleGrid, Center, useMantineTheme, Space, Anchor } from "@mantine/core";
import { fetcher } from "../utils/fetcher";
import { useApiStore } from "../store/apiStore";
import { useQuery } from "@tanstack/react-query";
import { IconTextPlus } from "@tabler/icons";
import { hexToRgb } from "../utils/colors";

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
            <Title mt="lg">Great to see you, {useApiStore((state) => state.user).userName}!</Title>
            <Text mt="xs">Your Mood Over the Last X Days</Text>
            <Text mt="xs">Your Journal Entries</Text>
            <JournalEntries></JournalEntries>
            <Text mt="xs">Start an Anonymous Chat</Text>
            
        </>

        // or check /User/Roles and show different thing if support agent
    );
};

function JournalEntries() {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    type Entries = {
        title?: string;
        moodLevel?: number;
        createdAt?: string;
        updatedAt?: string;
    }

    const { status, data } = useQuery({
        queryKey: ["JournalEntries"],
        queryFn: () => {
            const journalEntries = fetcher.path("/Journals").method("get").create();
            return journalEntries({});
        }
    });



    if (status === "loading") return <Loader></Loader>;
    if (status === "error") return <Text>Error</Text>;
    if (status === "success") {
        return (
            <div>
            <SimpleGrid spacing="xs" verticalSpacing="xs"
                  breakpoints={[
                        { minWidth: 'sm', cols: 2 },
                        { minWidth: 'md', cols: 3 },
                        { minWidth: 'lg', cols: 4 },
                    ]}
            
            >
                {/* TODO: HREF */}
                <Card shadow="lg" p="lg" radius="md" withBorder component="a"
                href="" className={classes.createJournalCard}> 
                    <Center>
                        <IconTextPlus size={48}></IconTextPlus>
                        <Text>New</Text>
                    </Center>
                </Card>
                {data.data.slice(0,10).map((entry: Entries) => 
                    <Card shadow="lg" p="lg" radius="md" withBorder component="a" href="">
                        <Text fz="xl" truncate>{entry.title}</Text>

                        Last edited
                        {" " + new Date(Date.parse(entry.updatedAt)).toLocaleString("en-US", {dateStyle: "long", timeStyle: "short"})}
                    </Card>
                )}
            </SimpleGrid>
            <Space h="sm" />
            <Anchor c={theme.fn.primaryColor()} fw={700} fz="lg" href="/journal">See all →</Anchor>
            </div>
        )
    }
}

export default Home;