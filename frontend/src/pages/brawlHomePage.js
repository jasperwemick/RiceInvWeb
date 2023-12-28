import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "../style/brawlPage.css"
import { Link } from "react-router-dom";


export default function brawlHomePage() {
    return (
        <div>
            <Link to='/brawl/ones'>Ones</Link>
            <Link to='/brawl/twos'>TWos</Link>
        </div>
    )
}