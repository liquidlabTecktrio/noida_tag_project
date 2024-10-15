import React from "react";
import ReactApexChart from "react-apexcharts";

class GuestActivityChart extends React.Component {
	constructor(props) {
		// console.log('weely: ', props.data);

		// var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

		super(props);
		this.state = {
			// series: [{
			// 	name: 'series1',
			// 	data: [400, 400, 650, 500, 900, 750, 850]
			// }, {
			// 	name: 'series2',
			// 	data: [350, 350, 420, 370, 500, 400, 550]
			// }],
			// series: [
			// 	{
			// 		'name': 'Income',
			// 		data: props.data ? props.data.reverse().map(d => d.details[0].count) : []

			// 	}

			// ],
			series: props.data.series,
			options: {
				chart: {
					height: 300,
					type: 'area',
					toolbar: {
						show: false
					}
				},
				colors: ["var(--primary)", "#ff9d43"],
				dataLabels: {
					enabled: false
				},
				stroke: {
					width: 6,
					curve: 'smooth',
				},
				legend: {
					show: false
				},
				grid: {
					borderColor: '#EBEBEB',
					strokeDashArray: 6,
				},
				markers: {
					strokeWidth: 6,
					hover: {
						size: 15,
					}
				},
				yaxis: {
					labels: {
						offsetX: -12,
						style: {
							colors: '#787878',
							fontSize: '13px',
							fontFamily: 'Poppins',
							fontWeight: 400
						}
					},
				},
				xaxis: {
					// categories: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
					// categories: props.data.reverse().map(d => d.date.split(' ')[0].split('/')[1]),
					categories: props?.data?.categories,
					labels: {
						style: {
							colors: '#787878',
							fontSize: '13px',
							fontFamily: 'Poppins',
							fontWeight: 400
						},
					}
				},
				fill: {
					colors: ["var(--rgba-primary-1)", "#ff9d43"],
					type: "solid",
					opacity: 0.1
				},
				tooltip: {
					x: {
						format: 'dd/MM/yy HH:mm'
					},
				},
			},
		};
	}


	static getDerivedStateFromProps(props, state) {
		// console.log('props: 2 ',  props.data);

		return { series: props.data.series, categories: props.data.categories,};
	}

	render() {
		return (
			<div id="reservationChart" className="reservationChart">
				<ReactApexChart
					options={this.state.options}
					series={this.state.series}
					type="area"
					height={300}
				/>
			</div>
		);
	}
}

export default GuestActivityChart;