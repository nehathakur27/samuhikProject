import React,{useState,useEffect} from "react"
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import { useFormik,} from "formik";

const RegNoSearch = (props) => {
    const [searchRes, setSearchRes] = useState([]);
    // console.log(props);

    useEffect( () => {
        if (localStorage.getItem("logged") !== "true") {
            navigate("/");
          }
    });


    const searchForm = useFormik({
        initialValues:{
          regno:""
        },
        onSubmit: (values) => {
            console.log(values);
                firestore
                    .collection("entries")
                    .where("reg_no","==",values.regno)
                    .get()
                    .then(function (deets){
                        // console.log(deets.docs);
                        if(deets.empty)
                            {alert("No data found");props.setSt1([])}
                        else{
                            let userData = []
                            let ids = []
                            console.log(deets);
                            deets.docs.map((v) => {
                                userData.push(v.data())
                                ids.push(v.id);
                            })
                            props.setSt1(userData)
                            console.log("userData of both ...",userData);
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
                            props.setSt2(recieptData)
                            console.log("rec data",recieptData);
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
                            <label>रजिस्ट्रेशन नंबर </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="रजिस्ट्रेशन नंबर"
                                    name="regno"
                                    onChange={searchForm.handleChange}
                                    value={searchForm.values.regno}
                                />
                            </div>
                         </div>
                    </div>
                    <button type="submit" className="btn btn-info">Search </button>
           </form>
        </div>
    )
}

export default RegNoSearch