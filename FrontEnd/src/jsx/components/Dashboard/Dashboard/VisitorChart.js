import React from "react";
import ReactApexChart from "react-apexcharts";

class VisitorChart extends React.Component {
	constructor(props) {
		super(props);
		// console.log('VisitorChart 2: ', props);
		this.state = {
			// series: [{
			// 	name: '',
			// 	data: [44, 55, 41, 50, 45]
			// }, {
			// 	name: '',
			// 	data: [13, 23, 20, 15, 25]
			// }],
			series: props.data.entryExitSeries,
			options: {
				chart: {
					type: 'bar',
					height: 350,
					stacked: true,
					toolbar: {
						show: false,
					}
				},
				plotOptions: {
					bar: {
						columnWidth: '45%',
						borderRadius: 8,
					},
				},
				colors: ['var(--primary)', 'var(--primary)', 'var(--primary)', '#717579', '#717579', '#717579', '#717579', '#717579', '#717579'],
				stroke: {
					width: 4,
					colors: ['#fff'],
					curve: 'curve'
				},
				xaxis: {
					show: true,
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false,
					},
					labels: {
						style: {
							colors: '#333',
							fontSize: '13px',
							fontFamily: 'Poppins',
							fontWeight: 300,
							cssClass: 'apexcharts-xaxis-label',
						},
					},
					crosshairs: {
						show: false,
					},
					// categories: ['week 1', 'week 2', 'week 3','week 4','week 5' ],
					categories: props.data.entryExitCategories,

				},
				yaxis: {
					show: true,
					axisBorder: {
						show: false,
					},
					labels: {
						offsetX: -8,
						style: {
							colors: '#333',
							fontSize: '13px',
							fontFamily: 'Poppins',
							fontWeight: 300,
							cssClass: 'apexcharts-yaxis-label',
						},
					},
					crosshairs: {
						show: false,
					},
				},
				grid: {
					borderColor: '#eee'
				},
				toolbar: {
					enabled: false,
				},
				dataLabels: {
					enabled: false
				},
				legend: {
					show: false,
					position: 'bottom',
					offsetY: 0
				},
				fill: {
					opacity: 1
				},
				responsive: [{
					breakpoint: 1600,
					options: {
						chart: {
							height: 300,
						},
						plotOptions: {
							bar: {
								columnWidth: '75%',
							},
						},
					},
				},
				{
					breakpoint: 1600,
					options: {
						chart: {
							height: 300,
						},
						plotOptions: {
							bar: {
								columnWidth: '75%',
							},
						},
					},
				},],
			},
		};
	}

	render() {
		return (
			<div id="columnChart" className="crd-coloum">
				<ReactApexChart
					options={this.state.options}
					series={this.state.series}
					type="bar"
					height={350}

				/>
			</div>
		);
	}
}

export default VisitorChart;