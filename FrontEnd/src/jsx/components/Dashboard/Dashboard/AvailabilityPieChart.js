import React from "react";
import ReactApexChart from "react-apexcharts";

class AvailabilityPieChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// series: [45, 80],			
			series: [(props.data?.totalSpaces - props.data?.currentOccupiedSpaces), props.data?.currentOccupiedSpaces],
			options: {
				chart: {
					type: 'donut',
					height: 250
				},
				dataLabels: {
					enabled: false,
				},
				stroke: {
					width: 0,
				},
				colors: ['#717579', 'var(--primary)'],
				legend: {
					position: 'bottom',
					show: false
				},
				responsive: [{
					breakpoint: 1601,
					options: {
						chart: {
							height: 200,
						},
					}
				}, {
					breakpoint: 1024,
					options: {
						chart: {
							height: 200,
						},
					}
				}]

			},
		};
	}

	// static getDerivedStateFromProps(props, state) {
	// 	console.log('AvailabilityPieChart: ', props);


	// 	return {
	// 		series: [(props.data?.totalSpaces - props.data?.currentOccupiedSpaces), props.data?.currentOccupiedSpaces],
	// 	};
	// }

	render() {
		return (
			<div id="pieChart1">
				<ReactApexChart
					options={this.state.options}
					series={this.state.series}
					type="donut"
					height={250}
				/>
			</div>
		);
	}
}

export default AvailabilityPieChart;