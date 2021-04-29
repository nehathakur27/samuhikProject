import React, { useState, useEffect } from "react";
import SideBar from "../components/Sidebar";
import GVSearch from "../components/GVSearch";
import NameSearch from "../components/NameSearch";
import RegNoSearch from "../components/RegNoSearch";
// import _, { object } from 'underscore'
import { navigate } from "hookrouter";
import { firestore } from "../firebase";
import EditUser from "../pages/EditUser";

export default function SearchEntry() {
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
        // console.log("fdata",data);
        final.push(data);
      });
      console.log(final);

      setFinalData(final);
    } else {
      setFinalData(final);
    }
  };

  const deleteUser = (id) => {
    var data = [] 
    finalData.map((d) => {
        if(d.reciept_no !== id){
            data.push(d)
        }
    })
    // console.log(data);
    setFinalData(data)
    const query = firestore
      .collection("all_receipts")
      .where("reciept_no", "==", id);
    const exe = query.get().then(function (q) {
      q.forEach(function (doc) {
        doc.ref.delete();
        alert("User Deleted");
      });
    });
  };

  return (
    <div>
      <SideBar />
      <div className="content-wrapper">
        <section class="content-header">
          <div class="container-fluid">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1>Search and Edit User Information</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <div className="form-group">
                  <label>Search according to : </label>
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
                    <option value="name">Name</option>
                    <option value="regno">Registration Number</option>
                  </select>
                </div>

                {type === "place" && (
                  <GVSearch parentCallback={handleCallback} />
                )}
                {type === "name" && (
                  <NameSearch parentCallback={handleCallback} />
                )}
                {type === "regno" && (
                  <RegNoSearch parentCallback={handleCallback} />
                )}

                {finalData.length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Details</h3>
                        </div>
                        <div className="card-body">
                          <table id="example2" className="table table-bordered">
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
                                {/* <th>Edit</th>
                                <th>Delete</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {finalData.map((val, i) => (
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
                                  {/* <A href="/editUser" val = {val}><td style={{color:"blue"}}>Edit</td></A> */}
                                  <td style = {{flexDirection:"row"}}>
                                  <span
                                    onClick={() =>
                                      navigate("/editUser/" + val.id)
                                    }
                                    style={{ color: "blue" }}
                                  >
                                  <i className="fas fa-edit" style={{color:"black"}}></i>
                                  </span>
                                  {/* <td onClick={() => edit(val)} style={{color:"blue"}}>Edit</td> */}
                                  <span
                                    onClick={() => deleteUser(val.reciept_no)}
                                    style={{ color: "blue" }}
                                  >
                                      <i className="fas fa-trash" style={{color:"red"}}></i>
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* row */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
