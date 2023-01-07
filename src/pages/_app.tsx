import App, { AppProps } from "next/app";
import { type Session } from "next-auth";
import { useHotkeys } from "@mantine/hooks";
import { SessionProvider, getSession } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { setCookie } from "cookies-next";
import { useState } from "react";

const WrappedApp = (props: AppProps & { colorScheme: ColorScheme, session: Session | null }) => {
    const { Component, pageProps } = props;
    const [cScheme, setCScheme] = useState<ColorScheme>(pageProps.colorScheme);

    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme = value || (pageProps.colorSheme === "dark" ? "light" : "dark");
        setCScheme(nextColorScheme);
        setCookie("mantine-color-scheme", nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
    };

    useHotkeys([
        ["mod+J", () => toggleColorScheme()],
    ]);

    return (
        <ColorSchemeProvider colorScheme={pageProps.colorScheme} toggleColorScheme={toggleColorScheme}>
            <SessionProvider session={pageProps.session}>
                <MantineProvider
                    withGlobalStyles={true}
                    withNormalizeCSS={true}
                    theme={{
                        colorScheme: cScheme,
                    }}
                >
                    <Component {...pageProps} />
                </MantineProvider>
            </SessionProvider>
        </ColorSchemeProvider>
    );
};

WrappedApp.getInitialProps = async (ctx) => {
    const appProps = await App.getInitialProps(ctx);

    appProps.pageProps = {
        colorScheme: ctx.ctx.req.cookies["mantine-color-scheme"] || "light",
        session: await getSession(ctx),
    };

    return appProps;
};

export default api.withTRPC(WrappedApp);
