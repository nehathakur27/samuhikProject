import React, { useEffect, useState } from "react";
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import Row from "../components/Row";

export default function GaadiMaster() {
  const [gName, setgName] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("logged") !== "true") {
      navigate("/");
    }

    loadData();
  }, []);

  useEffect(() => {
    // console.log("gname",JSON.stringify(gName));
    // console.log("vname",JSON.stringify(vName));
    console.log("gname", gName);
    // console.log("vname", vName);
    // vName.map((g, i) => {
    //   // console.log(g[0]);
    //   g.map((v,j) => {
    //     console.log(v.name);
    //   })
    // });
  }, [gName]);

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
    setShowForm(!showForm);
  };

  

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name Required";
    }

    return errors;
  };
  const newFormik = useFormik({
    initialValues: {
      id: "",
      name: "",
    },
    validate,
    onSubmit: (values) => {
      console.log(values);
      let id = uuidv4();
      const data = {
        id: id,
        name: values.name,
      };
      console.log(data);
      firestore
        .collection("gaadi_name")
        .doc(id)
        .set(data, { merge: true })
        .then(function () {
          console.log("success");
          navigate("/home");
        });
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
            <tbody>
              {gName.map((val, i) => (
                <Row gname={val} />
              ))}
            </tbody>
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
                  <label>नाम </label>
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
