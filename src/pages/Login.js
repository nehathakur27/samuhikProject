import React from 'react'
import { useFormik,} from "formik";
import { firestore } from "../firebase";
import { navigate } from "hookrouter";

function Login(){
    const validate = (values) =>{
        const errors = {}
        if (!values.username) {
          errors.username = "Username Required"
        }
        if (!values.password) {
          errors.password = "Password Required";
        }
        return errors
     }
    
      const LoginFormik = useFormik({
      initialValues: {
        username: "",
        password:"",
      },
      validate,
      onSubmit: (values) => {
         firestore
            .collection("user")
            .doc("user")
            .get()
            .then(function (deets){
               if(deets.exists){
                 if(deets.data().password === values.password && deets.data().username === values.username){
                     localStorage.setItem("logged","true" );
                     navigate("/home")
                 }else{
                   alert("Invalid Credentials")
                 }
               }
            })
      }
    })
    return(
        <div>
            <section className="content">
            <div className="container-fluid">
                <div className="row" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                <div className="col-md-4">
                    <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Login Form</h3>
                    </div>
                    <form role="form" onSubmit = {LoginFormik.handleSubmit}>
                        <div className="card-body">
                        <div className="form-group ">
                            <label htmlFor="username" >Username</label>
                            <div className="col-sm-10">
                            <input 
                                type="text" 
                                className="form-control"
                                id="username" 
                                placeholder="Username" 
                                onChange={LoginFormik.handleChange}
                                value={LoginFormik.values.username} 
                            />
                            </div>
                        </div>
                        {LoginFormik.errors.username ? 
                            (<p style={{color:"red"}}>{ LoginFormik.errors.username}</p>) : null
                        }
                        <div className="form-group ">
                            <label htmlFor="password">Password</label>
                            <div className="col-sm-10">
                            <input 
                                type="password"
                                className="form-control" 
                                id="password"
                                placeholder="Password" 
                                onChange={LoginFormik.handleChange}
                                value={LoginFormik.values.password} 
                            />
                            </div>
                            {LoginFormik.errors.password ? 
                                (<p style={{color:"red"}}>{ LoginFormik.errors.password}</p>) : null
                            }
                        </div>
                        </div>
                        <div className="card-footer">
                        <button type="submit" className="btn btn-info">Sign in</button>
                        </div>
                    </form>
                    </div>
                </div>
                
                </div>
                
            </div>
            </section>

        </div>
    )
}

export default Login