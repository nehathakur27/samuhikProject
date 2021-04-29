import React, { useState } from "react";
import SideBar from "../components/Sidebar";
import { useFormik } from "formik";
import { navigate } from "hookrouter";
import { firestore, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const Gourav = () => {
  const [fieldValue, setFieldValue] = useState({});
  var storageRef = storage.ref();
  const [imgUrl, setImgUrl] = useState();

  const validate = (values) => {
    console.log("in validate");
    const errors = {};
    if (!fieldValue) {
      errors.file = "Image Required";
    }
    if (!values.name) {
      errors.name = "Name Required";
    }

    if (values.mno && !values.mno.match(/^\d{10}$/)) {
      errors.mno = "Invalid Phone Number. 10 Digits Required";
    }
    return errors;
  };

  const imageUpload = async (pid) => {
    // console.log("image upload",fieldValue);
    if (fieldValue) {
      const uploadTask = storageRef.child(`images/${pid}`).put(fieldValue);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            reject(error);
          },
          () => {
            storageRef
              .child(`images/${pid}`)
              .getDownloadURL()
              .then((url) => {
                setImgUrl(url);
                resolve(url);
              });
          }
        );
      });
    }
  };

  const registerForm = useFormik({
    initialValues: {
      pid: uuidv4(),
      name: "",
      fname: "",
      address: "",
      mno: "",
      file: "",
    },
    validate,
    onSubmit: async (values) => {
      console.log(values);
      const url = await imageUpload(values.pid);
      // console.log("file",fieldValue);
      const data = {
        pid: values.pid,
        name: values.name,
        fname: values.fname,
        address: values.address,
        mno: values.mno,
        image: url,
      };
      firestore
        .collection("gourav")
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
                  <label>नाम </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="नाम"
                    name="name"
                    onChange={registerForm.handleChange}
                    value={registerForm.values.name}
                  />
                </div>
                {registerForm.errors.name ? (
                  <p style={{ color: "red" }}>{registerForm.errors.name}</p>
                ) : null}
              </div>
              <div className="col-sm-6">
                {/* text input */}
                <div className="form-group">
                  <label>पिता का नाम </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="पिता का नाम"
                    name="fname"
                    onChange={registerForm.handleChange}
                    value={registerForm.values.fname}
                  />
                </div>
                {registerForm.errors.fname ? (
                  <p style={{ color: "red" }}>{registerForm.errors.fname}</p>
                ) : null}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                {/* text input */}
                <div className="form-group">
                  <label>फोटो </label>
                  <input
                    type="file"
                    className="form-control"
                    placeholder="फोटो"
                    name="file"
                    id="file"
                    // onChange={registerForm.handleChange}
                    onChange={(event) => {
                      setFieldValue(event.currentTarget.files[0]);
                    }}
                  ></input>
                </div>
                {registerForm.errors.file ? (
                  <p style={{ color: "red" }}>{registerForm.errors.file}</p>
                ) : null}
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>पता </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address"
                    name="address"
                    onChange={registerForm.handleChange}
                    value={registerForm.values.address}
                  />
                </div>
                {registerForm.errors.address ? (
                  <p style={{ color: "red" }}>{registerForm.errors.address}</p>
                ) : null}
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>मोबाइल नंबर </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="मोबाइल नंबर "
                    name="mno"
                    onChange={registerForm.handleChange}
                    value={registerForm.values.mno}
                  />
                </div>
                {registerForm.errors.mno ? (
                  <p style={{ color: "red" }}>{registerForm.errors.mno}</p>
                ) : null}
              </div>
            </div>

            <button type="submit" className="btn btn-info">
              रजिस्टर{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Gourav;
