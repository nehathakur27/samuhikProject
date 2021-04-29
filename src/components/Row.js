import { firestore } from "../firebase.config";
import React, { useEffect, useState } from "react";

export default function Row({ gname }) {
  const [vName, setvName] = useState({});

  useEffect(() => {
    console.log("cur", gname);
    loadData();
  }, []);

  const loadData = async () => {
    var villages = [];
    const coll_name = "gaadi_name/" + gname.id + "/village_name";
    const q = firestore.collection(coll_name);
    const ref = await q.get();
    ref.forEach(function (docs) {
      console.log("vil docs", docs.data());
      villages.push(docs.data());
    });
    if (villages.length === 0) {
      console.log("khaali");
      villages.push({ name: "no villages " });
      setvName({ ...vName, villages });
    } else setvName({ ...vName, villages });
  };

  // useEffect(() => {
  //     console.log("vname", vName);

  // },[vName])

  const deleteType = (id) => {
    console.log("id", id);
    var data = [];
    vName.villages.map((d) => {
      if (d.id !== id) {
        data.push(d);
      }
    });
    console.log("orginial", vName);
    console.log("after del", data);
    setvName(data);
    const coll_name = "gaadi_name/" + gname.name + "/village_name";
    const query = firestore.collection(coll_name).where("id", "==", id);
    const exe = query.get().then(function (q) {
      q.forEach(function (doc) {
        doc.ref.delete();
        alert("Successfully Deleted");
      });
    });
  };

  return (
    <tbody >
      {vName &&
        vName.villages &&
        vName.villages.map((val, i) => (
          <tr>
            <td>{gname.name}</td>
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
  );
}
