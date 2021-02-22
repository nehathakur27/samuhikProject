import React,{useState,useEffect} from "react"
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import { useFormik,} from "formik";

const ProductSearch = (props) => {
    const [searchRes, setSearchRes] = useState([]);
    const [dtypes,setdTypes] = useState([])
    // console.log(props);

    useEffect( () => {
        if (localStorage.getItem("logged") !== "true") {
            navigate("/");
          }
          loadDonation()
    });

    const loadDonation = async() =>{
        const document = firestore.collection("donation_type")
        const activeRef =  await document.get()
        var dt = [];
        activeRef.forEach((docs) => {
          dt.push(docs.data())
        })
        
        setdTypes(dt)
    }


    const searchForm = useFormik({
        initialValues:{
          pro:""
        },
        onSubmit: (values) => {
            console.log(values);
            firestore
                .collection("all_receipts")
                .where("donation","==",values.pro)
                .get()
                .then(function (deets) {
                    if(deets.empty){
                        alert("no user found")
                        //props.setSt1([])
                    }else{
                        let receiptData = []
                        let ids = new Set()
                        deets.docs.map((v) => {
                            receiptData.push(v.data());
                            ids.add(v.data().uid);
                        })
                        // console.log(ids);
                        //props.setSt1(receiptData)
                        console.log("rec data..",receiptData);
                        
                        let userData = []
                        ids.forEach((id) =>{
                            firestore
                                .collection("entries")
                                .where("uid","==",id)
                                .get()
                                .then(function (d) {
                                    d.docs.map((val) => {
                                        userData.push(val.data())
                                    })
                                })
                        })
                        //props.setSt2(userData)
                        console.log("User data",userData);
                        props.parentCallback(userData,receiptData)
                    }
                })

            
        }
    })

    return(
        <div>
           <form onSubmit ={searchForm.handleSubmit}>
                <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                            <label >दान के प्रकार</label>
                                        <select 
                                            name="pro"
                                            value={searchForm.values.donation}
                                            className="form-control"
                                            onChange={searchForm.handleChange}
                                        >
                                            <option value="" disabled selected>Select one</option>
                                            {dtypes.map((dt) => 
                                            <option value={dt.id}>{dt.name}</option>
                                        )}
                                        </select>
                            </div>
                         </div>
                    </div>
                    <button type="submit" className="btn btn-info">Search </button>
           </form>
        </div>
    )
}

export default ProductSearch