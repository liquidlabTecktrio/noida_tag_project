import React, { useContext } from "react";

/// React router dom
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";

/// Dashboard
import Home from "./components/Dashboard/Home";

/// Pages
import Login from "./pages/Login";
import { ThemeContext } from "../context/ThemeContext";
import ManageTerminals from "./pages/manageTerminals";
import ManageTagReader from "./pages/manageTagReader";

import ManageBarriers from "./pages/manageBarriers";
import ManageTags from "./pages/manageTags";
import ManageCustomers from "./pages/manageCustomers";
import ManageTransactions from "./pages/manageTransactions";

import EntryExitReport from "./pages/entryExitReport";
import CustomerWiseReport from "./pages/customerwiseReport";

const Markup = () => {
  const { menuToggle } = useContext(ThemeContext);
  const routes = [
    /// Dashboard
    { url: "/", component: Home },
    { url: "dashboard", component: Home },
    { url: "page-login", component: Login },
    { url: "app-terminals", component: ManageTerminals },
    { url: "app-tagReaders", component: ManageTagReader },

    { url: "app-barriers", component: ManageBarriers },
    { url: "app-tags", component: ManageTags },
    { url: "app-customers", component: ManageCustomers },
    { url: "app-transactions", component: ManageTransactions },
    { url: "app-entryExitReport", component: EntryExitReport },
    { url: "app-CustomerWiseReport", component: CustomerWiseReport },
  ];
  let path = window.location.pathname;

  let pagePath = path.includes("page");
  console.log("pagePath: ", pagePath);
  return (
    <>
      <div
        id={`${!pagePath ? "main-wrapper" : ""}`}
        className={`${!pagePath ? "show" : "mh100vh"}  ${
          menuToggle ? "menu-toggle" : ""
        }`}
      >
        {!pagePath && <Nav />}

        <div className={`${!pagePath ? "content-body" : ""}`}>
          <div
            className={`${!pagePath ? "container-fluid" : ""}`}
            style={{ minHeight: window.screen.height - 60 }}
          >
            <Switch>
              {routes.map((data, i) => (
                <Route
                  key={i}
                  exact
                  path={`/${data.url}`}
                  component={data.component}
                />
              ))}
            </Switch>
          </div>
        </div>
        {!pagePath && <Footer />}
      </div>
      {/* <Setting /> */}
      <ScrollToTop />
    </>
  );
};

export default Markup;
