import React,{useState,useEffect} from "react"
import { firestore } from "../firebase.config";
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
    });

    const callback = () =>{
        console.log("calling back");
        props.parentCallback(usersData,recData)
    }
    useEffect(() => {
        console.log("ud ",usersData);
        console.log("rec ",recData);
        // console.log("ud len",usersData.length);
        //  console.log("rec len",recData.length);
        if(usersData.length > 0 && recData.length > 0)
           {
                console.log("callback userdata  ",usersData);
                console.log("callback recData",recData);    
                props.parentCallback(usersData,recData)
            }
    }, [usersData,recData])

    

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

    // const merge = (a1,a2) =>{
    //     console.log("merging data...");
    //     console.log(a1);
    //     console.log(a2);
    //     let mergedList = a2.map((item, i) => Object.assign({}, item, a1[i]));
    //     props.setSt2(mergedList)
    //     console.log("merged list: ",mergedList);
    // }

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
                    //console.log(id);
                    const getData = firestore.collection("all_receipts").where("uid" ,"==",id)
                    // console.log("query data",getData);
                    const exeGetData = await getData.get()
                    // console.log("current queryData:",getData);
                     //console.log("executed query..",exeGetData);
                    exeGetData.forEach((d) => {
                        // console.log("d.data() = ",d.data());
                        // console.log("push data...");
                        // let obj = d.data()
                        // console.log(obj);
                         recieptData.push(d.data())
                    })
                    
                    // console.log("recData: ",JSON.stringify(recieptData));
                    setRecData(recieptData)
                })                

            }else if(values.gname.length > 0  && values.vname.length === 0){
                firestore
                    .collection("entries")
                    .where("gname","==",values.gname)
                    .get()
                    .then(function (deets){
                        // console.log(deets.docs);
                        if(deets.empty)
                            {alert("No data found");//props.setSt1([])
                            }
                        else{
                            let userData = []
                            let ids = []
                            deets.docs.map((v) => {
                                userData.push(v.data())
                                ids.push(v.id)
                            })
                            console.log("userData for gname ...",userData);
                            let recieptData = []
                            ids.forEach((id) => {
                                firestore
                                    .collection("all_receipts")
                                    .where("uid" ,"==",id)
                                    .get()
                                    .then(function (d) {
                                        d.docs.map((val) => {
                                            recieptData.push(val.data())
                                        })
                                    })
                            })
                            console.log("rec data",recieptData);
                            setRecData(recieptData)
                            setUserData(userData)
                            //props.parentCallback(userData,recieptData)
                        }
                    })
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