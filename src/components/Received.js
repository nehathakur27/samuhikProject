import React,{useState,useEffect} from "react";
import { firestore } from "../firebase";
import { navigate } from "hookrouter";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";

export default function Received() {
  const [dtype, setdTypes] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("logged") !== "true") {
      navigate("/");
    }
    fetchData()
  });

  const fetchData = async () => {
    const document = firestore.collection("donation_type");
    const activeRef = await document.get();
    var dt = [];
    activeRef.forEach((docs) => {
      dt.push(docs.data());
    });

    setdTypes(dt);
  }

  const validate = (values) => {
    const errors = {};

    if (!values.rno) {
      errors.rno = "Reciept Number Required";
    }
    if (!values.pm) {
      errors.pm = "Payment Mode Required";
    }
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
      note: "",
      rno: "",
      date: "",
      donation: "",
      amt: "",
      ntp: "",
      pm: "",
    },
    validate,
    onSubmit: async (values) => {
      //console.log(values)
      let uid = localStorage.getItem("userid");
      let id = uuidv4();
      console.log("due val", values);
      const rec_data = {
        id: id,
        uid: uid,
        date: values.date,
        amount: values.amt,
        donation: values.donation,
        reciept_no: values.rno,
        ntp: values.ntp,
        note: values.note,
        type: "received",
      };
      console.log(rec_data);
      //check rrno
      firestore
        .collection("all_receipts")
        .where("reciept_no", "==", values.rno)
        .get()
        .then(function (deets) {
          if (deets.size > 0) {
            alert("Reciept Number already exists");
          } else {
            firestore
              .collection("all_receipts")
              //  .doc("AllReceipts")
              //  .collection("recieved")
              .doc(id)
              .set(rec_data, { merge: true })
              .then(function () {
                console.log("success");
                //update in entries
                firestore.collection("entries").doc(uid).update({
                  received: true,
                });
                console.log("updated");
                localStorage.removeItem("userid");
                navigate("/home");
              });
          }
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
                <label>रसीद नंबर </label>
                <input
                  type="text"
                  placeholder="रसीद नंबर "
                  name="rno"
                  className="form-control"
                  onChange={newFormik.handleChange}
                  value={newFormik.values.rno}
                />
              </div>
              {newFormik.errors.rno ? (
                <p style={{ color: "red" }}>{newFormik.errors.rno}</p>
              ) : null}
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="rdate">दिनांक </label>
                <input
                  type="date"
                  placeholder="दिनांक "
                  className="form-control"
                  name="date"
                  onChange={newFormik.handleChange}
                />
              </div>
              {newFormik.errors.date ? (
                <p style={{ color: "red" }}>{newFormik.errors.date}</p>
              ) : null}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="rntp">Name to be Printed</label>
                <input
                  type="text"
                  placeholder="Name to be printed"
                  className="form-control"
                  name="ntp"
                  onChange={newFormik.handleChange}
                  value={newFormik.values.ntp}
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="pm">Payment Mode</label>
                <select
                  name="pm"
                  value={newFormik.values.pm}
                  className="form-control"
                  onChange={newFormik.handleChange}
                  tw="w-full p-3 bg-white rounded-md font-medium border border-gray-500 text-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="" disabled selected>
                    Select one
                  </option>
                  <option value="cheque">Cheque</option>
                  <option value="cash">Cash</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="gpay">Google Pay</option>
                  <option value="ptm">PayTm</option>
                  <option value="ppay">Phone Pay</option>
                </select>
              </div>
              {newFormik.errors.pm ? (
                <p style={{ color: "red" }}>{newFormik.errors.pm}</p>
              ) : null}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>दान प्रकार </label>
                <select
                  name="donation"
                  value={newFormik.values.donation}
                  onChange={newFormik.handleChange}
                  className="form-control"
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
            <div className="col-sm-6">
              <div className="form-group">
                <label>राशि</label>
                <input
                  type="text"
                  placeholder="राशि"
                  name="amt"
                  className="form-control"
                  onChange={newFormik.handleChange}
                  value={newFormik.values.amt}
                />
              </div>
              {newFormik.errors.amt ? (
                <p style={{ color: "red" }}>{newFormik.errors.amt}</p>
              ) : null}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="note">नोट </label>
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
          <button type="submit" className="btn btn-info">
            सबमिट{" "}
          </button>
        </form>
      </div>
    </div>
  );
}
