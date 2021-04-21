import React, { useEffect, useState } from "react";
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";

export default function DonationMaster() {
  const [dtype, setdTypes] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(async () => {
    if (localStorage.getItem("logged") !== "true") {
      navigate("/");
    }
    const document = firestore.collection("donation_type");
    const activeRef = await document.get();
    var dt = [];
    activeRef.forEach((docs) => {
      dt.push(docs.data());
    });

    setdTypes(dt);
    setShowResult(true);
  });

  const changeState = () => {
    console.log("changinhg");
    setShowForm(!showForm);
  };

  const deleteType = (id) => {
    var data = [];
    dtype.map((d) => {
      if (d.id !== id) {
        data.push(d);
      }
    });
    // console.log(data);
    setShowResult(data);
    const query = firestore
      .collection("donation_type")
      .where("id", "==", id);
    const exe = query.get().then(function (q) {
      q.forEach(function (doc) {
        doc.ref.delete();
        alert("Donation Type Deleted");
      });
    });
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
        .collection("donation_type")
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
                <th>Donation Type</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {dtype.map((val, i) => (
                <tr>
                  <td>{val.name}</td>
                  <td>
                    <span
                      onClick={() => deleteType(val.id)}
                      style={{ color: "blue" }}
                    >
                      <i className="fas fa-trash" style={{ color: "red" }}></i>
                    </span>
                  </td>
                </tr>
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
