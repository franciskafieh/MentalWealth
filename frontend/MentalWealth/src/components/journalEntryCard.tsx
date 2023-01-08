import { Box, Button, Card, Group, RingProgress, Text, createStyles } from "@mantine/core";

import { Link } from "react-router-dom";
import { components } from "../schema";
import dayjs from "dayjs";

const useStyles = createStyles((theme) => ({
    lead: {
        fontWeight: 700,
        fontSize: 22,
        lineHeight: 1,
    },
    inner: {
        display: "flex",

        [theme.fn.smallerThan(350)]: {
            flexDirection: "column",
        },
    },
    labels: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    ring: {
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",

        [theme.fn.smallerThan(350)]: {
            justifyContent: "center",
            marginTop: theme.spacing.md,
        },
    },
}));

export const JournalEntryCard = ({
    journalEntry,
}: {
    journalEntry: components["schemas"]["JournalIndexResponse"];
}): JSX.Element => {
    const { classes, theme } = useStyles();

    return (
        <Card withBorder p="xl" radius="md">
            <Box className={classes.inner}>
                <Box className={classes.labels}>
                    <Text size="xl" weight="bolder">
                        {journalEntry.title}
                    </Text>
                    <Box mt="xs">
                        <Button sx={{ alignSelf: "flex-start" }} component={Link} to={`/journal/${journalEntry.id}`}>View entry</Button>
                        <Group mt="xs">
                            <Box>
                                <Text color="dimmed" size="xs">Created on</Text>
                                <Text size="sm">
                                    {dayjs(journalEntry.createdAt).format("DD MMM YYYY")}
                                </Text>
                            </Box>
                            <Box>
                                <Text color="dimmed" size="xs">Updated on</Text>
                                <Text size="sm">
                                    {dayjs(journalEntry.updatedAt).format("DD MMM YYYY")}
                                </Text>
                            </Box>
                        </Group>
                    </Box>
                </Box>

                <Box className={classes.ring}>
                    <RingProgress
                        roundCaps
                        thickness={6}
                        size={150}
                        sections={[
                            {
                                value: (journalEntry.moodLevel / 5) * 100,
                                color: theme.primaryColor,
                            },
                        ]}
                        label={
                            <Box>
                                <Text
                                    align="center"
                                    size="lg"
                                    sx={{ fontSize: 22 }}
                                >
                                    {((journalEntry.moodLevel / 5) * 100).toFixed(0)}%
                                </Text>
                                <Text align="center" size="xs" color="dimmed">
                                    Mood
                                </Text>
                            </Box>
                        }
                    />
                </Box>
            </Box>
        </Card>
    );
};
