import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Chart } from 'react-chartjs-2';
  
  ChartJS.register(LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);
  
  
  const ValuePropsGraph = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            type: 'bar',
            label: 'Organic Traffic Value ($)',
            data: [5000, 7000, 8000, 9500, 10200, 11000],
            backgroundColor: '#4d93a6aa',
            borderRadius: 5,
            barThickness: 28,
          },
          {
            type: 'line',
            label: 'Organic Traffic (visits)',
            data: [100, 120, 140, 160, 210, 250],
            borderColor: '#25553d',
            backgroundColor: '#25553d',
            tension: 0.4,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
              color: '#e5e7eb',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      };
    
      return (
        <div className="h-[340px] w-full">
          <Chart type="bar" data={data} options={options} />
        </div>
      );
    };
  
  export default ValuePropsGraph;
  