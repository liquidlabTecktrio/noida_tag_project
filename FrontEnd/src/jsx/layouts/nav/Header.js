import React,{useState} from "react";

import { Link } from "react-router-dom";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
import  DatePicker  from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

/// Image

// import avatar from "../../../images/avatar/1.jpg";
import { Dropdown } from "react-bootstrap";
import LogoutPage from './Logout';

const Header = ({ onNote }) => {
  const [searchBut, setSearchBut] = useState(false);	
  const [startDate, setStartDate] = useState(new Date());
  var path = window.location.pathname.split("/");
  var name = path[path.length - 1].split("-");
  var filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;
  var finalName = filterName.includes("app")
    ? filterName.filter((f) => f !== "app")
    : filterName.includes("ui")
    ? filterName.filter((f) => f !== "ui")
    : filterName.includes("uc")
    ? filterName.filter((f) => f !== "uc")
    : filterName.includes("basic")
    ? filterName.filter((f) => f !== "basic")
    : filterName.includes("jquery")
    ? filterName.filter((f) => f !== "jquery")
    : filterName.includes("table")
    ? filterName.filter((f) => f !== "table")
    : filterName.includes("page")
    ? filterName.filter((f) => f !== "page")
    : filterName.includes("email")
    ? filterName.filter((f) => f !== "email")
    : filterName.includes("ecom")
    ? filterName.filter((f) => f !== "ecom")
    : filterName.includes("chart")
    ? filterName.filter((f) => f !== "chart")
    : filterName.includes("editor")
    ? filterName.filter((f) => f !== "editor")
    : filterName;
  return ( 
    // <div className="header">
    //   <div className="header-content">
    //     <nav className="navbar navbar-expand">
    //       <div className="collapse navbar-collapse justify-content-between">
    //         <div className="header-left">
		// 		<div
		// 			className="header-title"
		// 			style={{ textTransform: "capitalize" }}
		// 		  >
		// 			<h1 className="font-w600 mb-0">
		// 				{finalName.join(" ").length === 0
		// 				  ? "Dashboard"
		// 				  : finalName.join(" ") === "dashboard dark"
		// 				  ? "Dashboard"
		// 				  : finalName.join(" ")}
		// 			</h1>	  
		// 		</div>
    //         </div>
			
    //         <ul className="navbar-nav header-right">
					
    //         </ul>
    //       </div>
    //     </nav>
    //   </div>
    // </div>
    ''
  );
};

export default Header;
