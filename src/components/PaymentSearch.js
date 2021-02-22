import React,{useState,useEffect} from "react"
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import { useFormik,} from "formik";

const PaymentSearch = (props) => {
    const [searchRes, setSearchRes] = useState([]);
    // console.log(props);

    useEffect( () => {
        if (localStorage.getItem("logged") !== "true") {
            navigate("/");
          }
    });


    const searchForm = useFormik({
        initialValues:{
          pc:""
        },
        onSubmit: (values) => {
            console.log(values);
            firestore
                .collection("all_receipts")
                .where("type","==",values.pc)
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
                        //props.setSt2(receiptData)
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
                        //props.setSt1(userData)
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