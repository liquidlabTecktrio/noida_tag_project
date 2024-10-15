import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tab, Nav, Dropdown, Modal } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { Redirect } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";

import {
  Row,
  Col,
  Card,
  Popover,
  Tooltip,
  OverlayTrigger,
  Button,
} from "react-bootstrap";

//Import Components
import { ThemeContext } from "../../../context/ThemeContext";
import RoomsSlider from "./Dashboard/RoomsSlider";

import axios from "axios";
import config from "../../../services/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseMedical } from "@fortawesome/free-solid-svg-icons";
import Android_POS_Machine from "../../../images/Android-POS-Machine.jpg";
import close_png from "../../../images/close..png";
import right_png from "../../../images/right.jpg";

const WS_URL = "ws://127.0.0.1:8000";

const AvailabilityPieChart = loadable(() =>
  pMinDelay(import("./Dashboard/AvailabilityPieChart"), 1000)
);
const VisitorChart = loadable(() =>
  pMinDelay(import("./Dashboard/VisitorChart"), 1000)
);
// const GuestActivityChart = loadable(() =>
// 	pMinDelay(import("./Dashboard/GuestActivityChart"), 1000)
// );
// const NewCustomersChart = loadable(() =>
// 	pMinDelay(import("./Dashboard/NewCustomersChart"), 1000)
// );

// const IncomeChart = loadable(() =>
// 	pMinDelay(import("./Dashboard/IncomeChart.js"), 1000)
// );

const EntryExitPointChart = loadable(() =>
  pMinDelay(import("./Dashboard/EntryExitPointChart"), 1000)
);
const EntryExitPoleChart = loadable(() =>
  pMinDelay(import("./Dashboard/EntryExitPoleChart"), 1000)
);

const Home = () => {
  const { changeBackground } = useContext(ThemeContext);

  const [alertWS, setAlertWS] = useState({ isShowAlert: false });
  useEffect(() => {
    changeBackground({ value: "light", label: "Light" });
    getdashboardAPI();
  }, []);

  // const [seriesData, setSeriesData] = useState([]);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    onMessage: (message) => {
      // console.log('message: ', JSON.parse(message.data));

      const dashboardData = JSON.parse(message.data);
      console.log("dashboardData web socket: ", dashboardData);

      setAlertWS(dashboardData);

      // setShowGraph(false)
      // setDashboardData(dashboardData)
      // if (dashboardData?.parkings?.filter(p => p._id == currentParkingIdForGraph)?.length > 0) {
      // 	let data = dashboardData?.parkings?.filter(p => p._id == currentParkingIdForGraph)[0]?.graphData
      // 	data.totalSpaces = dashboardData?.parkings?.filter(p => p._id == currentParkingIdForGraph)[0]?.totalSpaces
      // 	data.currentOccupiedSpaces = dashboardData?.parkings?.filter(p => p._id == currentParkingIdForGraph)[0]?.currentOccupiedSpaces

      // 	setIncomeGraphData(data)
      // 	setGraphPeried('week')
      // 	setCallGraph(false)
      // }

      // setShowDashboard(true)
      // setShowGraph(true)
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  let width = window.innerWidth;

  // const loggedInClientId = sessionStorage.getItem("id");
  const [dashboardData, setDashboardData] = useState({});
  // const [parkingsList, setParkingsList] = useState([]);
  const [period, setGraphPeried] = useState("week");
  const [showGraph, setShowGraph] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [callGraph, setCallGraph] = useState(true);
  const [DashboardReady, setDashboardReady] = useState(false);

  const [incomeGraphData, setIncomeGraphData] = useState({});
  const [currentParkingIdForGraph, setCurrentParkingIdForGraph] = useState("");
  console.log("nx", sessionStorage.getItem("token"));

  // poll graph noida hooks
  const [pointChart, setPointChart] = useState({});
  const [poleChart, setPoleChart] = useState({});

  function getdashboardAPI() {
    var dashboardDate = new Date();
    var dashboardDay = String(dashboardDate.getDate()).padStart(2, "0");
    var dashboardMonth = String(dashboardDate.getMonth() + 1).padStart(2, "0");
    var dashboardYear = dashboardDate.getFullYear();
    const dbDate = dashboardYear + "-" + dashboardMonth + "-" + dashboardDay;

    axios({
      url: config.baseUrl + "createPollGraph",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        token: sessionStorage.getItem("token"),
      },
      data: { date: dbDate },
    })
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          setPointChart(res.data.data);
          // console.log("pointChart", pointChart);
          // // setDashboardData(res.data.data);

          // if (res.data.data.parkings.length > 0) {
          //   setCurrentParkingIdForGraph(res.data.data.parkings[0]._id);
          //   let data = res.data.data.parkings[0].graphData;
          //   data.totalSpaces = res.data.data.parkings[0].totalSpaces;
          //   data.currentOccupiedSpaces =
          //     res.data.data.parkings[0].currentOccupiedSpaces;
          //   setIncomeGraphData(data);
          //   setShowGraph(true);
          // }

          // setShowDashboard(true);
          // setDashboardReady(true);
        } else if (res.status == 201) {
          // console.log(res.data);
        } else if (res.status == 401) {
          alert(
            "You are unauthorized or your session is expired... please login again to continue"
          );
        }
      })
      .catch((err) => {
        if (err.response?.data?.status == 401) {
          // alert("you are unauthorized.. please login to continue");
          // window.location = '/page-login'
          // sessionStorage.removeItem('ClientName'); sessionStorage.removeItem('clientadminlogin'); sessionStorage.removeItem('token'); sessionStorage.removeItem('id');
          // sessionStorage.removeItem('ClientImgUrl');
        }
      });
  }

  function updateCurrentParkingIdForGraph(parkingId) {
    setShowGraph(false);
    setDashboardReady(false);
    setCurrentParkingIdForGraph(parkingId);
    getParkingDataForGraphAPI(parkingId);
  }

  useEffect(() => {
    setShowGraph(false);
    setDashboardReady(false);
    if ((currentParkingIdForGraph != "") & callGraph) {
      // getParkingDataForGraphAPI(currentParkingIdForGraph)
    }
  }, [period]);

  function getParkingDataForGraphAPI(parkingId) {
    axios({
      url: config.baseUrl + "getParkingDataForGraph",
      method: "POST",
      headers: {
        token: sessionStorage.getItem("token"),
      },
      data: { parkingId, period },
    })
      .then((res) => {
        if (res.status == 200) {
          setIncomeGraphData(res.data.data);
          setShowGraph(true);
          setDashboardReady(true);
        } else if (res.status == 201) {
          console.log(res.data);
        } else if (res.status == 401) {
          alert(
            "You are unauthorized or your session is expired... please login again to continue"
          );
        }
      })
      .catch((err) => {
        if (err.response.data.status == 401) {
          // alert("you are unauthorized.. please login to continue");
          // window.location = '/page-login'
          // sessionStorage.removeItem('ClientName'); sessionStorage.removeItem('clientadminlogin'); sessionStorage.removeItem('token'); sessionStorage.removeItem('id');
          // sessionStorage.removeItem('ClientImgUrl');
        }
      });
  }

  let bgColos = [
    "widget-twitter",
    "widget-googleplus",
    "widget-linkedin",
    "widget-facebook",
    "widget-twitter",
    "widget-googleplus",
    "widget-linkedin",
    "widget-facebook",
    "widget-twitter",
    "widget-googleplus",
    "widget-linkedin",
    "widget-facebook",
    "widget-twitter",
    "widget-googleplus",
    "widget-linkedin",
    "widget-facebook",
  ];
  let bgBootstrapColors = [
    "bg-primary",
    "bg-info",
    "bg-secondary",
    "bg-danger",
    "bg-warning",
  ];

  return (
    <>
      <Modal className="modal fade" show={alertWS.isShowAlert}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Alert</h5>
            <Button
              variant=""
              type="button"
              className="btn-close"
              data-dismiss="modal"
              onClick={() => {
                setAlertWS({ isShowAlert: false });
              }}
            ></Button>
          </div>
          <div className="modal-body">
            <form className="comment-form" onSubmit={(e) => {}}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group mb-3">
                    <h3 style={{ color: "red" }}>{alertWS.message ?? ""}</h3>
                    {alertWS.terminalName != null &&
                    alertWS.terminalName != undefined &&
                    alertWS.terminalName != "" ? (
                      <h3>{`Terminal Name: ${alertWS.terminalName ?? ""}`}</h3>
                    ) : (
                      <></>
                    )}
                    {alertWS.vehicleNo != null &&
                    alertWS.vehicleNo != undefined &&
                    alertWS.vehicleNo != "" ? (
                      <h3>
                        {alertWS.vehicleNo != null &&
                        alertWS.vehicleNo != undefined &&
                        alertWS.vehicleNo != ""
                          ? `Vehicle Number: ${alertWS.vehicleNo ?? ""}`
                          : ""}
                      </h3>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <div className="row">
        <div className="col-xl-12">
          <>
            <div className="row">
              <div className="col-xl-12">
                <div className="card h-auto">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                        <div className="income-data d-flex align-items-center justify-content-xl-start justify-content-between mb-xl-0 mb-3">
                          <span className=" income-icon style-1 me-4">
                            <svg
                              width="30"
                              height="30"
                              viewBox="0 0 30 30"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20.4764 0.97345C20.4255 0.974639 20.3747 0.978331 20.3241 0.984696C19.9555 1.02962 19.6167 1.20961 19.3732 1.48989C19.1297 1.77018 18.9988 2.13096 19.0057 2.50219V29.4991C19.0077 29.8041 19.1026 30.1012 19.2778 30.3509C19.453 30.6006 19.7001 30.7909 19.9862 30.8966C20.2723 31.0022 20.5838 31.0183 20.8792 30.9424C21.1746 30.8665 21.4398 30.7023 21.6395 30.4718L30.6425 19.9748C30.7704 19.8249 30.8676 19.6513 30.9284 19.4639C30.9893 19.2765 31.0126 19.079 30.9971 18.8825C30.9816 18.6861 30.9276 18.4946 30.8381 18.319C30.7486 18.1435 30.6254 17.9875 30.4755 17.8595C30.3257 17.7316 30.1521 17.6344 29.9647 17.5735C29.7773 17.5127 29.5797 17.4893 29.3833 17.5048C29.1869 17.5204 28.9954 17.5745 28.8199 17.664C28.6443 17.7535 28.4882 17.8766 28.3602 18.0265L21.994 25.4444V2.50219C21.9976 2.30152 21.9608 2.10206 21.8859 1.91585C21.811 1.72965 21.6995 1.56043 21.5579 1.41809C21.4164 1.27576 21.2478 1.16328 21.062 1.08729C20.8763 1.01131 20.6771 0.973336 20.4764 0.975699L20.4764 0.97345ZM11.453 1.00736C11.2441 1.01319 11.0388 1.0627 10.8501 1.15252C10.6614 1.24234 10.4935 1.37054 10.3573 1.52899L1.3661 12.026C1.22021 12.1722 1.10608 12.3469 1.03084 12.5392C0.955604 12.7315 0.920883 12.9374 0.928852 13.1437C0.936821 13.3501 0.98731 13.5526 1.07716 13.7385C1.167 13.9245 1.29427 14.0897 1.45099 14.2242C1.60771 14.3587 1.79051 14.4595 1.98794 14.52C2.18537 14.5806 2.39318 14.5997 2.59835 14.5763C2.80352 14.5528 3.00163 14.4871 3.18029 14.3835C3.35895 14.2799 3.51429 14.1407 3.6366 13.9743L10.0028 6.55623V29.4988C9.99838 29.6986 10.0339 29.8972 10.1073 30.0831C10.1807 30.2689 10.2905 30.4383 10.4302 30.5812C10.5699 30.724 10.7368 30.8374 10.921 30.9149C11.1052 30.9924 11.303 31.0324 11.5028 31.0324C11.7026 31.0324 11.9005 30.9924 12.0847 30.9149C12.2689 30.8374 12.4357 30.724 12.5754 30.5812C12.7152 30.4383 12.8249 30.2689 12.8983 30.0831C12.9717 29.8972 13.0072 29.6986 13.0028 29.4988V2.50167C13.0021 2.30093 12.9611 2.10237 12.8823 1.91775C12.8035 1.73314 12.6884 1.56607 12.5439 1.42674C12.3993 1.28741 12.2283 1.17853 12.041 1.1065C11.8536 1.03447 11.6536 1.00089 11.453 1.00753V1.00736Z"
                                fill="#fff"
                              />
                            </svg>
                          </span>
                          <div>
                            <h2 className="font-w600 mb-0 income-value">
                              {pointChart[0]?.totalTransaction}
                            </h2>
                            <span className=" fs-6 font-w500">
                              Total Transactions
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                        <div className="d-flex align-items-end justify-content-xl-start justify-content-between mb-xl-0 mb-3">
                          {/* {showDashboard ?
														<NewCustomersChart data={dashboardData} />
														: ''} */}
                          <div className=" ms-3">
                            <h6 className="fs-18 font-w600 mb-0">
                              { console.log("pointChart", pointChart[0])}
                              {
                                // showDashboard
                                //   ?
                                
                                pointChart[0]!=null&&pointChart[0]!=undefined?
                                pointChart[0] ?.totalTransactionLast7DaysAndToday[0]!=null&&   pointChart[0] ?.totalTransactionLast7DaysAndToday[0]!=undefined?
                                pointChart[0] ?.totalTransactionLast7DaysAndToday[0].totalTransactions:0:0
                                // : ""
                              }
                              <span
                                style={{
                                  color: "#717579",
                                  paddingLeft: "5px",
                                  fontWeight: "100",
                                  fontSize: "14px",
                                }}
                              >
                                Entry/Exit Activities
                              </span>
                            </h6>

                            <span className="fs-14 font-w400">
                              for last 7 days
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                        <div className="card trading mb-sm-0 mb-3">
                          <div className="card-body">
                            <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2 ps-lg-0">
                              <div>
                                <h3 className="font-w600 fs-2 mb-0 text-white">
                                  {pointChart[0]?.totalCustomers}
                                </h3>
                                <span className="fs-6 font-w500 text-white">
                                  Total Customers
                                </span>
                              </div>
                              <span className="income-icon style-2">
                                <svg
                                  width="34"
                                  height="24"
                                  viewBox="0 0 34 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M33.5 22.5C33.5 22.8978 33.342 23.2793 33.0607 23.5606C32.7794 23.8419 32.3978 24 32 24H14C13.6022 24 13.2206 23.8419 12.9393 23.5606C12.658 23.2793 12.5 22.8978 12.5 22.5C12.5 20.113 13.4482 17.8238 15.136 16.136C16.8239 14.4482 19.1131 13.5 21.5 13.5H24.5C26.8869 13.5 29.1761 14.4482 30.864 16.136C32.5518 17.8238 33.5 20.113 33.5 22.5ZM23 0C21.8133 0 20.6533 0.351893 19.6666 1.01118C18.6799 1.67047 17.9108 2.60754 17.4567 3.7039C17.0026 4.80025 16.8838 6.00665 17.1153 7.17053C17.3468 8.33442 17.9182 9.40352 18.7574 10.2426C19.5965 11.0817 20.6656 11.6532 21.8295 11.8847C22.9933 12.1162 24.1997 11.9974 25.2961 11.5433C26.3925 11.0891 27.3295 10.3201 27.9888 9.33341C28.6481 8.34672 29 7.18668 29 5.99999C29 4.4087 28.3679 2.88257 27.2426 1.75736C26.1174 0.63214 24.5913 0 23 0ZM9.5 0C8.31331 0 7.15327 0.351893 6.16658 1.01118C5.17988 1.67047 4.41085 2.60754 3.95672 3.7039C3.5026 4.80025 3.38378 6.00665 3.61529 7.17053C3.8468 8.33442 4.41824 9.40352 5.25736 10.2426C6.09647 11.0817 7.16557 11.6532 8.32946 11.8847C9.49334 12.1162 10.6997 11.9974 11.7961 11.5433C12.8925 11.0891 13.8295 10.3201 14.4888 9.33341C15.1481 8.34672 15.5 7.18668 15.5 5.99999C15.5 4.4087 14.8679 2.88257 13.7426 1.75736C12.6174 0.63214 11.0913 0 9.5 0ZM9.5 22.5C9.49777 20.9244 9.80818 19.364 10.4133 17.9093C11.0183 16.4545 11.9061 15.1342 13.025 14.025C12.1093 13.6793 11.1388 13.5014 10.16 13.5H8.84C6.62931 13.504 4.5103 14.3839 2.94711 15.9471C1.38391 17.5103 0.503965 19.6293 0.5 21.84V22.5C0.5 22.8978 0.658035 23.2793 0.93934 23.5606C1.22064 23.8419 1.60218 24 2 24H9.77C9.59537 23.519 9.50406 23.0117 9.5 22.5Z"
                                    fill="#FFFFFF"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                        <div className="card booking mb-0">
                          <div
                            className="card-body "
                            style={{ padding: "1.375rem" }}
                          >
                            <div className="widget-stat income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
                              <div>
                                <h3 className="font-w600 fs-2 mb-0">
                                  {
                                    pointChart[0]?.todaysCount[0]
                                      ?.todaystransactions
                                  }
                                </h3>
                                <span className="fs-6 font-w500">
                                  Today's Entry/Exit Count
                                </span>
                              </div>
                              <div className="media ai-icon ">
                                <span className="me-3 me-3 bgl-primary text-primary">
                                  <svg
                                    id="icon-database-widget"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-database"
                                  >
                                    <ellipse
                                      cx="12"
                                      cy="5"
                                      rx="9"
                                      ry="3"
                                    ></ellipse>
                                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {dashboardData?.parkings?.length > 0 ? (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-sm-0 mb-2">
                    <h2 className="font-w500">Current Parkings</h2>
                    <div className="swiper-pagination style-1 room-swiper-pagination"></div>
                  </div>

                  <div className="row d-flex flex-nowrap overflow-auto">
                    {dashboardData?.parkings.map((p, i) => {
                      const shadow =
                        p._id == currentParkingIdForGraph
                          ? "svg-shadow shadow-danger shadow-lg border-0"
                          : "";
                      // const transform = p._id == currentParkingIdForGraph ? '1,1' : '0,0'
                      const padding =
                        p._id == currentParkingIdForGraph ? "" : "p-2";
                      return (
                        <>
                          <div
                            className={"col-xl-3 col-xxl-3 col-sm-6 " + padding}
                            // style={{'transform': 'scale('+transform+');'}}
                          >
                            <div className={"card overflow-hidden " + shadow}>
                              <Link
                                to="#"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateCurrentParkingIdForGraph(p._id);
                                }}
                              >
                                <div
                                  className={
                                    "social-graph-wrapper " + bgColos[i]
                                  }
                                >
                                  <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2 ps-lg-0">
                                    <i className="fas fa-parking fa-5x"></i>
                                    <div>
                                      <h6 className="font-w600 fs-4 mb-0 text-white">
                                        {p.parkingName.toUpperCase()} -{" "}
                                        {p.parkingNo}
                                      </h6>
                                      <span className="fs-6 font-w500 text-white">
                                        {p.address}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Link>

                              <div className="row">
                                <div className="col-4 border-right">
                                  <div className="pt-3 pb-3 ps-0 pe-0 text-center">
                                    <h4 className="m-1">
                                      <span className="counter">
                                        {p.totalSpaces}
                                      </span>
                                    </h4>
                                    <p className="m-0">Spaces</p>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="pt-3 pb-3 ps-0 pe-0 text-center">
                                    <h4 className="m-1">
                                      <span className="counter">
                                        {p.totalSpaces -
                                          p.currentOccupiedSpaces}
                                      </span>
                                    </h4>
                                    <p className="m-0">Available</p>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="pt-3 pb-3 ps-0 pe-0 text-center">
                                    <h4 className="m-1">
                                      <span className="counter">
                                        {p.currentOccupiedSpaces}
                                      </span>
                                    </h4>
                                    <p className="m-0">Occupied</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              ) : (
                ""
              )}

              {/* {dashboardData?.parkings?.filter(p => p._id == currentParkingIdForGraph)[0]?.graphData?.posHeartbeats?.length > 0 ? (
								<>

									<div className="d-flex align-items-center justify-content-between mb-sm-0 mb-2">
										<h2 className="font-w500">Active POS Devices</h2>
										<div className="swiper-pagination style-1 room-swiper-pagination"></div>
									</div>

									<div className="row d-flex flex-nowrap overflow-auto">

										{dashboardData?.parkings?.filter(p => p._id == currentParkingIdForGraph)[0]?.graphData?.posHeartbeats?.map((p, i) => {
											const shadow = p._id == currentParkingIdForGraph ? 'svg-shadow shadow-danger shadow-lg border-0' : ''
											const padding = p._id == currentParkingIdForGraph ? '' : 'p-2'
											const bgColor = p.isAlive ? "bg-info" : "bg-warning"
											const border = !p.isActive ? "border  border-warning" : p.isAlive ? "border  border-success" : "border  border-danger"
											// const color = p.isAlive ? "text-white" : "text-dark"
											const color = !p.isActive ? "text-warning" : p.isAlive ? "text-success" : "text-danger"

											const placement = 'Bottom'
											return (

												<>
													<div className={"col-xl-2 col-xxl-2 col-sm-4 p-2"}
													>
														<div className={"widget-stat card shadow" + border}>
															<div className="card-header border-0 pb-0 flex-column ">
																<div className="d-flex justify-content-around align-items-center">

																	{p.isActive ?
																		<>
																			<h3 className={"card-title " + color}>{p.opretorName.toUpperCase()} - {p.opretorNo}
																			</h3>

																			<OverlayTrigger
																				trigger="click"
																				// trigger="focus"
																				key={i}
																				placement={
																					width < 1300 && width > 700
																						? placement === "Left"
																							? "right"
																							: placement.toLowerCase()
																						: width < 700
																							? placement === "Right"
																								? "top"
																								: width < 385
																									? placement === "Left"
																										? "bottom"
																										: placement.toLowerCase()
																									: placement.toLowerCase()
																							: placement.toLowerCase()
																				}
																				responsive={true}
																				overlay={
																					<Tooltip className='toltip-popover'
																						id={`popover-positioned-${placement.toLowerCase()}`}
																					>
																						<h3 className='popover-header'>Opretor Contacts</h3>
																						<strong><p className='p-2'><i class="fa fa-mobile-alt" aria-hidden="true"></i> {p.mobileNo} <br></br>
																							<i class="fa fa-envelope" aria-hidden="true"></i> {p.opretorEmail}</p></strong>

																					</Tooltip>
																				}
																				rootClose
																			>
																				<i class="fa fa-info-circle mx-2" aria-hidden="true"></i>
																			</OverlayTrigger>
																		</>
																		: ''}

																</div>

																<span className={"fs-6 font-w400 " + color}>{p.parkingName}</span>
															</div>
															<div className={"card-body text-center " + color} >

																{p.isAlive ?
																	// <svg
																	// 	id="rocket-icon"
																	// 	className="text-success"
																	// 	viewBox="0 0 35 35"
																	// 	width="80"
																	// 	height="80"
																	// 	stroke="currentColor"
																	// 	strokeWidth="1"
																	// 	fill="none"
																	// 	strokeLinecap="round"
																	// 	strokeLinejoin="round"
																	// >
																	// 	<path d="M23.44,25a1.25,1.25,0,0,1-.83-.32,7.73,7.73,0,0,0-10.22,0,1.25,1.25,0,1,1-1.65-1.87,10.21,10.21,0,0,1,13.52,0A1.25,1.25,0,0,1,23.44,25Z" />
																	// 	<path d="M28.5,19.27a1.24,1.24,0,0,1-.92-.4,13.69,13.69,0,0,0-20.16,0,1.25,1.25,0,0,1-1.84-1.69,16.19,16.19,0,0,1,23.84,0,1.25,1.25,0,0,1-.07,1.76A1.26,1.26,0,0,1,28.5,19.27Z" />
																	// 	<path d="M1.5,13.63a1.19,1.19,0,0,1-.83-.32,1.24,1.24,0,0,1-.1-1.76,22.72,22.72,0,0,1,33.86,0,1.25,1.25,0,0,1-1.86,1.67,20.22,20.22,0,0,0-30.14,0A1.27,1.27,0,0,1,1.5,13.63Z" />
																	// 	<path d="M17.5,31a1.25,1.25,0,0,0,0-2.5,1.25,1.25,0,0,0,0,2.5Z" />


																	// </svg>
																	<>
																		<img className="img-fluid" src={Android_POS_Machine} alt="" />
																		<img className="" src={right_png} alt="" height={90} style={{ 'position': 'absolute', 'transform': 'translate(-80px, 60px)' }} />
																	</>
																	:
																	// <svg

																	// 	id="rocket-icon"
																	// 	className="text-danger"
																	// 	viewBox="0 0 52 52"
																	// 	width="80"
																	// 	height="80"
																	// 	stroke="currentColor"
																	// 	strokeWidth="2"
																	// 	fill="none"
																	// 	strokeLinecap="round"
																	// 	strokeLinejoin="round"
																	// 	xmlSpace="preserve"
																	// >
																	// 	<g>
																	// 		<path d="M34.7,36.1c0.5-0.5,0.5-1.3,0-1.8l-1.8-1.8c-0.5-0.5-1.3-0.5-1.8,0l-4.4,4.4c-0.3,0.3-0.9,0.3-1.2,0 l-4.4-4.4c-0.5-0.5-1.3-0.5-1.8,0l-1.8,1.8c-0.5,0.5-0.5,1.3,0,1.8l4.4,4.4c0.3,0.3,0.3,0.9,0,1.2l-4.4,4.4c-0.5,0.5-0.5,1.3,0,1.8 l1.8,1.8c0.5,0.5,1.3,0.5,1.8,0l4.4-4.4c0.3-0.3,0.9-0.3,1.2,0l4.4,4.4c0.5,0.5,1.3,0.5,1.8,0l1.8-1.8c0.5-0.5,0.5-1.3,0-1.8 l-4.4-4.4c-0.3-0.3-0.3-0.9,0-1.2L34.7,36.1z" />
																	// 		<path d="M47.7,11.6c-5.5-6.1-13.3-9.5-21.6-9.5S10,5.5,4.5,11.6C4.1,12,4.2,12.7,4.6,13l3,2.6C8,16,8.6,15.9,9,15.5 c4.4-4.7,10.6-7.4,17.1-7.4s12.7,2.7,17.1,7.4c0.4,0.4,1,0.4,1.4,0.1l3-2.6C48,12.6,48.1,12,47.7,11.6z" />
																	// 		<path d="M26.1,16.1c-4.2,0-8.2,1.8-11,5c-0.4,0.4-0.3,1.1,0.1,1.5l3.2,2.4c0.4,0.3,1,0.3,1.3-0.1 c1.7-1.8,4-2.8,6.4-2.8s4.7,1,6.3,2.7c0.3,0.4,0.9,0.4,1.3,0.1l3.2-2.4c0.5-0.4,0.5-1,0.1-1.5C34.3,17.9,30.3,16.1,26.1,16.1z" />
																	// 	</g>
																	// </svg>
																	<>
																		<img className="img-fluid" src={Android_POS_Machine} alt="" />
																		<img className="" src={close_png} alt="" height={60} style={{ 'position': 'absolute', 'transform': 'translate(-70px, 80px)' }} />
																	</>


																}

																<div className="pt-3 ps-0 pe-0 text-center">
																	{p.isActive ?

																		<div className='d-flex flex-column'>
																			<span className="m-0">Logged in : </span>
																			<span className="fs-6 font-w500 counter">{p.loginTime}</span>
																		</div>
																		: ""}
																	<div className='d-flex flex-column mt-2'>
																		<span className="m-0">Last Connected : </span>
																		<span className="fs-6 font-w500 counter">{p.lastUpdated}</span>
																	</div>
																</div>
															</div>
														</div>
													</div>


												</>

											)
										})}
									</div>
								</>
							) : ''} */}
            </div>
            <div className="row">
              {/* <div className="col-xl-6">
								<div className="card">
									<Tab.Container defaultActiveKey="Weekly">
										<div className="card-header border-0 pb-0 flex-wrap">
											<h3 className="mb-1">Parking Income</h3>
											<div className="card-action coin-tabs mt-3 mt-sm-0">
												<Nav as="ul" className="nav nav-tabs" role="tablist">
													<Nav.Item as="li" className="nav-item">
														<Nav.Link className="nav-link" eventKey="ThreeMonths" onClick={() => { setCallGraph(true); setGraphPeried('threeMonths') }}>Last 3 Months</Nav.Link>
													</Nav.Item>
													<Nav.Item as="li" className="nav-item">
														<Nav.Link className="nav-link" eventKey="Month" onClick={() => { setCallGraph(true); setGraphPeried('month') }}>This Month</Nav.Link>
													</Nav.Item>
													<Nav.Item as="li" className="nav-item">
														<Nav.Link className="nav-link" eventKey="Weekly" onClick={() => { setCallGraph(true); setGraphPeried('week') }}>Last 7 Days</Nav.Link>
													</Nav.Item>
													<Nav.Item as="li" className="nav-item">
														<Nav.Link className="nav-link" eventKey="Day" onClick={() => { setCallGraph(true); setGraphPeried('day') }}>Today</Nav.Link>
													</Nav.Item>
												</Nav>
											</div>
										</div>
										<div className="card-body pb-2">
											<div className="d-flex align-items-center mb-5">
												<div className="d-flex align-items-center flex-lg-wrap me-5 flex-wrap">
													<span className="me-3 d-flex align-items-center">
														<svg className="me-2" width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
															<rect y="0.716797" width="12" height="12" rx="4" fill="var(--primary)" />
														</svg>
														Entry
													</span>
													<h4 className="mb-0">{incomeGraphData.totalEntries} Parkings</h4>
												</div>
												<div className="d-flex align-items-center flex-lg-wrap flex-wrap">
													<span className=" squre me-3 d-flex align-items-center">
														<svg className="me-2" width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
															<rect y="0.716797" width="12" height="12" rx="4" fill="#ff9d43" />
														</svg>
														Exit
													</span>
													<h4 className="mb-0">{incomeGraphData.totalExits} Parkings</h4>
												</div>
											</div>
											<Tab.Content className="tab-content">
												<Tab.Pane eventKey="ThreeMonths">
													{showGraph ?
														<IncomeChart data={incomeGraphData} />
														: ''}
												</Tab.Pane>
												<Tab.Pane eventKey="Month">
													{showGraph ?
														<IncomeChart data={incomeGraphData} />
														: ''}
												</Tab.Pane>
												<Tab.Pane eventKey="Weekly">
													{showGraph ?
														<IncomeChart data={incomeGraphData} />
														: ''}
												</Tab.Pane>
												<Tab.Pane eventKey="Day">
													{showGraph ?
														<IncomeChart data={incomeGraphData} />
														: ''}
												</Tab.Pane>
											</Tab.Content>
										</div>
									</Tab.Container>
								</div>
							</div> */}

              <Col xl={6} lg={6}>
                <Card>
                  <Card.Header>
                    <h4 className="card-title">Entry and Exit Pole Chart</h4>
                  </Card.Header>
                  <Card.Body>
                    <EntryExitPoleChart data={pointChart} />
                  </Card.Body>
                </Card>
              </Col>

              <Col xl={6} lg={6}>
                <Card>
                  <Card.Header>
                    <h4 className="card-title">Entry and Exit line Chart</h4>
                  </Card.Header>
                  <Card.Body>
                    <EntryExitPointChart data={pointChart} />
                  </Card.Body>
                </Card>
              </Col>
              {/* <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                <div className="card availability line">
                  <div className="card-header border-0">
                    <h3>Parking Occupancy</h3>
                  </div>
                  <div className="card-body pb-2">
                    {showGraph ? (
                      <AvailabilityPieChart data={incomeGraphData} />
                    ) : (
                      ""
                    )}
                    <div className="d-flex justify-content-between pt-3 pt-sm-5 flex-wrap">
                      <span>
                        <span className="pills-lable bg-dark me-2"></span>
                        Available
                      </span>
                      <h4>
                        {incomeGraphData?.totalSpaces -
                          incomeGraphData?.currentOccupiedSpaces}{" "}
                        Parkings
                      </h4>
                    </div>
                    <div className="d-flex justify-content-between flex-wrap">
                      <span>
                        <span className="pills-lable me-2"></span>Occupied
                      </span>
                      <h4>{incomeGraphData?.currentOccupiedSpaces} Parkings</h4>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                <div className="card">
                  <div className="card-header border-0 pb-0">
                    <h3 className="mb-0">Entry & Exit</h3>
                  </div>
                  <div className="card-body pt-2 pb-2">
                    <div className="d-flex justify-content-between flex-wrap">
                      <p>
                        Total {incomeGraphData?.entryExitTotalEntries} Entries
                      </p>
                      <p>Total {incomeGraphData?.entryExitTotalExits} Exits</p>
                    </div>

                    {showGraph ? <VisitorChart data={incomeGraphData} /> : ""}
                  </div>
                </div>
              </div> */}
              {/* <div className="col-xl-6" hidden>
								<div className="card">
									<Tab.Container defaultActiveKey="Weekly">
										<div className="card-header border-0 pb-0 flex-wrap">
											<h3 className="mb-1">Parking Activity</h3>
											<div className="card-action coin-tabs mt-3 mt-sm-0">
												<Nav as="ul" className="nav nav-tabs" role="tablist">
													<Nav.Item as="li" className="nav-item">
														<Nav.Link className="nav-link" eventKey="Month" >Month</Nav.Link>
													</Nav.Item>
													<Nav.Item as="li" className="nav-item">
														<Nav.Link className="nav-link" eventKey="Weekly">Weekly</Nav.Link>
													</Nav.Item>
													<Nav.Item as="li" className="nav-item">
														<Nav.Link className="nav-link" eventKey="Day">Day</Nav.Link>
													</Nav.Item>
												</Nav>
											</div>
										</div>
										<div className="card-body pb-2">
											<div className="d-flex align-items-center mb-5">
												<div className="d-flex align-items-center flex-lg-wrap me-5 flex-wrap">
													<span className="me-3 d-flex align-items-center">
														<svg className="me-2" width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
															<rect y="0.716797" width="12" height="12" rx="4" fill="var(--primary)" />
														</svg>
														Entry
													</span>
													<h4 className="mb-0">457 Parkings</h4>
												</div>
												<div className="d-flex align-items-center flex-lg-wrap flex-wrap">
													<span className=" squre me-3 d-flex align-items-center">
														<svg className="me-2" width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
															<rect y="0.716797" width="12" height="12" rx="4" fill="#ff9d43" />
														</svg>
														Exit
													</span>
													<h4 className="mb-0">157 Parkings</h4>
												</div>
											</div>
											<Tab.Content className="tab-content">
												<Tab.Pane eventKey="Month">
													<GuestActivityChart />
												</Tab.Pane>
												<Tab.Pane eventKey="Weekly">
													<GuestActivityChart />
												</Tab.Pane>
												<Tab.Pane eventKey="Day">
													<GuestActivityChart />
												</Tab.Pane>
											</Tab.Content>
										</div>
									</Tab.Container>
								</div>
							</div> */}
            </div>
          </>
          {!DashboardReady ? (
            ""
          ) : (
            <div class="loader_shadow" style={{ height: "100%" }}>
              <div class="loader_loader">
                <div class="loader_item loader_top"></div>
                <div class="loader_item loader_left"></div>
                <div class="loader_item loader_right"></div>
                <div class="loader_item loader_bottom"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Home;
