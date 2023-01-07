import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

import { AppBootstrapProvider } from "./components/appBootstrapProvider";
import { AppRouter } from "./routes/appRouter";
import { BrowserRouter } from "react-router-dom";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import ReactDOM from "react-dom/client";

const App = () => {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: "colorScheme",
        defaultValue: "light"
    });

    const toggleColorScheme = () => {
        setColorScheme(colorScheme === "dark" ? "light" : "dark");
    };

    useHotkeys([["mod+J", () => toggleColorScheme()]]);

    const queryClient = new QueryClient();

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <QueryClientProvider client={queryClient}>
                <MantineProvider
                    theme={{ colorScheme, primaryColor: "orange" }}
                    withGlobalStyles={true}
                    withNormalizeCSS={true}
                >
                    <ModalsProvider>
                        <NotificationsProvider>
                            <AppBootstrapProvider>
                                <AppRouter />
                            </AppBootstrapProvider>
                        </NotificationsProvider>
                    </ModalsProvider>
                </MantineProvider>
            </QueryClientProvider>
        </ColorSchemeProvider>
    );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
