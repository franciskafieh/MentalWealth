import { Text, Title, createStyles, Loader, Card, SimpleGrid, Center, Group, Space, Anchor, useMantineTheme, Button } from "@mantine/core";
import { fetcher } from "../utils/fetcher";
import { useApiStore } from "../store/apiStore";
import { useQuery } from "@tanstack/react-query";
import { IconDots } from "@tabler/icons";
import { hexToRgb } from "../utils/colors";
import dayjs from "dayjs";
import { MoodChart } from "../components/moodLineChart";
import { HelperHome } from "../components/helperHomePage";
import { UserHome } from "../components/userHomePage";

function getHalfOpacityFromHex(hex: string) {
    const [r, g, b] = hexToRgb(hex);
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
            {/* TODO: ROLES */}
            {useApiStore((state) => state.user).roles.includes("") ? <HelperHome></HelperHome> : <UserHome></UserHome> }
        </>
    );
};

export default Home;