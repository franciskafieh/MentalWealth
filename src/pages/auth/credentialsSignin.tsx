import { Box, Button, Center, PasswordInput, TextInput, Title, createStyles } from "@mantine/core";

import { getCsrfToken } from "next-auth/react";

const useStyles = createStyles((theme) => ({
    container: {
        height: "100vh",
    },
    form: {
        display: "flex",
        flexDirection: "column",

        width: "25vw",

        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            width: "35vw",
        },

        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            width: "45vw",
        },

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: "65vw",
        },

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            width: "75vw",
        },
    }
}));

const CredentialsSignin = ({ csrfToken }: { csrfToken: string }): JSX.Element => {
    const { classes } = useStyles();

    return (
        <Center className={classes.container}>
            <form className={classes.form} method="post" action="/api/auth/callback/credentials">
                <Title order={1} size="h2" align="center" mb="sm">Sign in</Title>

                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

                <TextInput name="email" type="email" required={true} label="Email" mb="sm" />
                <PasswordInput name="password" required={true} label="Password" mb="md" />

                <Button type="submit">Sign in</Button>
            </form>
        </Center>
    );
};

export default CredentialsSignin;

export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    };
}
