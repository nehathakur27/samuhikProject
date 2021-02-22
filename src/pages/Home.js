import React from 'react'
import SideBar from '../components/Sidebar'
import { navigate } from "hookrouter";

export default function Home(){

    React.useEffect(() => {
        if (localStorage.getItem("logged") !== "true") {
          navigate("/");
        }
      });
    

    return(
        <div>
            <SideBar />
            <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                    <h1 className="m-0 text-dark">Dashboard</h1>
                    </div>{/* /.col */}
                </div>{/* /.row */}
                </div>{/* /.container-fluid */}
            </div>
            {/* /.content-header */}
            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                {/* Info boxes */}
                <div className="row">
                    <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box">
                        <span className="info-box-icon bg-info elevation-1"><i className="fas fa-cog" /></span>
                        <div className="info-box-content">
                        <span className="info-box-text">CPU Traffic</span>
                        <span className="info-box-number">
                            10
                            <small>%</small>
                        </span>
                        </div>
                        {/* /.info-box-content */}
                    </div>
                    {/* /.info-box */}
                    </div>
                    {/* /.col */}
                    <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box mb-3">
                        <span className="info-box-icon bg-danger elevation-1"><i className="fas fa-thumbs-up" /></span>
                        <div className="info-box-content">
                        <span className="info-box-text">Likes</span>
                        <span className="info-box-number">41,410</span>
                        </div>
                        {/* /.info-box-content */}
                    </div>
                    {/* /.info-box */}
                    </div>
                    {/* /.col */}
                    {/* fix for small devices only */}
                    <div className="clearfix hidden-md-up" />
                    <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box mb-3">
                        <span className="info-box-icon bg-success elevation-1"><i className="fas fa-shopping-cart" /></span>
                        <div className="info-box-content">
                        <span className="info-box-text">Sales</span>
                        <span className="info-box-number">760</span>
                        </div>
                        {/* /.info-box-content */}
                    </div>
                    {/* /.info-box */}
                    </div>
                    {/* /.col */}
                    <div className="col-12 col-sm-6 col-md-3">
                    <div className="info-box mb-3">
                        <span className="info-box-icon bg-warning elevation-1"><i className="fas fa-users" /></span>
                        <div className="info-box-content">
                        <span className="info-box-text">New Members</span>
                        <span className="info-box-number">2,000</span>
                        </div>
                        {/* /.info-box-content */}
                    </div>
                    {/* /.info-box */}
                    </div>
                    {/* /.col */}
                </div>
                
                {/* /.row */}
                </div>{/*/. container-fluid */}
            </section>
            {/* /.content */}
            </div>

        </div>
    )
}