import { navigate } from 'hookrouter'
import React from 'react'

export default function SideBar(){
    const logout = () =>{
        localStorage.removeItem("logged");
        navigate("/")
      }
      
    return(
        <div>
<aside className="main-sidebar sidebar-dark-primary elevation-4">
  <div className="sidebar">
    {/* Sidebar user panel (optional) */}
    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
      <div className="info">
        <p className="d-block" style={{color:"white"}}>Admin</p>
      </div>
    </div>
    {/* Sidebar Menu */}
    <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
        <li className="nav-item" onClick={() => navigate("/home")}>
            <p className="nav-link" style={{color:"white"}}>
              Dashboard
            </p>
        </li>

        <li className="nav-item" onClick={() => navigate("/addEntry")}>
            <p className="nav-link" style={{color:"white"}}>
              Add
            </p>
        </li>

        <li className="nav-item"  onClick={() =>  navigate("/search")}>
            <p className="nav-link" style={{color:"white"}}>
              Search and Edit
            </p>
        </li>

        <li className="nav-item" onClick={() => navigate("/reports")}>
            <p className="nav-link" style={{color:"white"}}>
              Reports
            </p>
        </li>

        <li className="nav-item" onClick={() => logout()}>
            <p className="nav-link" style={{color:"white"}}>
              Logout
            </p>
        </li>

      </ul>
    </nav>
    {/* /.sidebar-menu */}
  </div>
  {/* /.sidebar */}
</aside>

        </div>
    )
}