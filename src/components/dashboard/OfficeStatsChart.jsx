import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '@/components/common';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OfficeStatsChart = ({ officeStats = [], loading }) => {
  const chartData = useMemo(() => {
    const labels = officeStats.slice(0, 10).map(office => office.name);
    const data = officeStats.slice(0, 10).map(office => office.employee_count);

    return {
      labels,
      datasets: [
        {
          label: 'Employees',
          data,
          backgroundColor: 'rgba(22, 163, 74, 0.8)',
          borderColor: 'rgba(22, 163, 74, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [officeStats]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          precision: 0,
        },
      },
    },
  };

  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Employees by Office</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title subtitle="Top 10 offices by employee count">
          Employees by Office
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default OfficeStatsChart;