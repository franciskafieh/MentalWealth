import { ActionIcon, createStyles, useMantineTheme } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    headerAction: {
        position: "absolute",
        zIndex: 200,
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        bottom: "2rem",
    },
}));

export const ScrollAction = ({ callback }: { callback(): void }): JSX.Element => {
    const { classes } = useStyles();

    const theme = useMantineTheme();

    return (
        <ActionIcon
            className={classes.headerAction}
            onClick={() => callback()}
            size="lg"
            variant="transparent"
            aria-label="Scroll down a page"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-chevrons-down"
                width="52"
                height="52"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke={theme.white}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <polyline points="7 7 12 12 17 7" />
                <polyline points="7 13 12 18 17 13" />
            </svg>
        </ActionIcon>
    );
};
