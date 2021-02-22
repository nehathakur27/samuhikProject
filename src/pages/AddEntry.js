import React,{useState,useEffect} from 'react'
import { firestore } from "../firebase.config";
import { navigate } from "hookrouter";
import SideBar from '../components/Sidebar'
import { useFormik,} from "formik";
import { v4 as uuidv4 } from 'uuid';

function AddEntry(){
  const [gaadiName,setGaadiName] = useState([]);
  const [villageName,setVillageName] = useState([])
  const[isRegistered,setRegistered] = useState(false)
  const [getUser,setGetUser] = useState([]);
  const [selected,isSelected] = useState(false)

    useEffect(async () => {
        if (localStorage.getItem("logged") !== "true") {
          navigate("/");
        }
        loadGaadis()
    });

    function handleRegister(e) {
        if (e.target.value === "yes") {
          setRegistered(true);
        } else {
          setRegistered(false);
        }
        console.log(isRegistered)
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
        if(registerForm.values.gname){
          const coll_name = "gaadi_name/"+registerForm.values.gname+"/village_name"
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

    
    function selectUser(e) {
        //console.log(e.target.value)
         localStorage.setItem("userid",e.target.value)
         isSelected(true)
       }
   
       const validate = (values) =>{
           
         console.log("in validate");
           const errors = {}
           if (!values.regno) {
             errors.regno = "Registration Number Required";
           }
           if (!values.name) {
               errors.name = "Name Required";
           }
           if (!values.vname) {
               errors.vname = "Village Name Required";
           }
          if (!values.mno.match(/^\d{10}$/)) {
             errors.mno = "Invalid Phone Number. 10 Digits Required";
           }
           if (!values.gname) {
               errors.gname = "Gaadi Name Required";
           }
          
           return errors
        }

        const checkUserForm = useFormik({
            initialValues:{
              name:""
            },
            onSubmit: (values) => {
              console.log(values);
               firestore
               .collection("entries")
               .where("name","==",values.name)
               .get()
               .then(function (deets){
                  //console.log(deets.docs)
                  if(deets.empty)
                    alert("No such user")
                  else{
                    deets.docs.map((v) => {
                      setGetUser(getUser => [...getUser,v.data()])
                    })
                  }
               })
            }
          })
     
          const registerForm = useFormik({
             initialValues: {
               uid:uuidv4(),
               regno: "",
               name:"",
               fname:"",
               address:"",
               vname:"",
               gname:"",
               mno:"",
             },
             validate,
             onSubmit: (values) => {
               console.log("here",values)
                const data = {
                   address : values.address,
                   fname: values.fname,
                   due:false,
                   ghoshna:false,
                   received:false,
                   gname:values.gname,
                   mnno:values.mno,
                   name:values.name,
                   reg_no:values.regno,
                   uid:values.uid,
                   vname:values.vname
                }
                firestore
                .collection("entries")
                .where("reg_no","==",values.regno)
                .get()
                .then(function (deets){
                    if(deets.size > 0){
                      alert("Registration Number Exists")
                    }else{
                      firestore
                      .collection("entries")
                      .doc(values.uid)
                      .set(data,{merge : true})
                      .then(function () {
                        localStorage.setItem("userid",values.uid)
                        navigate("/payment")
                      })
                    }
                })
                   
             }
           })
     

    return(
        <div>
            <SideBar />
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        <h1 className="m-0 text-dark">New Entry Form</h1>
                        </div>
                    </div>
                    </div>
                </div>
            <section className="content">
            <div className="container-fluid">
                <div className="row" style={{display:"flex",justifyContent:"center", alignItems:"center"}}>
                <div >
                    {/* general form elements disabled */}
                    <div className="card card-warning">
                    {/* /.card-header */}
                    <div className="card-body">
                        <div className="row">
                            <div className="form-group">
                                <label>Already registered user?</label>
                                    <div className="form-check">
                                    <input 
                                        className="form-check-input"
                                        type="radio" 
                                        name="isreg"
                                        value="yes"
                                        id="yes"
                                        onClick={handleRegister}
                                    />
                                    <label className="form-check-label">हां </label>
                                    </div>
                                    <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="radio1" 
                                        name="isreg"
                                        value="no"
                                        id="no"
                                        onClick={handleRegister}
                                        defaultChecked 
                                    />
                                    <label className="form-check-label">ना </label>
                                    </div>
                            </div>
                        </div>
            {!isRegistered && (<form role="form" onSubmit={registerForm.handleSubmit}>
                        <div className="row">
                            <div className="col-sm-6">
                            
                            {/* text input */}
                            <div className="form-group">
                                <label>रजिस्ट्रेशन नंबर </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="रजिस्ट्रेशन नंबर"
                                    name="regno"
                                    onChange={registerForm.handleChange}
                                    value={registerForm.values.regno}
                                />
                            </div>
                            {registerForm.errors.regno ? 
                                (<p style={{color:"red"}}>{ registerForm.errors.regno}</p>) : null
                            }
                            </div>
                            <div className="col-sm-6">
                            <div className="form-group">
                                <label>नाम </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="नाम"
                                    name="name"
                                    onChange={registerForm.handleChange}
                                    value={registerForm.values.name}
                                />
                            </div>
                            {registerForm.errors.name ? 
                                (<p style={{color:"red"}}>{ registerForm.errors.name}</p>) : null
                            }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                            
                            {/* text input */}
                            <div className="form-group">
                                <label>पिता का नाम </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="पिता का नाम"
                                    name="fname"
                                    onChange={registerForm.handleChange}
                                    value={registerForm.values.fname}
                                />
                            </div>
                            {registerForm.errors.fname ? 
                                (<p style={{color:"red"}}>{ registerForm.errors.fname}</p>) : null
                            }
                            </div>
                            <div className="col-sm-6">
                            <div className="form-group">
                                <label>पता </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Address"
                                    name="address"
                                    onChange={registerForm.handleChange}
                                    value={registerForm.values.address}
                                />
                            </div>
                            {registerForm.errors.address ? 
                                (<p style={{color:"red"}}>{ registerForm.errors.address}</p>) : null
                            }
                            </div>
                        </div>
                        
                        
                        <div className="row">
                            <div className="col-sm-6">
                            {/* select */}
                            <div className="form-group">
                             <label>गादी का नाम </label>
                             <select 
                                className="form-control"
                                name="gname" 
                                value={registerForm.values.gname}
                                onChange={registerForm.handleChange}
                            >
                                <option value="" disabled selected>Select one</option>
                                { gaadiName.map((gaadi) => 
                                    <option value={gaadi.id}>{gaadi.name}</option>
                                )}
                             </select>
                            </div>
                            {registerForm.errors.gname ? 
                                (<p style={{color:"red"}}>{ registerForm.errors.gname}</p>) : null
                            }
                            </div>
                            <div className="col-sm-6">
                            <div className="form-group" onClick ={() => loadVillages()}>
                                <label>गांव का नाम </label>
                                <select 
                                    className="form-control"
                                    name="vname" 
                                    value={registerForm.values.vname}
                                    onChange={registerForm.handleChange}
                                >
                                <option value="" disabled selected>Select one</option>
                                { villageName.map((vname) => 
                                    <option value={vname.id}>{vname.name}</option>
                                )}
                                </select>
                            </div>
                            {registerForm.errors.vname ? 
                                (<p style={{color:"red"}}>{ registerForm.errors.vname}</p>) : null
                            }
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-6">
                            <div className="form-group">
                                <label>मोबाइल नंबर  </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="मोबाइल नंबर "
                                    name="mno" 
                                    onChange={registerForm.handleChange}
                                    value={registerForm.values.mno}
                                />
                            </div>
                            {registerForm.errors.mno ? 
                                (<p style={{color:"red"}}>{ registerForm.errors.mno}</p>) : null
                            }
                            </div>
                        </div>
                        <div className="card-footer">
                        <button type="submit" className="btn btn-info">रजिस्टर </button>
                        </div>
                        </form>
                        )}

                        {isRegistered && (
                        <form  onSubmit = {checkUserForm.handleSubmit}>
                            <div className="form-group">
                                <label>नाम </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="नाम"
                                    name="name" 
                                    onChange={checkUserForm.handleChange}
                                    value={checkUserForm.values.name}
                                />     
                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn btn-info">चेक करे  </button>
                            </div>
                        </form>)}
                        <div >
                 {
                  getUser.map((v,i) => 
                    <div>
                      <input 
                         className="form-check-input" 
                         type="radio" 
                         name="selectUser"
                         value={v.uid}
                         id={i++}
                         onClick={selectUser}
                      />
                      <p>{v.name}</p>
                      <p>{v.fname}</p>
                      <p>{v.address}</p>
                      <p>{v.gname}</p>
                      <p>{v.vname}</p>
                      <p>{v.mnno}</p>
                    </div>
                  )}
                  {selected && <button className="btn btn-info" onClick={() => navigate("/payment")}>Proceed</button>}
                </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>
          </div>
        </div>
    )
}

export default AddEntry