import React,{useState,useEffect} from "react"
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import { useFormik,} from "formik";

const NameSearch = (props) => {
    const [searched, setSearched] = useState(false);
    const [usersData, setUserData] = useState([]);
    const [recData, setRecData] = useState([]);

    // console.log(props);

    useEffect( () => {
        if (localStorage.getItem("logged") !== "true") {
            navigate("/");
          }
    },[]);

    // useEffect(() => {
    //     console.log("ud ",usersData);
    //     console.log("rec ",recData);
    //     // console.log("ud len",usersData.length);
    //     //  console.log("rec len",recData.length);
    //     if(usersData.length > 0 && recData.length > 0)
    //        {
    //             console.log("callback userdata  ",usersData);
    //             console.log("callback recData",recData);    
    //             props.parentCallback(usersData,recData)
    //         }else if(searched && ( usersData.length === 0 || recData.length === 0)){
    //             alert("No data found")
    //         }
    // }, [usersData,recData])

    const mergeData = () =>{
        console.log("ud ",usersData);
        console.log("rec ",recData);
        // console.log("ud len",usersData.length);
        //  console.log("rec len",recData.length);
        if(usersData.length > 0 && recData.length > 0)
           {
                console.log("callback userdata  ",usersData);
                console.log("callback recData",recData);    
                props.parentCallback(usersData,recData)
            }else if(searched &&( usersData.length === 0 || recData.length === 0)){
                props.parentCallback(usersData,recData)
                alert("No data found")
            }
    }

    const searchForm = useFormik({
        initialValues:{
          name:""
        },
        onSubmit: async(values) => {
            console.log(values);
           
                const query = firestore.collection("entries").where("name","==",values.name)
                const exeQuery = await query.get()
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
                setSearched(true)
                mergeData()
        }
    })

    return(
        <div>
           <form onSubmit ={searchForm.handleSubmit}>
                <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>नाम </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="नाम"
                                    name="name" 
                                    onChange={searchForm.handleChange}
                                    value={searchForm.values.name}
                                /> 
                            </div>
                         </div>
                    </div>
                    <button type="submit" className="btn btn-info">Search </button>
           </form>
        </div>
    )
}

export default NameSearch