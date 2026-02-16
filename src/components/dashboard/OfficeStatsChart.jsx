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
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();
  const chartData = useMemo(() => {
    const labels = officeStats.slice(0, 10).map(office => office.name);
    const data = officeStats.slice(0, 10).map(office => office.employee_count);

    return {
      labels,
      datasets: [
        {
          label: t('dashboard.employees'),
          data,
          backgroundColor: 'rgba(22, 163, 74, 0.8)',
          borderColor: 'rgba(22, 163, 74, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [officeStats, t]);

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
          <Card.Title>{t('dashboard.employeesByOffice')}</Card.Title>
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
        <Card.Title subtitle={t('dashboard.top10Offices')}>
          {t('dashboard.employeesByOffice')}
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