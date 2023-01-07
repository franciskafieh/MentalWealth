import { type NextPage } from "next";

import { api } from "../utils/api";
import { Text } from "@mantine/core";

const Home: NextPage = () => {
    const hello = api.example.hello.useQuery({ text: "from tRPC" });

    if (hello.isLoading) {
        return <Text color="dimmed">Loading...</Text>;
    }

    return (
        <>
            <Text color="dimmed">Test text {hello.data.greeting}</Text>
        </>
    );
};

export default Home;
