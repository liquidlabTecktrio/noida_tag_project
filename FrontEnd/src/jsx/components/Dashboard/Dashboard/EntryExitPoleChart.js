import React from "react";
import ReactApexChart from "react-apexcharts";

class EntryExitPoleChart extends React.Component {
  constructor(props) {
    super(props);
    const graphData = props.data;
    console.log("GRAPH", graphData);
    const seriesData =graphData.length>0? graphData[0].series!=null&&graphData[0].series!=undefined
      ? graphData[0].series
      : [
          { name: "entry", data: [] },
          { name: "exit", data: [] },
        ]: [
          { name: "entry", data: [] },
          { name: "exit", data: [] },
        ];

    const timeData =graphData.length>0? graphData[0].time ? graphData[0].time : []:[];
    this.state = {
      //
      series: seriesData,
      options: {
        chart: {
          type: "bar",
          height: 350,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },

        legend: {
          show: true,
          fontSize: "12px",
          fontWeight: 300,

          labels: {
            colors: "black",
          },
          position: "bottom",
          horizontalAlign: "center",
          markers: {
            width: 19,
            height: 19,
            strokeWidth: 0,
            radius: 19,
            strokeColor: "#fff",
            fillColors: ["#f8857d", "#709fba"],
            offsetX: 0,
            offsetY: 0,
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#3e4954",
              fontSize: "14px",
              fontFamily: "Poppins",
              fontWeight: 100,
            },
          },
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          // categories: ["06", "07", "08", "09", "10"],
          categories: timeData,
        },
        fill: {
          colors: ["#f8857d", "#709fba"],
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + " thousands";
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart" className="line-chart-style bar-chart">
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

export default EntryExitPoleChart;
