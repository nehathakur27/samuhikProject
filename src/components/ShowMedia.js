import React, { useState, useEffect } from "react";
import { navigate } from "hookrouter";
import { firestore, storage } from "../firebase.config";
import ReactPlayer from "react-player";

export default function ShowMedia({ type }) {
  const [finalData, setFinalData] = useState([]);
  var storageRef = storage.ref();

  useEffect(() => {
    const fetchData = async () => {
      const query = firestore.collection(type);
      const exeQuery = await query.get();
      var data = [];

      exeQuery.forEach((d) => {
        data.push(d.data());
      });

      console.log("data", data);
      setFinalData(data);
    };
    fetchData();
  }, []);

  const deleteMedia = (id) => {
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
        var folder = type === "photo" ? "images" :"video"
        const delRef = storageRef.child(`${folder}/${id}`);
        delRef
          .delete()
          .then(function () {
            alert("Media deleted");
          })
          .catch(function (err) {
            console.log("Error deleting");
          });
      });
    });
  };
  return (
    <div>
      {finalData.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {finalData.map((val, i) => (
            <div style={{ flexBasis: "33.33%" }}>
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <h3>{val.event}</h3>
                  </div>
                </div>
                <div className="card-body">
                  {type === "photo" ? (
                    <img
                      src={val.image}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <ReactPlayer url={val.video} controls={true} width="100%" />
                  )}
                </div>
                <div className="card-footer">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    <h6>{val.date}</h6>
                    <div>
                      <span
                        onClick={() => deleteMedia(val.pid)}
                        style={{ color: "blue" }}
                      >
                        <i
                          className="fas fa-trash"
                          style={{ color: "red" }}
                        ></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
