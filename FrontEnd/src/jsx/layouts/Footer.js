import React from "react";
import "font-awesome/css/font-awesome.min.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  var d = new Date();
  return (
    <div className="footer">
      <div className="copyright">
        <p>Copyright © WAVE {d.getFullYear()}</p>
        <p>
          Designed &amp; Developed by{" "}
          <a href="http://liquidlab.in/" target="_blank" rel="noreferrer">
            Liquidlab Infosystems
          </a>{" "}
          {d.getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;
