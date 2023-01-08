import { useMantineTheme } from '@mantine/core';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import { fetcher } from '../utils/fetcher';
import { useQuery } from '@tanstack/react-query';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export const MoodChart = () => {
    const theme = useMantineTheme();

    function getXGridColors() {
        theme.colorScheme === "dark" ? theme.colors.gray[9] : theme.colors.gray[3]
        let colors = [];
        for (let i = 0; i < 6; i++) {
            colors[i] = theme.colorScheme === "dark" ? theme.colors.gray[9] : theme.colors.gray[3];
        }
        
        colors[6] = theme.fn.primaryColor();

        return colors;
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: getXGridColors(),
                }
            },
            y: {
                offset: true,
                min: 1,
                max: 5,
                ticks: {
                    fontColor: "white",
                    stepSize: 1,
                    autoSkip: false,
                },
                grid: {
                    color: theme.colorScheme === "dark" ? theme.colors.gray[9] : theme.colors.gray[3],
                }
            }
        },
    };

    const days = (): dayjs.Dayjs[] => {
        let days = [];
        for (let i = 0; i < 7; i++) {
            days[i] = dayjs().subtract(i, "days");
        }
        return days.reverse();
    }

    const labels = days().map(day => day.format("dddd"));

    const chartData = {
    labels,
    datasets: [
        {
            label: 'Mood',
            data: [],
            borderColor: theme.fn.primaryColor(),
            backgroundColor: theme.fn.primaryColor(),
            lineTension: 0.25,
            pointRadius: 4,
            pointHoverRadius: 8,
        },
    ],
    };
    

const { data, status } = useQuery({
        queryKey: ["JournalEntries"],
        queryFn: () => {
            const journalEntries = fetcher.path("/Journals").method("get").create();
            return journalEntries({});
        }
    });

    if (status === "success") {
        for (const day of days()) {
            const dayAverageMood = data.data.filter(d => dayjs(d.createdAt).isSame(day, "day"))
                                            .map(d => d.moodLevel)
                                            .filter(m => m != 0);

            if (dayAverageMood.length > 0) {
                chartData.datasets[0].data.push(Math.ceil(dayAverageMood.reduce((a, b) => a + b) / dayAverageMood.length));
            } else {
                chartData.datasets[0].data.push(undefined);
            }
        }
    } 


    return <Line options={options} data={chartData} height={100} redraw />;  
}
