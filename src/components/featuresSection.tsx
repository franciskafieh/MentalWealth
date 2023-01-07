import {
    Box,
    Container,
    Paper,
    SimpleGrid,
    Text,
    ThemeIcon,
    Title,
    createStyles,
    useMantineTheme,
} from "@mantine/core";
import { IconBook, IconCookie, IconGauge, IconLifebuoy, IconLink, IconLock, IconMessage2, IconQuestionMark, IconUser, IconUserSearch, TablerIcon } from "@tabler/icons";

export const homeData = [
    {
        icon: IconLifebuoy,
        title: "Help others",
        description:
        "Help others by listening to their problems and giving them advice. You can also help by sharing your own experiences. Whether you want to do this or not is up to you.",
    },
    {
        icon: IconBook,
        title: "Keep your personal journal",
        description:
        "Keep a personal journal of your thoughts and feelings. Add entries anywhere at anytime or even share them with helpers.",
    },
    {
        icon: IconLink,
        title: "Connect with others",
        description:
        "Find others who want to help you. Connect with them and talk about your problems.",
    },
    {
        icon: IconLock,
        title: "Don't worry about your privacy",
        description:
        "Everything you do on MentalWealth is private. We don't store any of your chats and we store journals in an encrypted way.",
    },
    {
        icon: IconUserSearch,
        title: "Be anonymous",
        description:
        "Connect with real people and talk anonimously about your mental health. We don't store any data (not even the messages) about you.",
    },
];

  interface FeatureProps {
    icon: TablerIcon;
    title: React.ReactNode;
    description: React.ReactNode;
  }

export function Feature({ icon: Icon, title, description }: FeatureProps) {
    const theme = useMantineTheme();
    return (
        <Paper sx={{ backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[0] }} radius="md" p="md">
            <ThemeIcon variant="light" color="orange.7" size={40} radius={40}>
                <Icon size={20} stroke={1.5} />
            </ThemeIcon>
            <Text style={{ marginTop: theme.spacing.sm, marginBottom: 7 }}>{title}</Text>
            <Text size="sm" color="dimmed" style={{ lineHeight: 1.6 }}>
                {description}
            </Text>
        </Paper>
    );
}

const useStyles = createStyles((theme) => ({
    title: {
        fontWeight: 900,
        marginBottom: theme.spacing.sm,
        textAlign: "center",

        [theme.fn.smallerThan("sm")]: {
            fontSize: 28,
            textAlign: "left",
        },
    },

    description: {
        textAlign: "center",

        [theme.fn.smallerThan("sm")]: {
            textAlign: "left",
        },
    },
}));

  interface FeaturesGridProps {
    title: React.ReactNode;
    description: React.ReactNode;
    data?: FeatureProps[];
  }

export const FeaturesSection = ({ title, description, data = homeData }: FeaturesGridProps) => {
    const { classes, theme } = useStyles();
    const features = data.map((feature, index) => <Feature {...feature} key={index} />);

    return (
        <Box p="xl">
            <Title className={classes.title}>{title}</Title>

            <Container size={560} p={0}>
                <Text size="sm" className={classes.description} color="dimmed">
                    {description}
                </Text>
            </Container>

            <SimpleGrid
                mt="xl"
                cols={3}
                spacing={theme.spacing.xl}
                breakpoints={[
                    { maxWidth: 980, cols: 2, spacing: "xl" },
                    { maxWidth: 755, cols: 1, spacing: "xl" },
                ]}
            >
                {features}
            </SimpleGrid>
        </Box>
    );
};
