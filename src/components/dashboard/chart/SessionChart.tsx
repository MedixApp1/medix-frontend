import "./style.scss"
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SessionChart = () => {
	const chartRef = useRef<HTMLCanvasElement | null>(null);

	const createChart = async () => {
		if (!chartRef.current) {
			chartRef.current = null;
		}

		const canvas = chartRef.current!;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// canvas.style.height = canvasHeight + 'px';
		canvas.style.width = '100%';
		const fontFamily = 'Ysabeau, sans-serif';

		new Chart(ctx, {
			type: 'line',
			data: {
				labels: [
					'Day 1',
					'Day 2',
					'Day 3',
					'Day 4',
					'Day 5',
					'Day 6',
					'Day 7',
				],
				datasets: [
					{
						label: 'Questions Answered',
						data: [12, 19, 3, 17, 28, 24, 7],
						fill: false,
						borderColor: 'rgb(75, 192, 192)',
						tension: 0.1,
						pointStyle: 'circle',
						pointRadius: 10,
						pointHoverRadius: 15,
					},
					{
						label: 'Correct Answers',
						data: [9, 10, 2, 17, 23, 24, 5],
						fill: false,
						borderColor: '#ff8989',
						tension: 0.1,
						pointStyle: 'circle',
						pointRadius: 10,
						pointHoverRadius: 15,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
				plugins: {
					title: {
						display: true,
						text: 'Recent Activity', // Your desired title
						align: 'start',
						color: 'black',
						font: {
							family: "Inter",
							size: 17, // Adjust the font size if needed
							weight: 500, // Adjust the font weight if needed
						},
					},
					legend: {
						labels: {
							font: {
								family: 'Ysabeau, sans-serif',
							},
						},
					},
					tooltip: {
						// tooltip options
						titleFont: {
							family: 'Ysabeau, sans-serif',
						},
						bodyFont: {
							family: 'Ysabeau, sans-serif',
						},
					},
				},
				// Default font for the entire chart
				font: {
					family: 'Ysabeau, sans-serif',
				},
			},
		});
	};

	useEffect(() => {
		createChart();
	}, []);

	return (
		<div className="chart">
			<canvas ref={chartRef}></canvas>
		</div>
	);
};

export default SessionChart;
