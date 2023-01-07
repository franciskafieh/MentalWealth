import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import { MantineProvider } from "@mantine/core";

const MyApp: AppType<{ session: Session | null }> = ({
    // eslint-disable-next-line react/prop-types
    Component,
    // eslint-disable-next-line react/prop-types
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <MantineProvider
                withGlobalStyles={true}
                withNormalizeCSS={true}
                theme={{
                    colorScheme: "light",
                }}
            >
                <Component {...pageProps} />
            </MantineProvider>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
