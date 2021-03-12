import React,{useEffect,useState} from "react";
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";

export default function Ghoshna(props) {
    const [dtype,setdTypes] = useState([])

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
    });

  const validate = (values) => {
    const errors = {};
    if (!values.date) {
      errors.date = "Date Required";
    }
    if (!values.donation) {
      errors.donation = "Donation Required";
    }
    if (!values.amt) {
      errors.amt = "Amount Required";
    }

    return errors;
  };
  const newFormik = useFormik({
    initialValues: {
      rno: "",
      amt: "",
      date: "",
      donation: "",
      note: "",
    },
    validate,
    onSubmit: async (values) => {
      //console.log(values)
      let uid = localStorage.getItem("userid");
      let id = uuidv4();
      //console.log(uid);
      const ghoshna_data = {
        id: id,
        uid: uid,
        date: values.date,
        amount: values.amt,
        donation: values.donation,
        note: values.note,
        type: "ghoshna",
      };
      console.log(ghoshna_data);
      //add in ghoshna
      firestore
        .collection("all_receipts")
        .doc(id)
        .set(ghoshna_data, { merge: true })
        .then(function () {
          console.log("success");
          //update in entries
          firestore.collection("entries").doc(uid).update({
            ghoshna: true,
          });
          console.log("updated");
          localStorage.removeItem("userid");
          navigate("/home");
        });
    },
  });

  return (
    <div>
      <div>
        <form onSubmit={newFormik.handleSubmit}>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>दिनांक </label>
                <input
                  type="date"
                  placeholder="Date"
                  className="form-control"
                  name="date"
                  onChange={newFormik.handleChange}
                />
              </div>
              {newFormik.errors.date ? (
                <p style={{ color: "red" }}>{newFormik.errors.date}</p>
              ) : null}
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label>दान के प्रकार </label>
                <select
                  name="donation"
                  value={newFormik.values.donation}
                  className="form-control"
                  onChange={newFormik.handleChange}
                  tw="w-full p-3 bg-white rounded-md font-medium border border-gray-500 text-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="" disabled selected>
                    Select one
                  </option>
                  {dtype.map((dt) => (
                    <option value={dt.id}>{dt.name}</option>
                  ))}
                </select>
              </div>
              {newFormik.errors.donation ? (
                <p style={{ color: "red" }}>{newFormik.errors.donation}</p>
              ) : null}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>राशि </label>
                <input
                  type="text"
                  placeholder="राशि"
                  name="amt"
                  className="form-control"
                  value={newFormik.values.amt}
                  onChange={newFormik.handleChange}
                />
              </div>

              {newFormik.errors.amt ? (
                <p style={{ color: "red" }}>{newFormik.errors.amt}</p>
              ) : null}
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label>नोट </label>
                <input
                  type="text"
                  placeholder="नोट "
                  name="note"
                  className="form-control"
                  value={newFormik.values.note}
                  onChange={newFormik.handleChange}
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-info">
            सबमिट{" "}
          </button>
        </form>
      </div>
    </div>
  );
}
