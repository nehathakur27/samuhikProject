import React,{useState,useEffect} from "react"
import { firestore } from "../firebase";
import { navigate } from "hookrouter";
import { useFormik,} from "formik";
import _ from 'underscore'
import Display from './Display'

const GVSearch = (props) => {
    const [gaadiName,setGaadiName] = useState([]);
    const [villageName,setVillageName] = useState([])  
    const [usersData, setUserData] = useState([]);
    const [recData, setRecData] = useState([]);

    useEffect( () => {
        if (localStorage.getItem("logged") !== "true") {
            navigate("/");
          }
          loadGaadis()
    },[]);
    

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
        if(searchForm.values.gname){
          const coll_name = "gaadi_name/"+searchForm.values.gname+"/village_name"
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

    const mergeData = () =>{
        // console.log("ud ",usersData);
        // console.log("rec ",recData);
        // console.log("ud len",usersData.length);
        //  console.log("rec len",recData.length);
        if(usersData.length > 0 && recData.length > 0)
           {
                console.log("callback userdata",usersData);
                console.log("callback recData",recData);    
                props.parentCallback(usersData,recData)
            }else if( usersData.length === 0 || recData.length === 0){
                props.parentCallback(usersData,recData)
                // alert("No data found")

            }
    }

   
    const searchForm = useFormik({
        initialValues:{
          gname:"",
          vname:"",
        },
        onSubmit: async(values) => {
            console.log(values);
            if(values.gname.length > 0 && values.vname.length > 0){
                const query = firestore.collection("entries").where("gname","==",values.gname) .where("vname","==",values.vname) 
                const exeQuery = await query.get();
                let userData = []
                let ids = []
                let recieptData = []

                for(const doc of exeQuery.docs){
                    userData.push(doc.data())
                    ids.push(doc.id);
                }
                setUserData(userData)
                ids.forEach(async (id) => {
                    const getData = firestore.collection("all_receipts").where("uid" ,"==",id)
                    const exeGetData = await getData.get()
                   for(const d of exeGetData.docs){
                        recieptData.push(d.data())
                    }
                    setRecData(recieptData)
                })    
                 
            mergeData() 

            }else if(values.gname.length > 0  && values.vname.length === 0){
                const query = firestore.collection("entries").where("gname","==",values.gname)
                const exeQuery = await query.get();
                var userData = []
                var ids = []
                var recieptData = []
               
                exeQuery.forEach((d) => {
                    userData.push(d.data())
                    ids.push(d.id);
                })
                console.log(userData);
                setUserData(userData)
                ids.forEach(async (id) => {
                    const getData = firestore.collection("all_receipts").where("uid" ,"==",id)
                    const exeGetData = await getData.get()
                    exeGetData.forEach((d) => {
                         recieptData.push(d.data())
                    })
                    setRecData(recieptData)
                })    
                 
                mergeData()
            }
        }
    })

    return(
        <div>
           <form onSubmit ={searchForm.handleSubmit}>
                <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>गादी का नाम </label>
                                <select 
                                    className="form-control"
                                    name="gname" 
                                    value={searchForm.values.gname}
                                    onChange={searchForm.handleChange}
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
                                        value={searchForm.values.vname}
                                        onChange={searchForm.handleChange}
                                    >
                                        <option value="" disabled defaultValue="select">Select one</option>
                                            { villageName.map((vname) => 
                                            <option value={vname.id}>{vname.name}</option>
                                            )}
                                    </select>
                                </div>
                           </div>
                    </div>
                    <button type="submit" className="btn btn-info">Search </button>
           </form>
           {/* <div>
        //    {usersData && <div className="row">
        //                  <div className="col-12">
        //                      <div className="card">
        //                      <div className="card-body">
        //                          <table id="example2" className="table table-bordered table-hover">
        //                          <thead>
        //                              <tr>
        //                              <th>Name</th>
        //                              <th>Father's Name</th>
        //                              <th>Address</th>
        //                              <th>Village Name</th>
        //                              <th>Gaadi Name</th>
        //                              <th>Mobile Number</th>
        //                              <th>Donation For</th>
        //                              <th>Payment type</th>
        //                              <th>Date</th>
        //                              <th>Amount</th>
        //                              <th>Reciept Number</th>
        //                              <th>Name to be Printed</th>
        //                              <th>Note</th>
        //                              </tr>
        //                          </thead>
        //                             {usersData.map((val,i) =>{
        //                                 // console.log(val)
        //                                 <Display uData = {val}  index = {i} />
        //                             })}
        //                          </table>
        //                      </div>
        //                      </div>
                             
        //                  </div>
        //                  </div>
        // </div>   */}
        </div>
    )
}

export default GVSearch