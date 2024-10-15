/// Menu
import Metismenu from "metismenujs";
import React, { Component, useContext, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
/// Link
import { Link } from "react-router-dom";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import LogoutPage from "./Logout";
import profile from "../../../images/linnkLogo.jpeg";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "font-awesome/css/font-awesome.min.css";
import DesignaLogo from "../../../images/DesignaLogo.png";

class MM extends Component {
  componentDidMount() {
    this.$el = this.el;
    this.mm = new Metismenu(this.$el);
  }
  componentWillUnmount() {}
  render() {
    return (
      <div className="mm-wrapper">
        <ul className="metismenu" ref={(el) => (this.el = el)}>
          {this.props.children}
        </ul>
      </div>
    );
  }
}

const SideBar = () => {
  const { iconHover, sidebarposition, headerposition, sidebarLayout } =
    useContext(ThemeContext);

  //console.log(sidebarposition);
  //console.log(sidebarLayout);

  useEffect(() => {
    var btn = document.querySelector(".nav-control");
    var aaa = document.querySelector("#main-wrapper");
    function toggleFunc() {
      return aaa.classList.toggle("menu-toggle");
    }
    btn.addEventListener("click", toggleFunc);

    //sidebar icon Heart blast
    // var handleheartBlast = document.querySelector('.heart');
    // function heartBlast() {
    // 	return handleheartBlast.classList.toggle("heart-blast");
    // }
    // handleheartBlast.addEventListener('click', heartBlast);
  }, []);
  //For scroll
  const [hideOnScroll, setHideOnScroll] = useState(true);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );
  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];
  const isValetAdminLogin = sessionStorage.getItem("isAdminLogin");
  // let accessLevel = []
  // if(sessionStorage.getItem("accessLevel") != undefined){
  // 	accessLevel =
  // }

  const accessLevel = sessionStorage.getItem("accessLevel");
  // console.log("accessLevel",accessLevel)
  // const accessLevel = 7
  // console.log("accessLevel",accessLevel)

  /// Active menu
  const accessLevelLinks = {
    1: ["dashBoard"],
    2: ["app-parking"],
    3: ["app-operator"],
    4: ["app-Tariff"],
    5: ["app-ParkingReports"],
    6: [
      "app-ParkingReports",
      "app-ShiftReports",
      "app-DiscountReports",
      "app-EntryExitReport",
      "app-CustomerWiseReport",
    ],
    7: ["app-carWashPlan"],
  };
  // console.log("accessLevelLinks[accessLevel]", accessLevelLinks[accessLevel])
  // const sidebarLinks = accessLevelLinks[accessLevel] || [];
  // console.log("sidebarLinks",sidebarLinks)

  let deshBoard = [""];

  let Reports = [
    "app-ParkingReports",
    "app-DailyShiftEndReport",
    "app-DiscountReports",
    "app-EntryExitReport",
    "app-CustomerWiseReport",
  ];

  let accessControlSystem = ["app-terminals"];

  let manageTagReader = ["app-tagReaders"];
  let manageBarriers = ["app-barriers"];
  let manageTags = ["app-tags"];
  let manageCustomers = ["app-customers"];
  let manageTransactions = ["app-transactions"];

  return (
    <div
      className={`deznav ${iconHover} ${
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? hideOnScroll > 120
            ? "fixed"
            : ""
          : ""
      }`}
    >
      <PerfectScrollbar className="deznav-scroll">
        <Dropdown className="dropdown header-bx">
          <Dropdown.Toggle
            variant=""
            as="a"
            className="nav-link i-false c-pointer header-profile2 position-relative"
          >
            <div className="header-img position-relative ">
              {/* <img className="img-fluid" src={sessionStorage.getItem("ClientImgUrl") ? sessionStorage.getItem("ClientImgUrl") : profile} alt="" /> */}
              <img className="img-fluid" src={DesignaLogo} alt="" />
              <svg
                className="header-circle"
                width="130"
                height="130"
                viewBox="0 0 130 130"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M130 65C130 100.899 100.899 130 65 130C29.1015 130 0 100.899 0 65C0 29.1015 29.1015 0 65 0C100.899 0 130 29.1015 130 65ZM4.99306 65C4.99306 98.1409 31.8591 125.007 65 125.007C98.1409 125.007 125.007 98.1409 125.007 65C125.007 31.8591 98.1409 4.99306 65 4.99306C31.8591 4.99306 4.99306 31.8591 4.99306 65Z"
                  fill="#FFD482"
                />
                <path
                  d="M65 2.49653C65 1.11774 66.1182 -0.00500592 67.496 0.0479365C76.3746 0.389105 85.0984 2.54751 93.1247 6.39966C101.902 10.6123 109.621 16.7428 115.711 24.3385C121.802 31.9341 126.108 40.8009 128.312 50.284C130.516 59.7671 130.562 69.6242 128.446 79.1274C126.33 88.6305 122.106 97.5369 116.087 105.189C110.067 112.841 102.406 119.043 93.6677 123.337C84.9299 127.631 75.3391 129.907 65.6037 129.997C56.7012 130.08 47.8858 128.333 39.7012 124.875C38.4312 124.338 37.895 122.847 38.48 121.598C39.065 120.35 40.5495 119.817 41.8213 120.35C49.3273 123.493 57.4027 125.08 65.5573 125.004C74.5449 124.921 83.399 122.819 91.4656 118.855C99.5322 114.891 106.605 109.166 112.162 102.102C117.72 95.0375 121.619 86.8153 123.572 78.0421C125.526 69.269 125.484 60.1691 123.449 51.4145C121.414 42.6598 117.438 34.4741 111.816 27.4619C106.193 20.4497 99.0674 14.7901 90.9643 10.9011C83.6123 7.3726 75.6263 5.38343 67.4958 5.04499C66.1182 4.98764 65 3.87533 65 2.49653Z"
                  fill="var(--primary)"
                />
              </svg>
              <div className="header-edit position-absolute">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    size="xl"
                    color="green"
                    icon={faGear}
                  />
                </svg>
              </div>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu
            align="right"
            className="dropdown-menu dropdown-menu-end"
          >
            <LogoutPage />
          </Dropdown.Menu>
          <div className="header-content ms-2">
            <span className="font-w500">
              {sessionStorage.getItem("ClientName")}
            </span>
          </div>
        </Dropdown>
        <MM className="metismenu" id="menu">
          <li className={`${deshBoard.includes(path) ? "mm-active" : ""}`}>
            <Link
              className={`${path === "dashboard" ? "mm-active" : ""}`}
              to="/dashboard"
            >
              <i className="flaticon-025-dashboard"></i>
              <span className="nav-text">Dashboard</span>
            </Link>
          </li>
          <li
            className={`${
              accessControlSystem.includes(path) ? "mm-active" : ""
            }`}
          >
            <Link
              className={`${path === "app-terminals" ? "mm-active" : ""}`}
              to="app-terminals"
            >
              <i className="flaticon-025-dashboard"></i>
              <span className="nav-text">Manage Terminals</span>
            </Link>
          </li>

          <li
            className={`${manageTagReader.includes(path) ? "mm-active" : ""}`}
          >
            <Link
              className={`${path === "app-tagReaders" ? "mm-active" : ""}`}
              to="app-tagReaders"
            >
              <i className="flaticon-025-dashboard"></i>
              <span className="nav-text">Manage Tag Reader</span>
            </Link>
          </li>

          <li className={`${manageBarriers.includes(path) ? "mm-active" : ""}`}>
            <Link
              className={`${path === "app-barriers" ? "mm-active" : ""}`}
              to="app-barriers"
            >
              <i className="flaticon-025-dashboard"></i>
              <span className="nav-text">Manage Barrier</span>
            </Link>
          </li>
          <li className={`${"app-tags".includes(path) ? "mm-active" : ""}`}>
            <Link
              className={`${path === "app-tags" ? "mm-active" : ""}`}
              to="app-tags"
            >
              <i className="flaticon-025-dashboard"></i>
              <span className="nav-text">Manage tags</span>
            </Link>
          </li>

          <li
            className={`${manageCustomers.includes(path) ? "mm-active" : ""}`}
          >
            <Link
              className={`${path === "app-customers" ? "mm-active" : ""}`}
              to="app-customers"
            >
              <i className="flaticon-025-dashboard"></i>
              <span className="nav-text">Manage Customers</span>
            </Link>
          </li>

          <li
            className={`${
              manageTransactions.includes(path) ? "mm-active" : ""
            }`}
          >
            <Link
              className={`${path === "app-transactions" ? "mm-active" : ""}`}
              to="app-transactions"
            >
              <i className="flaticon-025-dashboard"></i>
              <span className="nav-text">Manage Transactions</span>
            </Link>
          </li>

          <li className={`${Reports.includes(path) ? "mm-active" : ""}`}>
            <Link className="has-arrow" to="#">
              <i className="flaticon-025-dashboard"></i>
              <span className="nav-text">Reports</span>
            </Link>
            <ul>
              {/* <li>
                <Link
                  className={`${
                    path === "app-DailyShiftEndReport" ? "mm-active" : ""
                  }`}
                  to="/app-DailyShiftEndReport"
                >
                  {" "}
                  Daily Shift End Report{" "}
                </Link>
              </li> */}
              <li>
                <Link
                  className={`${
                    path === "app-EntryExitReport" ? "mm-active" : ""
                  }`}
                  to="/app-EntryExitReport"
                >
                  {" "}
                  Entry Exit Report{" "}
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    path === "app-CustomerWiseReport" ? "mm-active" : ""
                  }`}
                  to="/app-CustomerWiseReport"
                >
                  {" "}
                  Customer Wise Report{" "}
                </Link>
              </li>
            </ul>
          </li>
        </MM>

        <div className="copyright">
          <h6>
            WAVE{" "}
            <span className="fs-14 font-w400">
              {" "}
              © {new Date().getFullYear()} All Rights Reserved
            </span>
          </h6>
          <p className="fs-12 mb-4">
            Made with{" "}
            <FontAwesomeIcon
              style={{ cursor: "pointer" }}
              size="xl"
              color="#f8857e"
              icon={faHeart}
            />{" "}
            by{" "}
            <a href="http://liquidlab.in/" target="_blank" rel="noreferrer">
              Liquidlab
            </a>
          </p>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default SideBar;
