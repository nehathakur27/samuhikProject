import React, { useState, useEffect } from "react";
import SideBar from "../components/Sidebar";
import { navigate } from "hookrouter";
import DonationMaster from "../components/DonationMaster";
import GaadiMaster from "../components/GaadiMaster";

export default function Master() {
  const [category, setCategory] = useState();

  useEffect(() => {
    if (localStorage.getItem("logged") !== "true") {
      navigate("/");
    }
  });

  const handleType = (e) => {
    console.log(e.target.value);
    setCategory(e.target.value);
  };

  const validate = (values) => {
    console.log("in validate");
    const errors = {};

    return errors;
  };

  return (
    <div>
      <SideBar />
      <section className="content">
        <div className="container-fluid">
          <div>
            <div className="form-group">
              <label>Payment Type</label>
              <select
                className="form-control"
                name="category"
                onChange={handleType}
                value={category}
              >
                <option value="" disabled selected>
                  Select one
                </option>
                <option value="donation">Donation Type</option>
                <option value="gv">Gaadi and Villages</option>
              </select>
            </div>
          </div>
          {category === "donation" && <DonationMaster />}

          {category === "gv" && <GaadiMaster />}
        </div>
      </section>
    </div>
  );
}
