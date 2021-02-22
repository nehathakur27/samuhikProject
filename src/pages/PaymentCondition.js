import React,{useState,useEffect} from 'react'
import SideBar from '../components/Sidebar'
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import { v4 as uuidv4 } from 'uuid';
import { useFormik,} from "formik";

export default function Payment(){
    
    const [dtypes,setdTypes] = useState([])
    let ref =  firestore.collection("receipts").doc("AllReceipts")

    useEffect(async () => {
      if (localStorage.getItem("logged") !== "true") {
        navigate("/");
      }
      const document = firestore.collection("donation_type")
      const activeRef =  await document.get()
        var dt = [];
        activeRef.forEach((docs) => {
          dt.push(docs.data())
        })
        
        setdTypes(dt)

    });


    const validate = (values) =>{
        
        const errors = {}
        if(values.pc ==="ghoshna"){
          if (!values.date) {
            errors.date = "Date Required";
          }
          if (!values.donation) {
            errors.donation = "Donation Required";
          }
          if (!values.amt) {
            errors.amt = "Amount Required";
          }
        }else if(values.pc === "due"){
          if (!values.drno) {
            errors.drno = "Reciept Number Required";
          }
          if (!values.ddate) {
            errors.ddate = "Date Required";
          }
          if (!values.ddonation) {
            errors.ddonation = "Donation Required";
          }
          if (!values.damt) {
            errors.damt = "Amount Required";
          }
        }else{
          if (!values.rrno) {
            errors.rrno = "Reciept Number Required";
          }
          if (!values.pm) {
            errors.pm = "Payment Mode Required";
          }
          if (!values.rdate) {
            errors.rdate = "Date Required";
          }
          if (!values.rdonation) {
            errors.rdonation = "Donation Required";
          }
          if (!values.ramt) {
            errors.ramt = "Amount Required";
          }
        }
        return errors;
      }
       const newFormik = useFormik({
          initialValues: {
           rno:"",
           amt:"",
           date:"",
           donation:"",
           pc:"",
           drno:"",
           ddate:"",
           ddonation:"",
           damt:"",
           dntp:"",
           rrno:"",
           rdate:"",
           rdonation:"",
           ramt:"",
           rntp:"",
           pm:"",
           note:"",
           rnote:"",
           dnote:"",
          },
           validate,
          onSubmit: async (values) => {
              //console.log(values)
              let uid = localStorage.getItem("userid")
              let id = uuidv4()
              //console.log(uid);
              if(values.pc === "ghoshna"){
                const ghoshna_data = {
                  gid:id,
                  uid:uid,
                  date:values.date,
                  amount:values.amt,
                  donation:values.donation,
                  note:values.note,
                  type:"ghoshna"
               }
               console.log(ghoshna_data);
               //add in ghoshna
                firestore
                .collection("all_receipts")
                // .doc("AllReceipts")
                // .collection("ghoshna")
                .doc(id)
                .set(ghoshna_data,{merge : true})
                .then(function () {
                   console.log("success");
                   //update in entries
                    firestore
                    .collection("entries")
                    .doc(uid)
                    .update({
                      "ghoshna":true
                    })
                    console.log("updated");
                    localStorage.removeItem("userid")
                    navigate("/home")
                })
  
              }else if(values.pc === "due"){
                console.log("due val",values);
  
                const due_data = {
                  did:id,
                  uid:uid,
                  date:values.ddate,
                  amount:values.damt,
                  donation:values.ddonation,
                  reciept_no:values.drno,
                  ntp:values.dntp,
                  note:values.dnote,
                  type:"due",
               }
              //  console.log(due_data);
              firestore.collection("all_receipts")
              .where("reciept_no","==",values.drno)
              .get()
              .then(function (deets){
                if(deets.size > 0)
                 {
                  alert("Reciept Number already exists");
                 }else{
                        firestore
                          .collection("all_receipts")
                          // .doc("AllReceipts")
                          // .collection("due")
                          .doc(id)
                          .set(due_data,{merge : true})
                          .then(function () {
                            console.log("success");
                            //update in entries
                              firestore
                              .collection("entries")
                              .doc(uid)
                              .update({
                                "due":true
                              })
                              console.log("updated");
                              localStorage.removeItem("userid")
                              navigate("/home")
                          })
                 }
              })
              
              }else{
                  const rec_data = {
                    rid:id,
                    uid:uid,
                    date:values.rdate,
                    amount:values.ramt,
                    donation:values.rdonation,
                    reciept_no:values.rrno,
                    ntp:values.rntp,
                    note:values.rnote,
                    type:"received"
                 }
                 console.log(rec_data);
                 //check rrno
                 firestore.collection("all_receipts")
                 .where("reciept_no","==",values.rrno)
                 .get()
                 .then(function (deets){
                   if(deets.size > 0)
                    {
                     alert("Reciept Number already exists");
                    }else{
                           firestore
                             .collection("all_receipts")
                            //  .doc("AllReceipts")
                            //  .collection("recieved")
                             .doc(id)
                             .set(rec_data,{merge : true})
                             .then(function () {
                               console.log("success");
                               //update in entries
                                 firestore
                                 .collection("entries")
                                 .doc(uid)
                                 .update({
                                   "received":true
                                 })
                                 console.log("updated");
                                 localStorage.removeItem("userid")
                                 navigate("/home")
                             })
                    }
                 }) 
                 
              }
              
          }
        })

        
    return(
        <div>
            <SideBar />
            <div className="content-wrapper">
                {/* ye */}
                <div className="content-header">
                    <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        <h1 className="m-0 text-dark">Payment Method</h1>
                        </div>
                    </div>
                    </div>
                </div>
                {/* idhar */}
                <section className="content">
                  <div className="container-fluid">
                    <div className="card">
                     <div className="card-body">
                     <form  onSubmit = {newFormik.handleSubmit}>
                        <div>
                            <div className="form-group">
                                <label>Payment Type</label>
                                    <select 
                                        className="form-control"
                                        name="pc" 
                                        onChange={newFormik.handleChange}
                                        value={newFormik.values.pc}
                                    >
                                        <option value="" disabled selected>Select one</option>
                                        <option value="ghoshna">Ghoshna</option>
                                        <option value="due">Due</option>
                                        <option value="received">Received</option>
                                    </select>
                            </div>
                        </div>
                        {newFormik.values.pc === "ghoshna" && 
                        <div>
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
                            {newFormik.errors.date ? 
                                    (<p style={{color:"red"}}>{ newFormik.errors.date}</p>) : null
                                }
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
                                <option value="" disabled selected>Select one</option>
                                {dtypes.map((dt) => 
                                    <option value={dt.id}>{dt.name}</option>
                                )}
                            </select>
                        </div>
                        {newFormik.errors.donation ? 
                                (<p style={{color:"red"}}>{ newFormik.errors.donation}</p>) : null
                            }
                          </div>
                      </div>
                     <div className = "row">
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
                        
                        {newFormik.errors.amt ? 
                                (<p style={{color:"red"}}>{ newFormik.errors.amt}</p>) : null
                            }
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
                        </div>
                        }

                    {newFormik.values.pc === "due" && (
                        <div>
                           <div className="row">
                            <div className="col-sm-6">
                            <div className="form-group">
                                <label>रसीद नंबर </label>
                                <input 
                                    type="text" 
                                    placeholder="रसीद नंबर " 
                                    name="drno" 
                                    className="form-control"
                                    onChange={newFormik.handleChange}
                                    value={newFormik.values.drno}
                                /> 
                            </div>
                            {newFormik.errors.drno ? (<p style={{color:"red"}}>{ newFormik.errors.drno}</p>) : null}
                            </div>
                            <div className="col-sm-6">
                        <div className="form-group">
                            <label>दिनांक </label>
                            <input 
                                type="date"
                                placeholder="दिनांक " 
                                className="form-control"
                                name="ddate"
                                onChange={newFormik.handleChange}
                            />
                        </div>
                        {newFormik.errors.ddate ? (<p style={{color:"red"}}>{ newFormik.errors.ddate}</p>) : null}
                        </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                            <div className="form-group">
                                <label>बाकी राशि </label>
                                <input 
                                    type="number"
                                    placeholder="बाकी राशि "
                                    name="damt"
                                    className="form-control"
                                    onChange={newFormik.handleChange}
                                    value={newFormik.values.damt}
                                />
                            </div>
                            {newFormik.errors.damt ? (<p style={{color:"red"}}>{ newFormik.errors.damt}</p>) : null}
                            </div>
                            <div className="col-sm-6">
                            <div className="form-group">
                                <label >दान के प्रकार</label>
                                <select 
                                    name="ddonation"
                                    value={newFormik.values.ddonation}
                                    className="form-control"
                                    onChange={newFormik.handleChange}
                                    tw="w-full p-3 bg-white rounded-md font-medium border border-gray-500 text-sm focus:outline-none focus:border-gray-400"
                                >
                                    <option value="" disabled selected>Select one</option>
                                    {dtypes.map((dt) => 
                                    <option value={dt.id}>{dt.name}</option>
                                )}
                                </select>
                            </div>
                            {newFormik.errors.ddonation ? (<p style={{color:"red"}}>{ newFormik.errors.ddonation}</p>) : null}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6">
                            
                            <div className="form-group">
                                <label>Name to be Printed</label>
                                <input 
                                    type="text" 
                                    placeholder="Name to be printed" 
                                    name="dntp"
                                    className="form-control"
                                    onChange={newFormik.handleChange}
                                    value={newFormik.values.dntp}
                            />
                            </div>
                            {newFormik.errors.dntp ? (<p style={{color:"red"}}>{ newFormik.errors.dntp}</p>) : null}
                            </div>
                            <div className="col-sm-6">
                            <div className="form-group">
                            <label>नोट </label>
                            <input 
                                type="text"
                                placeholder="नोट "
                                name="dnote" 
                                className="form-control"
                                value={newFormik.values.dnote}
                                onChange={newFormik.handleChange}
                            />
                        </div>
                        </div>
                        </div>
                            </div>
                        )}
                    
                    {newFormik.values.pc === "received" && (
                  <div>
                      <div className="row">
                        <div className="col-sm-6">
                        <div className="form-group">
                        <label >रसीद नंबर </label>
                        <input 
                            type="text" 
                            placeholder="रसीद नंबर " 
                            name="rrno" 
                            className="form-control" 
                            onChange={newFormik.handleChange}
                            value={newFormik.values.rrno}
                        />
                    </div>
                    {newFormik.errors.rrno ? (<p style={{color:"red"}}>{ newFormik.errors.rrno}</p>) : null}
                    </div>
                    <div className="col-sm-6">
                    <div className="form-group">
                      <label htmlFor="rdate">दिनांक </label>
                      <input 
                          type="date"
                          placeholder="दिनांक "
                          className="form-control"  
                          name="rdate"
                          onChange={newFormik.handleChange}
                      />
                  </div>
                  {newFormik.errors.rdate ? (<p style={{color:"red"}}>{ newFormik.errors.rdate}</p>) : null}
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
                              name="rntp"
                              onChange={newFormik.handleChange}
                             value={newFormik.values.rntp}
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
                            <option value="" disabled selected>Select one</option>
                            <option value="cheque">Cheque</option>
                            <option value="cash">Cash</option>
                            <option value="transfer">Bank Transfer</option>
                            <option value="gpay">Google Pay</option>
                            <option value="ptm">PayTm</option>
                            <option value="ppay">Phone Pay</option>
                        </select>
                    </div>
                    {newFormik.errors.pm ?(<p style={{color:"red"}}>{ newFormik.errors.pm}</p>) : null}
                    </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="form-group">
                        <label >दान  प्रकार </label>
                        <select 
                            name="rdonation"
                            value={newFormik.values.rdonation}
                            onChange={newFormik.handleChange}
                            className="form-control" 
                        >
                            <option value="" disabled selected>Select one</option>
                            {dtypes.map((dt) => 
                            <option value={dt.id}>{dt.name}</option>
                          )}
                        </select>
                    </div>
                    {newFormik.errors.rdonation ?(<p style={{color:"red"}}>{ newFormik.errors.rdonation}</p>) : null}
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                        <label>राशि</label>
                        <input 
                              type="text" 
                              placeholder="राशि" 
                              name="ramt"
                              className="form-control" 
                              onChange={newFormik.handleChange}
                             value={newFormik.values.ramt}
                       />
                    </div>
                    {newFormik.errors.ramt ? (<p style={{color:"red"}}>{ newFormik.errors.ramt}</p>) : null}
                    </div>
                    </div>
                     <div className="col-sm-6">
                        <div className="form-group">
                      <label htmlFor="rnote">नोट </label>
                      <input 
                         type="text"
                         placeholder="नोट "
                         name="rnote" 
                         className="form-control" 
                         value={newFormik.values.rnote}
                         onChange={newFormik.handleChange}
                      />
                  </div>
                  </div>
                  </div>
               )}
                    <button type="submit" className="btn btn-info">सबमिट  </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </section>
            </div>
        </div>
    )
}