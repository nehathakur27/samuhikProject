import React, { useState, useEffect } from "react";
import SideBar from "../components/Sidebar";
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import { useFormik } from "formik";

function EditUser({ id }) {
  // console.log("rno:",rno);
  const [dtypes, setdTypes] = useState([]);
  const [val, setVal] = useState({});
  const [gaadiName, setGaadiName] = useState([]);
  const [villageName, setVillageName] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("logged") !== "true") {
      navigate("/");
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const document = firestore.collection("donation_type");
    const activeRef = await document.get();
    var dt = [];
    activeRef.forEach((docs) => {
      dt.push(docs.data());
    });
    setdTypes(dt);
  };
  useEffect(() => {
    loadUserData();
    loadGaadis();
    console.log("val", val);
  }, [id.id]);

  const loadUserData = async () => {
    var userData = [];
    var recieptData = [];
    var ids;
    const getData = firestore
      .collection("all_receipts")
      .where("id", "==", id.id);
    const exeGetData = await getData.get();
    exeGetData.forEach((d) => {
      recieptData.push(d.data());
      ids = d.data().uid;
    });
    const query = firestore.collection("entries").where("uid", "==", ids);
    const exe = await query.get();
    exe.forEach((d) => {
      userData.push(d.data());
    });
    var final = { ...userData[0], ...recieptData[0] };
    setVal(final);
  };

  const loadGaadis = async () => {
    const document = firestore.collection("gaadi_name");
    const activeRef = await document.get();
    var gaadis = [];
    activeRef.forEach((docs) => {
      gaadis.push(docs.data());
    });

    setGaadiName(gaadis);
  };

  const loadVillages = async () => {
    if (newFormik.values.gname) {
      const coll_name =
        "gaadi_name/" + newFormik.values.gname + "/village_name";
      const document = await firestore.collection(coll_name).get();
      //console.log("gname",document.docs)
      var villages = [];
      document.docs.map((village) => {
        villages.push(village.data());
      });
      // console.log(villages)
      setVillageName(villages);
      loadVillages();
    } else {
      alert("गादी का नाम डाले ");
    }
  };

  const validate = (values) => {
    console.log("in validate");
    const errors = {};
    if (!values.type) {
      errors.type = "Type Required";
    }
    if (!values.address) {
      errors.address = "Address Required";
    }
    if (values.type !== "ghoshna" && !values.reciept_no) {
      errors.reciept_no = "Reciept No Required";
    }
    if (!values.donation) {
      errors.donation = "Donation Type Required";
    }
    if (!values.date) {
      errors.date = "Date Required";
    }
    if (!values.name) {
      errors.name = "Name Required";
    }
    if (!values.vname) {
      errors.vname = "Village Name Required";
    }
    if (!values.mnno.match(/^\d{10}$/)) {
      errors.mnno = "Invalid Phone Number. 10 Digits Required";
    }
    if (!values.gname) {
      errors.gname = "Gaadi Name Required";
    }
    if (!values.amount) {
      errors.amount = "Amount  Required";
    }
    return errors;
  };

  const newFormik = useFormik({
    initialValues: val,
    enableReinitialize: true,
    validate,
    onSubmit: (values) => {
      // console.log(values);
      // console.log("val rec",val);
      const uid = val.uid;
      if (values.type === "ghoshna") {
        values.reciept_no = "";
        values.ntp = "";
      }

      const user_data = {
        address: values.address,
        fname: values.fname,
        due: values.type === "due",
        ghoshna: values.type === "ghoshna",
        received: values.type === "received",
        gname: values.gname,
        mnno: values.mnno,
        name: values.name,
        vname: values.vname,
      };
      const rec_data = {
        type: values.type,
        amount: values.amount,
        date: values.date,
        donation: values.donation,
        note: values.note,
        ntp: values.ntp,
        id: id.id,
      };
      console.log(values);
      firestore
        .collection("entries")
        .doc(uid)
        .set(user_data, { merge: true })
        .then(function () {
          firestore
            .collection("all_receipts")
            .doc(id.id)
            .set(rec_data, { merge: true })
            .then(function () {
              navigate("/search");
            });
        });
    },
  });
  return (
    <div>
      <SideBar />
      <div className="content-wrapper">
        {/* ye */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Edit User</h1>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <form onSubmit={newFormik.handleSubmit}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          // placeholder="Name"
                          className="form-control"
                          name="name"
                          defaultValue={newFormik.values.name}
                          onChange={newFormik.handleChange}
                        />
                      </div>
                      {newFormik.errors.name ? (
                        <p style={{ color: "red" }}>{newFormik.errors.name}</p>
                      ) : null}
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>गादी का नाम </label>
                        <select
                          className="form-control"
                          name="gname"
                          value={newFormik.values.gname}
                          onChange={newFormik.handleChange}
                        >
                          <option value="" disabled selected>
                            Select one
                          </option>
                          {gaadiName.map((gaadi) => (
                            <option value={gaadi.id}>{gaadi.name}</option>
                          ))}
                        </select>
                      </div>
                      {newFormik.errors.gname ? (
                        <p style={{ color: "red" }}>{newFormik.errors.gname}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div
                        className="form-group"
                        onClick={() => loadVillages()}
                      >
                        <label>गांव का नाम </label>
                        <select
                          className="form-control"
                          name="vname"
                          value={newFormik.values.vname}
                          onChange={newFormik.handleChange}
                        >
                          <option value="" disabled selected>
                            Select one
                          </option>
                          {villageName.map((vname) => (
                            <option value={vname.id}>{vname.name}</option>
                          ))}
                        </select>
                      </div>
                      {newFormik.errors.vname ? (
                        <p style={{ color: "red" }}>{newFormik.errors.vname}</p>
                      ) : null}
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          // placeholder="Name"
                          className="form-control"
                          name="address"
                          defaultValue={newFormik.values.address}
                          onChange={newFormik.handleChange}
                        />
                      </div>
                      {newFormik.errors.address ? (
                        <p style={{ color: "red" }}>
                          {newFormik.errors.address}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Mobile</label>
                        <input
                          type="text"
                          // placeholder="Name"
                          className="form-control"
                          name="mnno"
                          defaultValue={newFormik.values.mnno}
                          onChange={newFormik.handleChange}
                        />
                      </div>
                      {newFormik.errors.mnno ? (
                        <p style={{ color: "red" }}>{newFormik.errors.mnno}</p>
                      ) : null}
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Type</label>
                        <select
                          className="form-control"
                          name="type"
                          onChange={newFormik.handleChange}
                          value={newFormik.values.type}
                        >
                          <option value="" disabled selected>
                            Select one
                          </option>
                          <option value="ghoshna">Ghoshna</option>
                          <option value="due">Due</option>
                          <option value="received">Received</option>
                        </select>
                      </div>
                      {newFormik.errors.type ? (
                        <p style={{ color: "red" }}>{newFormik.errors.type}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    {newFormik.values.type !== "ghoshna" && (
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Reciept No</label>
                          <input
                            type="text"
                            // placeholder="Name"
                            className="form-control"
                            name="reciept_no"
                            readOnly
                            defaultValue={newFormik.values.reciept_no}
                            onChange={newFormik.handleChange}
                          />
                        </div>
                        {newFormik.errors.reciept_no ? (
                          <p style={{ color: "red" }}>
                            {newFormik.errors.reciept_no}
                          </p>
                        ) : null}
                      </div>
                    )}

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
                          {dtypes.map((dt) => (
                            <option value={dt.id}>{dt.name}</option>
                          ))}
                        </select>
                      </div>
                      {newFormik.errors.donation ? (
                        <p style={{ color: "red" }}>
                          {newFormik.errors.donation}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          type="date"
                          placeholder="Date"
                          className="form-control"
                          name="date"
                          defaultValue={newFormik.values.date}
                          onChange={newFormik.handleChange}
                        />
                      </div>
                      {newFormik.errors.date ? (
                        <p style={{ color: "red" }}>{newFormik.errors.date}</p>
                      ) : null}
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Amount</label>
                        <input
                          type="text"
                          // placeholder="Name"
                          className="form-control"
                          name="amt"
                          defaultValue={newFormik.values.amount}
                          onChange={newFormik.handleChange}
                        />
                      </div>
                      {newFormik.errors.amt ? (
                        <p style={{ color: "red" }}>{newFormik.errors.amt}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Note</label>
                        <input
                          type="text"
                          // placeholder="Name"
                          className="form-control"
                          name="note"
                          defaultValue={newFormik.values.note}
                          onChange={newFormik.handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Name to be printed</label>
                        <input
                          type="text"
                          // placeholder="Name"
                          className="form-control"
                          name="ntp"
                          defaultValue={newFormik.values.ntp}
                          onChange={newFormik.handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-info">
                    Edit{" "}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EditUser;
