import React, { useState } from "react";
import SideBar from "../components/Sidebar";
import { useFormik } from "formik";
import { navigate } from "hookrouter";
import { firestore, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const Video = () => {
  const [fieldValue, setFieldValue] = useState({});
  const [uploadPercent, setUploadPercent] = useState(0);
  const [imgUrl, setImgUrl] = useState();
  
  var storageRef = storage.ref();

  const validate = (values) => {
    console.log("in validate");
    const errors = {};
    if (!fieldValue) {
      errors.file = "Video Required";
    }
    if (!values.event) {
      errors.event = "Event Required";
    }

    return errors;
  };

  const videoUpload = async (pid) => {
    // console.log("image upload",fieldValue);
    if (fieldValue) {
      var metadata = {
        contentType: fieldValue.type,
      };
      const uploadTask = storageRef.child(`video/${pid}`).put(fieldValue,metadata);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadPercent(progress);
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            reject(error);
          },
          () => {
            storageRef
              .child(`video/${pid}`)
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
      event: "",
      date:"",
      file: "",
    },
    validate,
    onSubmit: async (values) => {
      console.log(values);
      const url = await videoUpload(values.pid);
      // console.log("file",fieldValue);
      const data = {
        pid: values.pid,
        event: values.event,
        date: values.date,
        video: url,
      };
      firestore
        .collection("video")
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
                  <label>आयोजन </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="आयोजन "
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
                {uploadPercent ? (
                    <span>
                      Video Upload Progress: {uploadPercent}
                      {"%"}
                    </span>
                  ) : null}
              </div>
            </div>

            <button type="submit" className="btn btn-info">
              ऐड करे{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Video;
