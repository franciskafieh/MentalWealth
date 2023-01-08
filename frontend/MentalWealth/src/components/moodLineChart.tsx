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

export const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        x: {
            grid: {
                color: ["#000000"],
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
                color: "#000000",
            }
        }
    },
};

const labels = [
                dayjs().subtract(6, "days").format("dddd"), 
                dayjs().subtract(5, "days").format("dddd"),
                dayjs().subtract(4, "days").format("dddd"),
                dayjs().subtract(3, "days").format("dddd"),
                dayjs().subtract(2, "days").format("dddd"),
                'Yesterday',
                'Today'
            ];


const { data } = useQuery({
        queryKey: ["JournalEntries"],
        queryFn: () => {
            const journalEntries = fetcher.path("/Journals").method("get").create();
            return journalEntries({});
        }
    });

if (data) {
    data.data.sort((a, b) => Number.parseInt(b.createdAt) - Number.parseInt(a.createdAt)
    data.data[0].id
}



export const chartData = {
  labels,
  datasets: [
    {
        label: 'Mood',
        data: [1, 5, 3, 2, 5, 3, 4], // calc avg of moods on all days and divide by 5. 0 = no data, so display undefined
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(0, 0, 0)',
        lineTension: 0.25,
        pointRadius: 4,
        pointHoverRadius: 8,
    },
  ],
};


export const MoodChart = () => {
    const theme = useMantineTheme();
    chartData.datasets[0].borderColor = theme.fn.primaryColor();
    chartData.datasets[0].backgroundColor = theme.fn.primaryColor();
    options.scales.y.grid.color = theme.colorScheme === "dark" ? theme.colors.gray[9] : theme.colors.gray[3];

    let xGridColors = [];

    for (let i = 0; i < 6; i++) {
        xGridColors[i] = theme.colorScheme === "dark" ? theme.colors.gray[9] : theme.colors.gray[3];
    }

    xGridColors[6] = theme.fn.primaryColor();


    options.scales.x.grid.color = xGridColors;

    

    return <Line options={options} data={chartData} height={100} redraw />;

    
}
