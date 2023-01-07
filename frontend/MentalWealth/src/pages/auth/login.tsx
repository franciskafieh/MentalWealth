import { Anchor, Box, Button, Center, Checkbox, PasswordInput, Text, TextInput, Title, createStyles } from "@mantine/core";
import { ValidationErrors, camelize, handleFormErrors } from "../../utils/forms";
import { useForm, zodResolver } from "@mantine/form";

import { Link } from "react-router-dom";
import { apiStateHandler } from "../../utils/apiStateHandler";
import { components } from "../../schema";
import { fetcher } from "../../utils/fetcher";
import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

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
    },
    spacedContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
}));

const Signin = (): JSX.Element => {
    const { classes } = useStyles();

    const logIn = useMutation({
        mutationFn: async (values: components["schemas"]["LoginRequest"]) => {
            const logIn = fetcher.path("/Auth/Login").method("post").create();
            return logIn(values);
        }
    })

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            remember: false
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            const res = await logIn.mutateAsync(values);
            apiStateHandler.setAuthToken(res.data.token ?? "");
            apiStateHandler.setUser(res.data.user ?? undefined);
        } catch (err) {
            console.log(err);
            handleFormErrors(err, handleValidationErrors);
        }
    });

    const handleValidationErrors = (errors: ValidationErrors) => {
        for (const validationError in errors) {
            let message = "";
            for (const err of errors[validationError]) {
                message += `${err}\n`;
            }
            form.setFieldError(camelize(validationError), message);
        }
    };

    return (
        <Center className={classes.container}>
            <form className={classes.form} onSubmit={submit}>
                <Title order={1} size="h2" align="center" mb="sm">Log in</Title>

                <TextInput {...form.getInputProps("email")} type="email" required={true} label="Email" mb="sm" />
                <PasswordInput {...form.getInputProps("password")} required={true} label="Password" mb="md" />

                <Box className={classes.spacedContainer}>
                    <Checkbox {...form.getInputProps("remember", { type: "checkbox" })} label="Remember me" />
                    <Button type="submit">Log in</Button>
                    </Box>

                <Text align="center" mt="md">
                    Don&apos;t have an account? <Anchor component={Link} to="/auth/register">Register</Anchor>
                </Text>
                <Anchor component={Link} to="/" align="center">Go back to home screen</Anchor>
            </form>
        </Center>
    );
};

export default Signin;