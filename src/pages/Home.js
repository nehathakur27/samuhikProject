import React from "react";
import SideBar from "../components/Sidebar";
import { navigate } from "hookrouter";

export default function Home() {
  React.useEffect(() => {
    if (localStorage.getItem("logged") !== "true") {
      navigate("/");
    }
  });

  return (
    <div>
      <SideBar />
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Dashboard</h1>
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            {/* Info boxes */}
            <div className="row">
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box"
                  onClick={() => navigate("/layout/" + "prerna")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      समाज के प्रेरणास्त्रोत
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              {/* /.col */}
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box mb-3"
                  onClick={() => navigate("/layout/" + "gourav")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      समाज के गौरव
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              {/* /.col */}
              {/* fix for small devices only */}
              <div className="clearfix hidden-md-up" />
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box mb-3"
                  onClick={() => navigate("/layout/" + "maargdarshan")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      समाज के मार्गदर्शक{" "}
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              {/* /.col */}

              {/* /.col */}
            </div>

            {/* /.row */}
            <div className="row">
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box"
                  onClick={() => navigate("/layout/" + "sadsya")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      समाज की केंद्रीय समिति के सदस्य{" "}
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              {/* /.col */}
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box mb-3"
                  onClick={() => navigate("/layout/" + "skp")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      समाज की केंद्रीय समिति के पदाधिकारी{" "}
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box mb-3"
                  onClick={() => navigate("/layout/" + "tkp")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      समाज के ट्रस्ट के पदाधिकारी{" "}
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box"
                  onClick={() => navigate("/layout/" + "photo")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      फोटो
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              {/* /.col */}
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box mb-3"
                  onClick={() => navigate("/layout/" + "video")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      {" "}
                      वीडियो
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box mb-3"
                  onClick={() => navigate("/layout/" + "samachaar")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      समाज के मुख्य समाचार
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box mb-3"
                  onClick={() => navigate("/layout/" + "suchna")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      आवश्यक सुचना{" "}
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              {/* /.col */}
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box mb-3"
                  onClick={() => navigate("/layout/" + "nirman")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      शौर्य स्थल निर्माण समिति
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <div
                  className="info-box mb-3"
                  onClick={() => navigate("/layout/master")}
                >
                  <div className="info-box-content">
                    <span
                      className="info-box-text"
                      style={{ textAlign: "center" }}
                    >
                      मास्टर
                    </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
            </div>
          </div>
          {/*/. container-fluid */}
        </section>
        {/* /.content */}
      </div>
    </div>
  );
}
