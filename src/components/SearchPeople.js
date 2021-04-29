import React, { useState, useEffect } from "react";
import { navigate } from "hookrouter";
import { firestore, storage } from "../firebase";
import { isDOMComponentElement } from "react-dom/test-utils";

export default function SearchPeople({ type }) {
  const [finalData, setFinalData] = useState([]);
  const [key, setKeys] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = firestore.collection(type);
      const exeQuery = await query.get();
      var data = [];

      exeQuery.forEach((d) => {
        data.push(d.data());
      });

      // var keys = Object.keys(data[0]);
      // const index = keys.indexOf('pid');
      // if (index > -1) {
      //   keys.splice(index, 1);
      // }
      // setKeys(keys)
      console.log("data", data);
      setFinalData(data);
    };
    fetchData();
  }, []);

  const deleteUser = (id) => {
    var data = [];
    finalData.map((d) => {
      if (d.pid !== id) {
        data.push(d);
      }
    });
    // console.log(data);
    setFinalData(data);
    const query = firestore.collection(type).where("pid", "==", id);
    const exe = query.get().then(function (q) {
      q.forEach(function (doc) {
        doc.ref.delete();
        alert("User Deleted");
      });
    });
  };

  return (
    <div>
      {finalData.length > 0 && (
        <div>
          <table id="example2" className="table table-bordered">
            <thead>
              <tr>
                {finalData.some((obj) => obj.hasOwnProperty("event")) && (
                  <th>Event</th>
                )}
                {finalData.some((obj) => obj.hasOwnProperty("note")) && (
                  <th>Note</th>
                )}
                {finalData.some((obj) => obj.hasOwnProperty("date")) && (
                  <th>Date</th>
                )}
                {finalData.some((obj) => obj.hasOwnProperty("image")) && (
                  <th>Image</th>
                )}
                {finalData.some((obj) => obj.hasOwnProperty("name")) && (
                  <th>Name</th>
                )}
                {finalData.some((obj) => obj.hasOwnProperty("fname")) && (
                  <th>Father's Name</th>
                )}
                {finalData.some((obj) => obj.hasOwnProperty("address")) && (
                  <th>Address</th>
                )}
                {finalData.some((obj) => obj.hasOwnProperty("mno")) && (
                  <th>Mobile Number</th>
                )}
                {finalData.some((obj) => obj.hasOwnProperty("vivran")) && (
                  <th>Vivran</th>
                )}
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {finalData.map((val, i) => (
                <tr>
                  {val.event && <td>{val.event}</td>}
                  {val.note && <td>{val.note}</td>}
                  {val.date && <td>{val.date}</td>}
                  {val.image && (
                    <td>
                      <img
                        src={val.image}
                        style={{ width: 180, height: 180 }}
                      />
                    </td>
                  )}
                  {val.name && <td>{val.name}</td>}
                  {val.fname && <td>{val.fname}</td>}
                  {val.address && <td>{val.address}</td>}
                  {val.mno && <td>{val.mno}</td>}
                  {val.vivran && <td>{val.vivran}</td>}
                  <td style={{ flexDirection: "row" }}>
                    <span
                      onClick={() =>
                        navigate("/editPeople/" + type + "*" + val.pid)
                      }
                      style={{ color: "blue" }}
                    >
                      <i className="fas fa-edit" style={{ color: "black" }}></i>
                    </span>
                  </td>
                  <td>
                    <span
                      onClick={() => deleteUser(val.pid)}
                      style={{ color: "blue" }}
                    >
                      <i className="fas fa-trash" style={{ color: "red" }}></i>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
