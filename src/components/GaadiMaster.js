import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { navigate } from "hookrouter";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import Row from "../components/Row";

export default function GaadiMaster() {
  const [gName, setgName] = useState([]);
  const [allGaadis, setAllGaadis] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("logged") !== "true") {
      navigate("/");
    }

    loadData();
  }, []);

  useEffect(() => {
    console.log("gname", gName);
  }, [gName]);

  const loadGaadis = async () => {
    const document = firestore.collection("gaadi_name");
    const activeRef = await document.get();
    var gaadis = [];
    activeRef.forEach((docs) => {
      gaadis.push(docs.data());
    });
    console.log("all gaadis", gaadis);
    setAllGaadis(gaadis);
  };

  const loadData = async () => {
    var data = [];
    firestore
      .collection("gaadi_name")
      .get()
      .then(function (res) {
        res.forEach(function (doc) {
          data.push(doc.data());
        });
        // console.log("gaadis",JSON.stringify(data));
        setgName(data);
      });

    setShowResult(true);
  };

  const changeState = () => {
    console.log("changing");
    if (showForm === false && allGaadis.length === 0) loadGaadis();
    setShowForm(!showForm);
  };

  const validate = (values) => {
    const errors = {};
    if (values.gname === "None" && !values.name) {
      errors.name = "Gaadi Name Required";
    }
    if (values.gname !== "None" && !values.vname) {
      errors.vname = "Village Name Required";
    }

    return errors;
  };
  const newFormik = useFormik({
    initialValues: {
      id: "",
      name: "",
      gname: "",
      vname: "",
    },
    validate,
    onSubmit: (values) => {
      console.log(values);
      var data = {};
      if (values.gname === "None") {
        data["name"] = values.name;
        data["id"] = values.name;
        firestore
          .collection("gaadi_name")
          .doc(values.name)
          .set(data, { merge: true })
          .then(function () {
            console.log("success");
            navigate("/home");
          });
      }
      if (values.gname !== "None") {
        data["name"] = data["id"] = values.vname;
        firestore
          .collection("gaadi_name")
          .doc(values.gname)
          .collection("village_name")
          .doc(values.vname)
          .set(data, { merge: true })
          .then(function () {
            console.log("success");
            navigate("/home");
          });
      }
    },
  });

  return (
    <div>
      {showResult && (
        <div>
          <table id="example2" className="table table-bordered">
            <thead>
              <tr>
                <th>Gaadi</th>
                <th>Village</th>
                <th>Delete</th>
              </tr>
            </thead>
              {gName.map((val, i) => (
                <Row gname={val} />
              ))}
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              width: "10%",
              backgroundColor: "#007bff",
              padding: "8px",
            }}
            onClick={() => changeState()}
          >
            <i className="fas fa-plus" style={{ color: "black" }}></i>
            <h6>Add New</h6>
          </div>
        </div>
      )}
      <div>
        {showForm && (
          <form onSubmit={newFormik.handleSubmit}>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>गादी </label>
                  <select
                    className="form-control"
                    name="gname"
                    value={newFormik.values.gname}
                    onChange={newFormik.handleChange}
                  >
                    <option value="" disabled defaultValue="select">
                      Select one
                    </option>
                    {allGaadis.map((gaadi) => (
                      <option value={gaadi.id}>{gaadi.name}</option>
                    ))}
                    <option value="None">None</option>
                  </select>
                </div>
              </div>
              {newFormik.values.gname === "None" && (
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>गादी का नाम </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="नाम"
                      name="name"
                      onChange={newFormik.handleChange}
                      value={newFormik.values.name}
                    />
                  </div>
                  {newFormik.errors.name ? (
                    <p style={{ color: "red" }}>{newFormik.errors.name}</p>
                  ) : null}
                </div>
              )}
              {newFormik.values.gname !== "None" && (
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>गांव का नाम </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="नाम"
                      name="vname"
                      onChange={newFormik.handleChange}
                    />
                  </div>
                  {newFormik.errors.vname ? (
                    <p style={{ color: "red" }}>{newFormik.errors.vname}</p>
                  ) : null}
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-info">
              सबमिट{" "}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
