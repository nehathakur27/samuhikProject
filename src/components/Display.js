import React, { useEffect,useState } from 'react'

export default function Display(props) {
    const [finalData, setFinalData] = useState([])
    useEffect(() => {
      var recData = [];
      console.log("props",props.uData);

    },[])
    return (
        // <div>
             <tbody>
                                 {/* {finalData && finalData.map((val,i) => {
                                     let ind = 0
                                     val[ind].map((sub,j) => {
                                     <tr>
                                        <td>{val.name}</td>
                                        <td>{val.fname}</td>
                                        <td>{val.address}</td>
                                        <td>{val.vname}</td>
                                        <td>{val.gname}</td>
                                        <td>{val.mnno}</td>
                                        <td>{sub.donation}</td>
                                        <td>{sub.type}</td>
                                        <td>{sub.date}</td>
                                        <td>{sub.amount}</td>
                                        {sub.reciept_no  && <td>{sub.reciept_no}</td>}
                                        {sub.ntp  &&<td>{sub.ntp}</td>}
                                        <td>{sub.note}</td>
                                    </tr>
                                    ind++;
                                    })
                                })} */}
                                 
             </tbody>
                        
        // </div>
    )
}
