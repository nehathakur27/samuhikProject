import React,{useState,useEffect} from 'react'
import SideBar from '../components/Sidebar'
import GVSearch from '../components/GVSearch'
import NameSearch from '../components/NameSearch'
import RegNoSearch from '../components/RegNoSearch'


export default function SearchEntry(){
    
    const [type,setType] = useState('');
    const [gvRes,setGVRes] = useState([]);
    const [recData,setRecData] = useState([])

    const handleChange = (event) =>{
        setType(event.target.value)
    }


    return(
        <div>
           <SideBar />
           <div className="content-wrapper">
              <section class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1>Search and Edit User Information</h1>
                    </div>
                    </div>
                </div>
              </section>
              <section className="content">
                <div className="container-fluid">
                    <div className="card">
                        <div className = "card-body">
                           <div className="form-group">
                                    <label>Search according to : </label>
                                    <select 
                                        className="form-control"
                                        name="type" 
                                        onChange={handleChange}
                                        value={type}
                                    >
                                        <option value="" disabled defaultValue="select" selected>Select one</option>
                                        <option value="place">Gaadi and Village</option>
                                        <option value="name">Name</option>
                                        <option value="regno">Registration Number</option>
                                    </select>
                            </div>
                            
                            {type === "place" && <GVSearch st1={gvRes} setSt1={setGVRes} st2={recData} setSt2 = {setRecData} />}
                            {type === "name" && <NameSearch st1={gvRes} setSt1={setGVRes} st2={recData} setSt2 = {setRecData}/>}
                            {type === "regno" && <RegNoSearch st1={gvRes} setSt1={setGVRes} st2={recData} setSt2 = {setRecData}/>}
                            
                            { gvRes.length > 0 && <div className="row">
                            <div className="col-12">
                                <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Details</h3>
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
                                    { gvRes && recData && recData.map((val,i) => 
                                        <tr>
                                                <td>{val.name}</td>
                                                <td>{val.fname}</td>
                                                <td>{val.address}</td>
                                                <td>{val.vname}</td>
                                                <td>{val.gname}</td>
                                                <td>{val.mnno}</td>
                                                <td>{val.donation}</td>
                                                <td>{val.type}</td>
                                                <td>{recData[i].date}</td>
                                                <td>{recData[i].amount}</td>
                                                {recData[i].reciept_no  && <td>{recData[i].reciept_no}</td>}
                                                {recData[i].ntp  &&<td>{recData[i].ntp}</td>}
                                                <td>{recData[i].note}</td>
                                        </tr>
                                    )}
                                    
                                    </tbody>
                                    
                                    </table>
                                </div>
                                </div>
                                
                            </div>
                            </div>}
                    {/* row */}
                        </div>
                    </div>
                </div>
              </section>
            </div>
        </div>
    )
}