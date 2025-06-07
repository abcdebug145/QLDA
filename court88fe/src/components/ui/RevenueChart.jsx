import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/bookings/all');
        const response = await res.json();
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processData = () => {
    if (!data) return null;

    const now = new Date();
    const labels = [];
    const bookingData = [];
    const orderData = [];

    // Tạo labels dựa trên period được chọn
    if (selectedPeriod === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('vi-VN', { weekday: 'short' }));
      }
    } else if (selectedPeriod === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('vi-VN', { day: 'numeric' }));
      }
    }

    // Khởi tạo mảng dữ liệu với giá trị 0
    const bookingRevenue = new Array(labels.length).fill(0);
    const orderRevenue = new Array(labels.length).fill(0);

    // Xử lý dữ liệu booking
    data.bookings.forEach(booking => {
      if (booking.status === 'APPROVED') {
        const bookingDate = new Date(booking.date);
        const diffDays = Math.floor((now - bookingDate) / (1000 * 60 * 60 * 24));
        
        if (selectedPeriod === 'week' && diffDays <= 6) {
          bookingRevenue[6 - diffDays] += booking.total;
        } else if (selectedPeriod === 'month' && diffDays <= 29) {
          bookingRevenue[29 - diffDays] += booking.total;
        }
      }
    });

    // Xử lý dữ liệu order
    data.orders.forEach(order => {
      if (order.status === 'COMPLETED') {
        const orderDate = new Date(order.createdAt);
        const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        
        if (selectedPeriod === 'week' && diffDays <= 6) {
          orderRevenue[6 - diffDays] += order.total;
        } else if (selectedPeriod === 'month' && diffDays <= 29) {
          orderRevenue[29 - diffDays] += order.total;
        }
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Doanh thu sân',
          data: bookingRevenue,
          backgroundColor: '#4e6cf4',
        },
        {
          label: 'Doanh thu shop',
          data: orderRevenue,
          backgroundColor: '#c77dff',
        },
      ],
    };
  };

  const chartData = processData();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê doanh thu',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN') + 'đ';
          }
        }
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</div>;
  }

  const total = chartData && chartData.datasets
    ? chartData.datasets.reduce((sum, dataset) =>
        sum + dataset.data.reduce((a, b) => a + (typeof b === 'number' && !isNaN(b) ? b : 0), 0), 0)
    : 0;

  return (
    <div style={{ padding: '32px', background: '#fff', borderRadius: '16px', minHeight: 400 }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Doanh thu</div>
      <div style={{ fontSize: 32, color: "#1976d2", fontWeight: 700, marginBottom: 16 }}>
        {Number.isFinite(total) ? total.toLocaleString('vi-VN') : 0}đ
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 8 }}>
        <span style={{ color: "#4e6cf4", fontWeight: 600 }}>■ Sân cầu</span>
        <span style={{ color: "#c77dff", fontWeight: 600 }}>■ Phụ kiện</span>
      </div>
      {chartData && <Bar data={chartData} options={options} />}
      <div style={{ textAlign: "right", marginTop: 8, color: "#444" }}>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setSelectedPeriod('week')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: selectedPeriod === 'week' ? '#1976d2' : '#fff',
              color: selectedPeriod === 'week' ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            Tuần
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: selectedPeriod === 'month' ? '#1976d2' : '#fff',
              color: selectedPeriod === 'month' ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            Tháng
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
