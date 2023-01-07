import { Box, Button, Center, PasswordInput, TextInput, Title, createStyles } from "@mantine/core";
import { getCsrfToken, signIn } from "next-auth/react";
import { useForm, zodResolver } from "@mantine/form";

import { useCallback } from "react";
import { useRouter } from "next/router";
import { z } from "zod";

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

const Signin = (): JSX.Element => {
    const { classes } = useStyles();

    const router = useRouter();

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: zodResolver(z.object({
            email: z.string().email(),
            password: z.string(),
        })),
    });

    const submit = form.onSubmit(async (values) => {
        await signIn("credentials", values);
    });

    const getErrors = useCallback(() => {
        const errors = {
            email: "",
            password: "",
        };

        switch (router.query.error) {
        case "MISSING_CREDENTIALS":
            errors.email = "Please enter your email";
            break;
        case "NOT_FOUND":
            errors.email = "User not found";
            break;
        case "INVALID_PASSWORD":
            errors.password = "Invalid password";
            break;
        default:
            break;
        }

        return errors;
    }, [router]);

    return (
        <Center className={classes.container}>
            <form className={classes.form} onSubmit={submit}>
                <Title order={1} size="h2" align="center" mb="sm">Sign in</Title>

                <TextInput {...form.getInputProps("email")} required={true} label="Email" mb="sm" error={getErrors().email} />
                <PasswordInput {...form.getInputProps("password")} required={true} label="Password" mb="md" error={getErrors().password} />

                <Button type="submit">Sign in</Button>
            </form>
        </Center>
    );
};

export default Signin;
