import {
    Button,
    Center,
    Group,
    Input,
    Loader,
    Paper,
    Switch,
    Text,
    Title,
    createStyles,
} from "@mantine/core";
import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";

import { IconInfoCircle } from "@tabler/icons";
import dayjs from "dayjs";
import { showNotification } from "@mantine/notifications";
import { useApiStore } from "../store/apiStore";
import { useAuthToken } from "../hooks/useAuthToken";

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

const Chat = (): JSX.Element => {
    const { classes } = useStyles();
    const accessToken = useAuthToken();
    const user = useApiStore((state) => state.user);

    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [joined, setJoined] = useState<boolean>(false);
    const [waiting, setWaiting] = useState<boolean>(false);

    const [helper, setHelper] = useState<boolean>(false);

    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        (async () => {
            const hubConnection = new HubConnectionBuilder()
                .withUrl("/api/Hubs/Chat", { accessTokenFactory: () => accessToken })
                .configureLogging(LogLevel.Information)
                .build();

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
            connection?.invoke("Leave");
            connection?.stop();
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

    if (joined) {
        return (
            <>
                <Group position="apart">
                    <Title order={1}>Chatting anonymously</Title>
                    <Button
                        variant="outline"
                        onClick={async () => await connection?.invoke("Leave")}
                    >
                        Leave
                    </Button>
                </Group>
                {renderedMessages}
                <Group>
                    <Input
                        value={message}
                        onChange={(event) => setMessage(event.currentTarget.value)}
                        sx={{ flex: 1 }}
                        placeholder="Type a message"
                    />
                    <Button
                        onClick={async () => {
                            await connection?.invoke("SendMessage", message);
                            setMessages((messages) => [
                                ...messages,
                                { message, own: true, date: new Date() },
                            ]);
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
