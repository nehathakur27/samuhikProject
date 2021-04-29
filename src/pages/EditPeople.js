import React, { useEffect, useState } from "react";
import SideBar from "../components/Sidebar";
import { useFormik } from "formik";
import { firestore, storage } from "../firebase.config";
import { navigate } from "hookrouter";

export default function EditPeople({ id }) {
  const [fieldValue, setFieldValue] = useState();
  const [imgUrl, setImgUrl] = useState();
  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState("");
  const [userData, setUserData] = useState({});
  const [reUpload, setReupload] = useState(false);
  var storageRef = storage.ref();

  useEffect(() => {
    if (localStorage.getItem("logged") !== "true") {
      navigate("/");
    }
    console.log(id.id.split("*"));
    setUserType(id.id.split("*")[0]);
    setUserId(id.id.split("*")[1]);
    loadData();
  }, []);

  const loadData = async () => {
    console.log("loading data..");
    var data = [];
    var arr = id.id.split("*");
    // if (userId && userType) {
    const q = firestore.collection(arr[0]).where("pid", "==", arr[1]);
    const eq = await q.get();
    eq.forEach((d) => {
      data.push(d.data());
    });
    console.log("data", JSON.stringify(data));
    var final = { ...data };
    setUserData(final[0]);
    // }
  };

  const validate = (values) => {
    console.log("in validate");
    const errors = {};
    if (!fieldValue) {
      errors.file = "Image Required";
    }
    if (!values.name) {
      errors.name = "Name Required";
    }

    if (userType !== "prerna" && values.mno && !values.mno.match(/^\d{10}$/)) {
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

  const handleClick = () => {
    setReupload(!reUpload);
  };

  const registerForm = useFormik({
    initialValues: userData,
    enableReinitialize: true,
    // validate,
    onSubmit: async (values) => {
      console.log("values", values);
      const url = reUpload === true ? await imageUpload(userId) : values.image;
      const data = {};
      if ("name" in userData) data["name"] = values.name;
      if ("fname" in userData) data["fname"] = values.fname;
      if ("address" in userData) data["address"] = values.address;
      if ("image" in userData) data["image"] = url;
      if ("mno" in userData) data["mno"] = values.mno;
      if ("vivran" in userData) data["vivran"] = values.vivran;
      if ("event" in userData) data["event"] = values.event;
      if ("date" in userData) data["date"] = values.date;
      if ("note" in userData) data["note"] = values.note;
      console.log("data edited", data);

      firestore
        .collection(userType)
        .doc(userId)
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
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Edit</h1>
              </div>
            </div>
          </div>
        </div>
        <div>
          <section className="content">
            <div className="container-fluid">
              <div className="card">
                <div className="card-body">
                  <form role="form" onSubmit={registerForm.handleSubmit}>
                    <div className="row">
                      {"image" in userData && (
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <img
                            src={registerForm.values.image}
                            style={{ width: 180, height: 180 }}
                          />
                          <div onClick={() => handleClick()}>
                            <h6>Upload New</h6>
                          </div>
                          <br></br>
                          {reUpload && (
                            <div className="form-group">
                              <input
                                type="file"
                                className="form-control"
                                placeholder="फोटो"
                                name="file"
                                id="file"
                                onChange={(event) => {
                                  setFieldValue(event.currentTarget.files[0]);
                                }}
                              />
                            </div>
                          )}
                          {registerForm.errors.image ? (
                            <p style={{ color: "red" }}>
                              {registerForm.errors.image}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <div className="row">
                      {"name" in userData && (
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>नाम </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="नाम"
                              name="name"
                              onChange={registerForm.handleChange}
                              defaultValue={registerForm.values.name}
                            />
                          </div>
                          {registerForm.errors.name ? (
                            <p style={{ color: "red" }}>
                              {registerForm.errors.name}
                            </p>
                          ) : null}
                        </div>
                      )}
                      {"fname" in userData && (
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>पिता का नाम </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="पिता का नाम"
                              name="fname"
                              onChange={registerForm.handleChange}
                              defaultValue={registerForm.values.fname}
                            />
                          </div>
                          {registerForm.errors.fname ? (
                            <p style={{ color: "red" }}>
                              {registerForm.errors.fname}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <div className="row">
                      {"address" in userData && (
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>पता </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Address"
                              name="address"
                              onChange={registerForm.handleChange}
                              defaultValue={registerForm.values.address}
                            />
                          </div>
                          {registerForm.errors.address ? (
                            <p style={{ color: "red" }}>
                              {registerForm.errors.address}
                            </p>
                          ) : null}
                        </div>
                      )}

                      {"vivran" in userData && (
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>विवरण </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="विवरण"
                              name="vivran"
                              onChange={registerForm.handleChange}
                              defaultValue={registerForm.values.vivran}
                            />
                          </div>
                          {registerForm.errors.vivran ? (
                            <p style={{ color: "red" }}>
                              {registerForm.errors.vivran}
                            </p>
                          ) : null}
                        </div>
                      )}
                      {"mno" in userData && (
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
                            <p style={{ color: "red" }}>
                              {registerForm.errors.mno}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>

                    <div className="row">
                      {"event" in userData && (
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>
                              {userType === "suchna" ? "सुचना" : "आयोजन"}{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="आयोजन"
                              name="event"
                              onChange={registerForm.handleChange}
                              defaultValue={registerForm.values.event}
                            />
                          </div>
                          {registerForm.errors.event ? (
                            <p style={{ color: "red" }}>
                              {registerForm.errors.event}
                            </p>
                          ) : null}
                        </div>
                      )}
                      {"date" in userData && (
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>दिनांक </label>
                            <input
                              type="date"
                              className="form-control"
                              placeholder=" दिनांक "
                              name="date"
                              onChange={registerForm.handleChange}
                              value={registerForm.values.date}
                            />
                          </div>
                          {registerForm.errors.date ? (
                            <p style={{ color: "red" }}>
                              {registerForm.errors.event}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <div className="row">
                      {"note" in userData && (
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>नोट </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="नोट"
                              name="note"
                              onChange={registerForm.handleChange}
                              defaultValue={registerForm.values.note}
                            />
                          </div>
                          {registerForm.errors.note ? (
                            <p style={{ color: "red" }}>
                              {registerForm.errors.note}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>

                    <button type="submit" className="btn btn-info">
                      रजिस्टर{" "}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
