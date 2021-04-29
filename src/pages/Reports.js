import React, { useState, useEffect } from "react";
import SideBar from "../components/Sidebar";
import GVSearch from "../components/GVSearch";
import PaymentSearch from "../components/PaymentSearch.js";
import ProductSearch from "../components/ProductSearch";
import { navigate } from "hookrouter";
import _ from "underscore";

const Reports = () => {
  const [type, setType] = useState("");
  const [finalData, setFinalData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("logged") !== "true") {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setType(event.target.value);
  };

  // const getFData = () => {
  //     console.log("here",finalData);
  //     finalData.map((val,i) => {
  //         //console.log(typeof val);
  //         let ind = 0;
  //         if(typeof val[ind] === "object"){
  //             Object.entries(val[ind]).map(([key, value]) => {

  //                 ind++;
  //             })
  //             setKeys(ind)
  //         }

  //     })
  // }

  const handleCallback = (s1, s2) => {
    console.log("rec s1", s1);
    console.log("rec s2", s2);
    console.log("merging...");
    var final = [];
    if (s1.length > 0 && s2.length > 0) {
      s2.map((val, i) => {
        var data = {};
        data = val;
        var curId = val.uid;
        console.log("cur id", val.uid);
        s1.map((v, j) => {
          if (v.uid === curId) {
            //  console.log("matched val",v);
            data = { ...data, v };
          }
        });
        console.log("fdata", data);
        final.push(data);
      });
      setFinalData(final);
    } else {
      setFinalData(final);
      // console.log("Error");
    }
  };

  return (
    <div>
      <SideBar />
      <div className="content-wrapper">
        <section class="content-header">
          <div class="container-fluid">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1>Generate Reports</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <div className="form-group">
                  <label>Reports according to : </label>
                  <select
                    className="form-control"
                    name="type"
                    onChange={handleChange}
                    value={type}
                  >
                    <option value="" disabled defaultValue="select" selected>
                      Select one
                    </option>
                    <option value="place">Gaadi and Village</option>
                    <option value="pt">Payment Type</option>
                    <option value="pro">Product</option>
                  </select>
                </div>
                {type === "place" && (
                  <GVSearch parentCallback={handleCallback} />
                )}
                {type === "pt" && (
                  <PaymentSearch parentCallback={handleCallback} />
                )}
                {type === "pro" && (
                  <ProductSearch parentCallback={handleCallback} />
                )}
              </div>
            </div>

            {finalData.length > 0 && (
              <div className="row">
                <div className="col-12">
                  {/* <div className="card">
                    <div className="card-body"> */}
                      <table
                        id="example2"
                        className="table table-bordered table-hover"
                      >
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Father's Name</th>
                            <th>Address</th>
                            <th>Village Name</th>
                            <th>Gaadi Name</th>
                            <th>Mobile Number</th>
                            <th>Donation For</th>
                            <th>Payment type</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Reciept Number</th>
                            <th>Name to be Printed</th>
                            <th>Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {finalData.map((val) => (
                            <tr>
                              <td>{val.v.name}</td>
                              <td>{val.v.fname}</td>
                              <td>{val.v.address}</td>
                              <td>{val.v.vname}</td>
                              <td>{val.v.gname}</td>
                              <td>{val.v.mnno}</td>
                              <td>{val.donation}</td>
                              <td>{val.type}</td>
                              <td>{val.date}</td>
                              <td>{val.amount}</td>
                              {val.reciept_no ? (
                                <td>{val.reciept_no}</td>
                              ) : (
                                <td>-</td>
                              )}
                              {val.ntp ? <td>{val.ntp}</td> : <td>-</td>}
                              {val.note ? <td>{val.note}</td> : <td>-</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    {/* </div>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Reports;
