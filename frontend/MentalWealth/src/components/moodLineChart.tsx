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
import { Line } from 'react-chartjs-2';

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

const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Yesterday', 'Today'];



export const data = {
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
    data.datasets[0].borderColor = theme.fn.primaryColor();
    data.datasets[0].backgroundColor = theme.fn.primaryColor();
    options.scales.y.grid.color = theme.colorScheme === "dark" ? theme.colors.gray[9] : theme.colors.gray[3];

    let xGridColors = [];

    for (let i = 0; i < 6; i++) {
        xGridColors[i] = theme.colorScheme === "dark" ? theme.colors.gray[9] : theme.colors.gray[3];
    }

    xGridColors[6] = theme.fn.primaryColor();


    options.scales.x.grid.color = xGridColors;

    

    return <Line options={options} data={data} height={100} redraw />;

    
}
