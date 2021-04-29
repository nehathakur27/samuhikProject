import React, { useState, useEffect } from "react";
import SideBar from "../components/Sidebar";
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import Ghoshna from "../components/Ghoshna";
import Due from "../components/Due";
import Received from "../components/Received";

export default function Payment() {
  const [dtypes, setdTypes] = useState([]);
  const [ptype, setPType] = useState("");
  let ref = firestore.collection("receipts").doc("AllsReceipts");

  useEffect(() => {
    if (localStorage.getItem("logged") !== "true") {
      navigate("/");
    }
    fetchData()
  });

  const fetchData = async () => {
    const document = firestore.collection("donation_type");
    const activeRef = await document.get();
    var dt = [];
    activeRef.forEach((docs) => {
      dt.push(docs.data());
    });

    setdTypes(dt);
  };

  const handleType = (e) => {
    console.log(e.target.value);
    setPType(e.target.value);
  };

  return (
    <div>
      <SideBar />
      <div className="content-wrapper">
        {/* ye */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Payment Method</h1>
              </div>
            </div>
          </div>
        </div>
        {/* idhar */}
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <div>
                  <div className="form-group">
                    <label>Payment Type</label>
                    <select
                      className="form-control"
                      name="pc"
                      onChange={handleType}
                      value={ptype}
                    >
                      <option value="" disabled selected>
                        Select one
                      </option>
                      <option value="ghoshna">Ghoshna</option>
                      <option value="due">Due</option>
                      <option value="received">Received</option>
                    </select>
                  </div>
                </div>
                {ptype === "ghoshna" && <Ghoshna />}

                {ptype === "due" && <Due />}

                {ptype === "received" && <Received />}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
