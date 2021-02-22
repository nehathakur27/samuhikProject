import React,{useState,useEffect} from 'react'
import SideBar from '../components/Sidebar'
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import { useFormik,} from "formik";
import _ from 'underscore'

export default function Reports(){
    const [gaadiName,setGaadiName] = useState([]);
    const [villageName,setVillageName] = useState([])
    const [dtypes,setdTypes] = useState([])
    const [pro_data,setProData] = useState([])
    const[finalData,setFinalData] = useState(null);
    const [userData, setUserData] = useState(null)
    const [recData,setRecData] = useState(null)
    // const[ans,setAns] = useState([]);
    
    useEffect( () => {
        if (localStorage.getItem("logged") !== "true") {
            navigate("/");
          }
          loadGaadis()
          loadDonation()
    });

    useEffect(() => {
        if(recData !== null && userData!==null){
            console.log("rec",recData);
            console.log("user",userData);
        // let i = 0
        // for(let j =0;j<userData.length;j++){
        //     while(recData[i].uid === userData[j].uid){
        //         recData[i].name = userData[j].name
        //         recData[i].fname = userData[j].fname
        //         recData[i].gname = userData[j].gname
        //         recData[i].mnno = userData[j].mnno
        //         recData[i].address = userData[j].address
        //         i++;
        //     }
        // }
     }
    }, [recData])

    const loadDonation = async() =>{
        const document = firestore.collection("donation_type")
        const activeRef =  await document.get()
        var dt = [];
        activeRef.forEach((docs) => {
          dt.push(docs.data())
        })
        
        setdTypes(dt)
    }
    const loadGaadis = async() =>{
        const document = firestore.collection("gaadi_name")
        const activeRef =  await document.get()
          var gaadis = [];
          activeRef.forEach((docs) => {
            gaadis.push(docs.data())
          })
          
          setGaadiName(gaadis)
    }

    const loadVillages = async () =>{
        if(reportsForm.values.gname){
          const coll_name = "gaadi_name/"+reportsForm.values.gname+"/village_name"
          const document = await firestore.collection(coll_name).get()
          //console.log("gname",document.docs)
          var villages = []
          document.docs.map((village) => {
            villages.push(village.data())
          })
          // console.log(villages)
          setVillageName(villages)
        }else{
          alert("गादी का नाम डाले ")
        }
       
      }

      const validate = (values) =>{
        const errors = {}
       
        return errors
     }

     const getIds =   (dData) =>{
         console.log("getting ids");
         console.log("arg", dData);
         let uData = []
        dData.map(async (v,i) => {
            console.log("getting udata");
            const userData = await firestore.collection("entries").doc(v.uid).get();
            uData.push(userData.data())
         }
        )
        setFinalData(uData)
     }

    //  const getUserData = async (ids) =>{
    //     console.log("getting user data...");
    //     let uData = []
       
    //     ids.map(async (v,i) => {
    //        const userData = await firestore.collection("entries").doc(v).get();
    //     //    uData[v] = userData.data()
    //         uData.push(userData.data())
    //         console.log(userData.data());
    //     })
    //     setFinalData(uData)
    //  }

    //  const merge = (a1,a2) =>{
    //     var mergedList = _.map(a1, function(item){
    //         return _.extend(item, _.findWhere(a2, { id: item.id }));
    //     });
    //     setFinalData(mergedList)
    //  }

      const reportsForm = useFormik({
        initialValues: {
          vname:"",
          gname:"",
          reportType:"",
          pc:"",
          pm:"",
          donation:"",
        },
        validate,
        onSubmit: async(values) => {
          console.log("here",values)
        //   let ref =  firestore.collection("receipts").doc("AllReceipts")
          if(values.reportType === "pro"){
              console.log("searching for pro reports...");
                const data = await firestore.collection("all_receipts") .where("donation","==",values.donation).orderBy("date").get()
                var productData = []
                data.docs.forEach((docs) => {
                    productData.push(docs.data())
                })
                console.log("complete product data...",productData);
                setProData(productData)
                getIds(productData)
          }else if(values.reportType === "pt"){
              console.log("searching for pt reports...");
              const data = await firestore.collection("all_receipts") .where("type","==",values.pc).orderBy("date").get()
              var paymentTData = []
              data.docs.forEach((docs) => {
                    paymentTData.push(docs.data())
                })
              console.log("complete payment type data...",paymentTData);
              setProData(paymentTData)
              getIds(paymentTData)
          }else if(values.reportType === "place"){
              console.log("searching for place reports...");
              let userData = {};
              if(values.vname === "" && values.gname !== "")
                    { 
                        console.log("only gname");
                        userData = await firestore.collection("entries").where("gname" , "==" ,values.gname).orderBy("name").get()
                    }
              else if(values.vname !== "" && values.gname !== "")
                     {
                         console.log("both");
                         userData = await firestore.collection("entries").where("gname" , "==" ,values.gname).where("vname" ,"==",values.vname).orderBy("name").get()
                     }
              var placeData = [] 
              var placeUserData = []
              var ids = []
              userData.docs.forEach((docs) => {
                     //console.log(docs.id);
                     placeData.push(docs.data())
                     ids.push(docs.id)
               })
               ids.forEach(async (v) => {
                   console.log("Here",v);
                   firestore.collection("all_receipts")
                    .where("uid","==",v)
                    .get()
                    .then(function (data) {
                        console.log(data);
                        data.docs.forEach((docs) => {
                            console.log("dega data");
                            placeUserData.push(docs.data())
                            console.log(docs.data());
                       })
                    }).catch (err => console.log(err))  
               })



               setUserData(placeData)
               setRecData(placeUserData)
            //    console.log("complete place type data...",placeData);
            //     console.log("comp user place data..",placeUserData);
            //    setProData(placeData)
            //    setFinalData(placeUserData)
            //   getIds(paymentTData)
          }
              
        }
      })

    return(
        <div>
            <SideBar />
            <div className="content-wrapper">
              <section class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1>Reports</h1>
                    </div>
                    </div>
                </div>
              </section>

              {/* main content */}

              <section className="content">
                <div className="container-fluid">
                <div className="card">
                 <div className="card-body">
                    <form onSubmit = {reportsForm.handleSubmit}>
                        <div className="form-group">
                            <label>Generate reports according to : </label>
                            <select 
                                className="form-control"
                                name="reportType" 
                                onChange={reportsForm.handleChange}
                                value={reportsForm.values.reportType}
                            >
                                <option value="" disabled defaultValue="select">Select one</option>
                                <option value="place">Gaadi and Village</option>
                                <option value="pt">Payment Type</option>
                                <option value="pro">Product</option>
                            </select>
                        </div>

                        {/* gname and vname type */}
                        { reportsForm.values.reportType === "place" && 
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                        <label>गादी का नाम </label>
                                        <select 
                                            className="form-control"
                                            name="gname" 
                                            value={reportsForm.values.gname}
                                            onChange={reportsForm.handleChange}
                                        >
                                            <option value="" disabled defaultValue="select">Select one</option>
                                            { gaadiName.map((gaadi) => 
                                                <option value={gaadi.id}>{gaadi.name}</option>
                                            )}
                                        </select>
                                </div>
                            </div>   
                            <div className="col-sm-6">
                                <div className="form-group" onClick ={() => loadVillages()}>
                                            <label>गांव का नाम </label>
                                            <select 
                                                className="form-control"
                                                name="vname" 
                                                value={reportsForm.values.vname}
                                                onChange={reportsForm.handleChange}
                                            >
                                            <option value="" disabled defaultValue="select">Select one</option>
                                            { villageName.map((vname) => 
                                                <option value={vname.id}>{vname.name}</option>
                                            )}
                                            </select>
                                </div>
                            </div>
                        </div>
                        }

                        {/* payment type reports */}
                        {reportsForm.values.reportType === "pt" && 
                            <div className="form-group">
                                <label>Payment Type</label>
                                    <select 
                                        className="form-control"
                                        name="pc" 
                                        onChange={reportsForm.handleChange}
                                        value={reportsForm.values.pc}
                                    >
                                        <option value="" disabled selected>Select one</option>
                                        <option value="ghoshna">Ghoshna</option>
                                        <option value="due">Due</option>
                                        <option value="received">Received</option>
                                    </select>
                            </div>
                        }

                        {/* product type reports */}
                        {reportsForm.values.reportType === "pro" &&
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label >दान के प्रकार</label>
                                        <select 
                                            name="donation"
                                            value={reportsForm.values.donation}
                                            className="form-control"
                                            onChange={reportsForm.handleChange}
                                        >
                                            <option value="" disabled selected>Select one</option>
                                            {dtypes.map((dt) => 
                                            <option value={dt.id}>{dt.name}</option>
                                        )}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="pm">Payment Mode</label>
                                        <select 
                                            name="pm"
                                            value={reportsForm.values.pm}
                                            className="form-control" 
                                            onChange={reportsForm.handleChange}
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
                                    </div>
                            </div>
                        }

                        <button type="submit" className="btn btn-info">रिपोर्ट्स </button>
                    </form>
                  </div>
                </div>
                <div>
                </div>
                   <div className="row">
                    <div className="col-12">
                        <div className="card">
                        <div className="card-header">
                            {reportsForm.values.reportType == "pro" && 
                            <h3 className="card-title">Reports</h3>}
                        </div>
                        <div className="card-body">
                            <table id="example2" className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>Father's Name</th>
                                <th>Address</th>
                                <th>Village Name</th>
                                <th>Gaadi Name</th>
                                <th>Mobile Number</th>
                                <th>Donation For</th>
                                <th>Payment type</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Reciept Number</th>
                                <th>Name to be Printed</th>
                                <th>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                            { reportsForm.values.reportType !== "place" && pro_data && finalData && finalData.map((val,i) => 
                                <tr>
                                        <td>{val.name}</td>
                                        <td>{val.fname}</td>
                                        <td>{val.address}</td>
                                        <td>{val.vname}</td>
                                        <td>{val.gname}</td>
                                        <td>{val.mnno}</td>
                                        <td>{pro_data[i].donation}</td>
                                        <td>{pro_data[i].type}</td>
                                        <td>{pro_data[i].date}</td>
                                        <td>{pro_data[i].amount}</td>
                                        {pro_data[i].reciept_no  && <td>{pro_data[i].reciept_no}</td>}
                                        {pro_data[i].ntp  &&<td>{pro_data[i].ntp}</td>}
                                        <td>{pro_data[i].note}</td>
                                </tr>
                            )}
                            {reportsForm.values.reportType == "place"  && recData && recData.map((val,i) => 
                                <tr>
                                        <td>{val.name}</td>
                                        <td>{val.fname}</td>
                                        <td>{val.address}</td>
                                        <td>{val.vname}</td>
                                        <td>{val.gname}</td>
                                        <td>{val.mnno}</td>
                                        <td>{val.amount}</td>
                                        <td>{val.type}</td>
                                        <td>{val.date}</td>
                                        {val.reciept_no  && <td>{val.reciept_no}</td>}
                                        <td>{val.amount}</td>
                                        {val.ntp  &&<td>{val.ntp}</td>}
                                        <td>{val.note}</td>
                                </tr>
                            )}
                              
                            </tbody>
                            
                            </table>
                        </div>
                        </div>
                        
                    </div>
                    </div>
                    {/* /.row */}
                    
                </div>
                {/* /.container-fluid */}
                </section>


            </div>
        </div>
    )
}