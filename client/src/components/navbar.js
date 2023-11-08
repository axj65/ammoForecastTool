import React from "react";
//import brandLogo from '../images/zara-logo.png';
 
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
//import "bootstrap/dist/css/bootstrap.min.css";
 
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
 
// Here, we display our Navbar
export default function Navbar() {
 return (
   <div>
    
    <nav id="navbar" class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand ms-3" href="index">Ammunition Forecast Tool</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item active">
                            <a class="nav-link login-link" href="login">Login</a>
                        </li>
                    </ul>
                </div>
        </div>
    </nav>

    <div id="sidebar" class="bg-custom-medium">
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link active" href="#"> Create Event </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#"> My Events </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#"> FAQs </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#"> Contact Us</a>
            </li>
        </ul>
    </div>


   </div>
 );
}