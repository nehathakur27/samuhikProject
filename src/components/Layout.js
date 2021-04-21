import React, { useState } from "react";
import Gourav from "../pages/Gourav";
import MaargDarshan from "../pages/MaargDarshan";
import Master from "../pages/Master";
import Nirman from "../pages/Nirman";
import Photo from "../pages/Photo";
import Prerna from "../pages/Prerna";
import Sadsya from "../pages/Sadsya";
import Samachaar from "../pages/Samachaar";
import Skp from "../pages/Skp";
import Suchna from "../pages/Suchna";
import Tkp from "../pages/Tkp";
import Video from "../pages/Video";
import SearchPeople from "./SearchPeople";
import ShowMedia from "./ShowMedia";
import SideBar from "./Sidebar";

const Layout = ({ type }) => {
  const components = {
    prerna: Prerna,
    gourav: Gourav,
    maargdarshan: MaargDarshan,
    sadsya: Sadsya,
    skp: Skp,
    tkp: Tkp,
    photo: Photo,
    video: Video,
    samachaar: Samachaar,
    suchna: Suchna,
    nirman: Nirman,
    master: Master,
  };
  const heading = {
    prerna: "प्रेरणास्त्रोत",
    gourav: "समाज के गौरव",
    maargdarshan: "समाज के मार्गदर्शक",
    sadsya: "समाज की केंद्रीय समिति के सदस्य",
    skp: "समाज की केंद्रीय समिति के पदाधिकारी  ",
    tkp: "समाज के ट्रस्ट के पदाधिकारी",
    photo: "फोटो",
    video: "वीडियो",
    samachaar: "समाचार ",
    suchna: "सुचना",
    nirman: "निर्माण",
    master:"मास्टर",
  };
  const CurrentComponent = components[type.type];
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark"> {heading[type.type]}</h1>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <SideBar />
          <div className="row">
            <div className="col-12 ">
              <div className="card card-primary card-tabs">
                <div className="card-header p-0 pt-1">
                  <ul
                    className="nav nav-tabs"
                    id="custom-tabs-one-tab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        id="custom-tabs-one-home-tab"
                        data-toggle="pill"
                        href="#custom-tabs-one-home"
                        role="tab"
                        aria-controls="custom-tabs-one-home"
                        aria-selected="true"
                      >
                        Add
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="custom-tabs-one-profile-tab"
                        data-toggle="pill"
                        href="#custom-tabs-one-profile"
                        role="tab"
                        aria-controls="custom-tabs-one-profile"
                        aria-selected="false"
                      >
                        View
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="card-body">
                  <div className="tab-content" id="custom-tabs-one-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="custom-tabs-one-home"
                      role="tabpanel"
                      aria-labelledby="custom-tabs-one-home-tab"
                    >
                      <CurrentComponent />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="custom-tabs-one-profile"
                      role="tabpanel"
                      aria-labelledby="custom-tabs-one-profile-tab"
                    >
                      {type.type === "photo" || type.type === "video" ? (
                        <ShowMedia type={type.type} />
                      ) : (
                        <SearchPeople type={type.type} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Layout;
