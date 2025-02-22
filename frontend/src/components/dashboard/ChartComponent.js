import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const defaultData = [
  { month: 'Jan', revenue: 10 },
  { month: 'Feb', revenue: 10 },
  { month: 'Mar', revenue: 10 },
  { month: 'Apr', revenue: 10 },
  { month: 'May', revenue: 45000 },
  { month: 'Jun', revenue: 10000 },
  { month: 'Jul', revenue: 11000 },
  { month: 'Aug', revenue: 10500 },
  { month: 'Sep', revenue: 9000 },
  { month: 'Oct', revenue: 7500 },
  { month: 'Nov', revenue: 8500 },
  { month: 'Dec', revenue: 9500 }
];


export default function ChartComponent() {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Before")
        const response = await fetch("http://localhost:5000/api/data/sales");
        console.log("After")
        const result = await response.json();
        setData(Array.isArray(result) ? result : defaultData);
        console.log(data);
      } catch (error) {
        console.error("Fetch Error:", error);
        setData(defaultData);
      }
    }
    fetchData();
  }, []);

  console.log(data);
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Sales Analytics",
        data: data.map((item) => item.revenue),
        borderColor: "#000",
        backgroundColor: "transparent",
        pointBackgroundColor: "#000",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#000",
        pointRadius: 4,
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#333",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#333",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}