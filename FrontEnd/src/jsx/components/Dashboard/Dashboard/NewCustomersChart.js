import React from "react";
import ReactApexChart from "react-apexcharts";

class NewCustomersChart extends React.Component {
	constructor(props) {
		console.log('props: ', props);
		super(props);
		this.state = {
			// series: [{
			// 	name: 'Net Profit',
			// 	data: [70, 150, 100, 200, 100, 150, 150],
			// }, ],
			series: props.data.pastTwoWeeksIncomeSeries,
			options: {
				chart: {
					type: 'area',
					height: 100,
					width: 156,
					toolbar: {
						show: false,
					},
					zoom: {
						enabled: false
					},
					sparkline: {
						enabled: true
					}
				},
				
				dataLabels: {
				  enabled: false
				},
				legend: {
					show: false,
				},
				colors: ['#16B455'],
				stroke: {
					show: true,
					width: 4,
					curve: 'smooth',
					colors: ['#16B455'],
				},
				
				states: {
					normal: {
						filter: {
							type: 'none',
							value: 0
						}
					},
					hover: {
						filter: {
							type: 'none',
							value: 0
						}
					},
					active: {
						allowMultipleDataPointsSelection: false,
						filter: {
							type: 'none',
							value: 0
						}
					}
				},
				xaxis: {
					categories: 
					props.data.pastTwoWeeksIncomeCategories,
					// ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false
					},
					labels: {
						show: false,
						style: {
							fontSize: '12px',
						}
					},
					crosshairs: {
						show: false,
						position: 'front',
						stroke: {
							width: 1,
							dashArray: 3
						}
					},
					tooltip: {
						enabled: true,
						formatter: undefined,
						offsetY: 0,
						style: {
							fontSize: '12px',
						}
					}
				},
				yaxis: {
					show: false,
				},
				fill: {
					type: 'solid',
					opacity: 0.1,
					colors: '#16B455'
				},
				tooltip: {
					enabled: false,
					style: {
						fontSize: '12px',
					},
					y: {
						formatter: function(val) {
							return "$" + val + " thousands"
						}
					}
				},
				responsive: [{
					breakpoint: 1601,
					options: {
						chart: {
							height: 80,
						},
					}
				}]				
			}, 
		};
	}

	render() {
		return (
			<div id="NewCustomers">
				<ReactApexChart
				  options={this.state.options}
				  series={this.state.series}
				  type="area"
				  height={100} 
				  width={156} 
				/>
			</div>
		);
	}
}

export default NewCustomersChart;