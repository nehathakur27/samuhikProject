import React, { useState } from "react";
import SideBar from "../components/Sidebar";
import { useFormik } from "formik";
import { navigate } from "hookrouter";
import { firestore, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const Suchna = () => {
  const validate = (values) => {
    console.log("in validate");
    const errors = {};
    if (!values.event) {
      errors.event = "Event Required";
    }

    return errors;
  };


  const registerForm = useFormik({
    initialValues: {
      pid: uuidv4(),
      date:"",
      event:"",
      note:"",
    },
    validate,
    onSubmit: async (values) => {
      console.log(values);
      const data = {
        pid: values.pid,
        event: values.event,
        date: values.date,
        note: values.note,
      };
      firestore
        .collection("suchna")
        .doc(values.pid)
        .set(data, { merge: true })
        .then(function () {
          console.log("success");
          navigate("/home");
        });
    },
  });

  return (
    <div>
      <SideBar />
      <div
        className="row"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <form role="form" onSubmit={registerForm.handleSubmit}>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>सुचना  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="सुचना "
                    name="event"
                    onChange={registerForm.handleChange}
                    value={registerForm.values.event}
                  />
                </div>
                {registerForm.errors.event ? (
                  <p style={{ color: "red" }}>{registerForm.errors.event}</p>
                ) : null}
              </div>
              <div className="col-sm-6">
              <div className="form-group">
                <label>दिनांक </label>
                <input
                  type="date"
                  placeholder="Date"
                  className="form-control"
                  name="date"
                  onChange={registerForm.handleChange}
                />
              </div>
              {registerForm.errors.date ? (
                <p style={{ color: "red" }}>{registerForm.errors.date}</p>
              ) : null}
            </div>
            </div>
            <div className="row">
            <div className="col-sm-6">
                <div className="form-group">
                  <label>नोट   </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="नोट  "
                    name="note"
                    onChange={registerForm.handleChange}
                    value={registerForm.values.note}
                  />
                </div>
                {registerForm.errors.note ? (
                  <p style={{ color: "red" }}>{registerForm.errors.note}</p>
                ) : null}
              </div>
            </div>

            <button type="submit" className="btn btn-info">
            ऐड करे {" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Suchna;
