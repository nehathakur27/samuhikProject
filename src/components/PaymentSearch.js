import React,{useState,useEffect} from "react"
import { firestore } from "../firebase";
import { navigate } from "hookrouter";
import { useFormik,} from "formik";

const PaymentSearch = (props) => {
    const [usersData, setUserData] = useState([]);
    const [recData, setRecData] = useState([]);
    const [searched, setSearched] = useState(false)
    // console.log(props);

    useEffect( () => {
        if (localStorage.getItem("logged") !== "true") {
            navigate("/");
          }
    },[]);

    // useEffect(() => {
    //     console.log("ud ",usersData);
    //     console.log("rec ",recData);
    //     if(usersData.length > 0 && recData.length > 0)
    //        {
    //             console.log("callback userdata  ",usersData);
    //             console.log("callback recData",recData);    
    //             props.parentCallback(usersData,recData)
    //         }else if(searched &&( usersData.length === 0 || recData.length === 0)){
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
                // alert("No data found")
            }
    }


    const searchForm = useFormik({
        initialValues:{
          pc:""
        },
        onSubmit: async(values) => {
            const query = firestore.collection("all_receipts").where("type","==",values.pc)
            const exeQuery = await query.get();
            var userData = []
            var ids = []
            var recieptData = []
           
            exeQuery.forEach((d) => {
                recieptData.push(d.data())
                ids.push(d.data().uid);
            })
            console.log(recieptData);
            setRecData(recieptData)
            ids.forEach(async (id) => {
                const getData = firestore.collection("entries").where("uid" ,"==",id)
                const exeGetData = await getData.get()
                exeGetData.forEach((d) => {
                     userData.push(d.data())
                })
                setUserData(userData)
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
                            <label>Payment Type</label>
                                    <select 
                                        className="form-control"
                                        name="pc" 
                                        onChange={searchForm.handleChange}
                                        value={searchForm.values.pc}
                                    >
                                        <option value="" disabled selected>Select one</option>
                                        <option value="ghoshna">Ghoshna</option>
                                        <option value="due">Due</option>
                                        <option value="received">Received</option>
                                    </select>
                            </div>
                         </div>
                    </div>
                    <button type="submit" className="btn btn-info">Search </button>
           </form>
        </div>
    )
}

export default PaymentSearch