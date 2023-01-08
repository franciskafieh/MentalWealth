import {
    Button,
    Center,
    Group,
    Input,
    Loader,
    NumberInput,
    Paper,
    Select,
    Switch,
    Text,
    TextInput,
    Title,
    createStyles,
} from "@mantine/core";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import dayjs, { ManipulateType } from "dayjs";
import { closeModal, openModal } from "@mantine/modals";
import { useEffect, useState } from "react";

import { IconInfoCircle } from "@tabler/icons";
import { fetcher } from "../utils/fetcher";
import { showNotification } from "@mantine/notifications";
import { useApiStore } from "../store/apiStore";
import { useAuthToken } from "../hooks/useAuthToken";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import utc from "dayjs/plugin/utc";
import { useStore } from "zustand";

dayjs.extend(utc);

const useStyles = createStyles((theme) => ({
    container: {
        height: "100vh",
        top: 0,
        left: 0,
        right: 0,
        position: "fixed",
        flexDirection: "column",
    },
}));

interface Message {
    message: string;
    date: Date;
    own: boolean;
}

const ShareEntryModalContent = ({ connection }: { connection: HubConnection }): JSX.Element => {
    const entires = useQuery({
        queryKey: ["JournalEntries"],
        queryFn: () => {
            const journalEntries = fetcher.path("/Journals").method("get").create();
            return journalEntries({});
        },
    });

    const form = useForm({
        initialValues: {
            entryId: "",
            expiryAmount: 1,
            expiryUnit: "day",
        },
        validate: {
            entryId: (value) => {
                if (entires.data.data.map((e) => e.id).indexOf(+value) === -1)
                    return "You must select a valid entry";
            },
            expiryAmount: (value) => {
                if (value < 0) return "Expiry amount must be greater than 0";
            },
            expiryUnit: (value) => {
                if (["day", "week", "month", "year"].indexOf(value) === -1)
                    return "Expiry unit must be a valid unit";
            },
        },
    });

    if (entires.isLoading) {
        return <Loader />;
    }

    const entriesData = entires.data.data.map((e) => ({
        label: e.title,
        value: e.id.toString(),
    }));
    
    
    const submit = form.onSubmit(async (values) => {
        connection.invoke("ShareJournalEntry", +values.entryId, dayjs().add(values.expiryAmount, values.expiryUnit as ManipulateType).utc().format())
        const customEvent = new CustomEvent('submittedForm', { detail: { values: values } });
        
        window.dispatchEvent(customEvent);
    });

    return (
        <form onSubmit={submit}>
            <Select label="Entry" {...form.getInputProps("entryId")} data={entriesData} />
            <Group position="apart" mt="sm">
                <NumberInput
                    label="Expiry amount"
                    sx={{ width: 100 }}
                    {...form.getInputProps("expiryAmount")}
                />
                <Select
                    label="Expiry unit"
                    {...form.getInputProps("expiryUnit")}
                    data={[
                        { label: "Days", value: "day" },
                        { label: "Weeks", value: "week" },
                        { label: "Months", value: "month" },
                        { label: "Years", value: "year" },
                    ]}
                />
            </Group>
            <Button type="submit" mt="sm">
                Share
            </Button>
        </form>
    );
};

const Chat = (): JSX.Element => {
    const { classes } = useStyles();
    const accessToken = useAuthToken();

    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [joined, setJoined] = useState<boolean>(false);
    const [waiting, setWaiting] = useState<boolean>(false);

    const [helper, setHelper] = useState<boolean>(false);

    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const hubConnection = new HubConnectionBuilder()
            .withUrl("/api/Hubs/Chat", { accessTokenFactory: () => accessToken })
            .configureLogging(LogLevel.Information)
            .build();

        (async () => {
            hubConnection.on("Joined", () => {
                console.log("Joined");
                setJoined(true);
                setWaiting(false);
                setMessage("");
                setMessages([]);
            });

            hubConnection.on("Left", () => {
                console.log("Left");
                setJoined(false);
                setWaiting(false);
                setMessages([]);
                setMessage("");
                showNotification({
                    title: "Chat ended",
                    color: "orange",
                    icon: <IconInfoCircle />,
                    message: "Either you or your partner left the chat.",
                });
            });

            hubConnection.on("Waiting", () => {
                console.log("Waiting");
                setWaiting(true);
            });

            hubConnection.on("ReceiveMessage", (message: string) => {
                console.log("ReceiveMessage");
                setMessages((messages) => [...messages, { message, own: false, date: new Date() }]);
            });

            try {
                await hubConnection.start();
                console.log("Connected");
                await connection?.invoke("Join");
                setConnection(hubConnection);
            } catch (err) {
                console.error(err);
            }
        })();

        return () => {
            hubConnection.stop();
        };
    }, [accessToken]);

    if (waiting) {
        return (
            <>
                <Group position="apart">
                    <Title order={1}>Waiting for a partner</Title>
                    <Button
                        variant="outline"
                        onClick={async () => await connection?.invoke("Leave")}
                    >
                        Leave
                    </Button>
                </Group>
                <Center className={classes.container} sx={{ zIndex: -1 }}>
                    <Loader variant="bars" size="xl" />
                </Center>
            </>
        );
    }

    const renderedMessages = messages.map((message, index) => (
        <Paper
            key={index}
            sx={(theme) => ({
                backgroundColor: message.own
                    ? theme.colorScheme === "dark"
                        ? theme.colors[theme.primaryColor][9]
                        : theme.colors[theme.primaryColor][6]
                    : theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.colors.gray[0],
            })}
            radius="md"
            p="md"
            my="sm"
        >
            <Text size="sm" color={message.own ? "white" : "dimmed"}>
                {dayjs(message.date).format("HH:mm")}
            </Text>
            <Text size="sm">{message.message}</Text>
        </Paper>
    ));

    const openShareEntryModal = () => {


        openModal({
            title: "Share journal entry",
            children: <ShareEntryModalContent connection={connection} />,
        });

        let entryId: number;


        connection.on("ShareTokenGenerated", async (token: string) => {
            closeModal("Share journal entry");
            console.log("entry id is " + entryId + ". token is " + token);
            
            const shareLink = `${window.location.origin}/journal/${entryId}?token=${token}`;
            
            setMessage(shareLink);
        });

        window.addEventListener('submittedForm', (e: CustomEvent) => entryId = e.detail.values.entryId);
    };

    if (joined) {
        return (
            <>
                <Group position="apart" mb="lg">
                    <Title order={1} sx={{ lineHeight: 0.8 }}>
                        Chatting anonymously
                    </Title>
                    <Group>
                        <Button variant="outline" onClick={() => openShareEntryModal()}>
                            Share journal entry
                        </Button>
                        <Button
                            variant="outline"
                            onClick={async () => await connection?.invoke("Leave")}
                        >
                            Leave
                        </Button>
                    </Group>
                </Group>
                {renderedMessages}
                <Group>
                    <Input
                        value={message}
                        onChange={(event) => setMessage(event.currentTarget.value)}
                        sx={{ flex: 1 }}
                        placeholder="Type a message"
                        id="input-msg"
                    />
                    <Button
                        onClick={async () => {
                            await connection?.invoke("SendMessage", message);
                            setMessages((messages) => [
                                ...messages,
                                { message, own: true, date: new Date() },
                            ]);
                            // reset input box after send
                            setMessage("");
                        }}
                    >
                        Send
                    </Button>
                </Group>
            </>
        );
    }

    return (
        <Center className={classes.container}>
            <Title order={1}>Start a new chat</Title>
            <Group mt="md">
                <Switch
                    label="Join as a helper"
                    checked={helper}
                    labelPosition="left"
                    onChange={(event) => setHelper(event.currentTarget.checked)}
                />
                <Button onClick={async () => await connection?.invoke("Join", helper)}>
                    Start
                </Button>
            </Group>
        </Center>
    );
};

export default Chat;
