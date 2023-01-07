import { Text, Title, createStyles, Loader, Card, SimpleGrid, Center, useMantineTheme, Space, Anchor } from "@mantine/core";
import { fetcher } from "../utils/fetcher";
import { useApiStore } from "../store/apiStore";
import { useQuery } from "@tanstack/react-query";
import { IconDots } from "@tabler/icons";
import { hexToRgb } from "../utils/colors";
import dayjs from "dayjs";

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
            <Title mt="lg" style={{paddingTop: "0"}}>Great to see you, {useApiStore((state) => state.user).userName}!</Title>
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
                {data.data.slice(0,10).map((entry: Entries) => 
                    <Card shadow="lg" p="lg" radius="md" withBorder component="a" href="">
                        <Text fz="xl" truncate>{entry.title}</Text>

                        Last edited
                        {" " + dayjs(entry.updatedAt).format("MMM D, YYYY [at] h:mm A")}
                    </Card>
                )}
                <Card shadow="lg" p="lg" radius="md" withBorder component="a"
                href="/journal" className={classes.createJournalCard}> 
                    <Center>
                        <Text fw={700} fz="lg">See All</Text>
                        <Space w="xs" />
                        <IconDots size={48}></IconDots>
                    </Center>
                </Card>
            </SimpleGrid>
            </div>
        )
    }
}

export default Home;