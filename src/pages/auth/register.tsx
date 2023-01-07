import { Anchor, Box, Button, Center, PasswordInput, Text, TextInput, Title, createStyles } from "@mantine/core";

import Link from "next/link";

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

const Register = (): JSX.Element => {
    const { classes } = useStyles();

    return (<Center className={classes.container}>
        <form className={classes.form}>
            <Title order={1} size="h2" align="center" mb="sm">Register</Title>

            <TextInput required={true} label="Name" mb="sm" />
            <TextInput required={true} label="Email" mb="sm" />
            <PasswordInput required={true} label="Password" mb="sm" />
            <PasswordInput required={true} label="Confirm password" mb="md" />

            <Button type="submit">Register</Button>

            <Text align="center" mt="md">
                Already have an account? <Anchor component={Link} href="/auth/signin">Sign in</Anchor>
            </Text>
        </form>
    </Center>);
};

export default Register;
