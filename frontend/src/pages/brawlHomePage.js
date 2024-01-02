import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "../style/brawlPage.css"
import { Link } from "react-router-dom";


export default function brawlHomePage() {
    return (
        <div>
            <div><span>Brawlhalla</span></div>
            <div className="ones-block">
                <div className="brawl-button"><Link to='/brawl/ones'>Singles</Link></div>
            </div>
            <div className="twos-block">
                <div className="brawl-button"><Link to='/brawl/twos'>Doubles</Link></div>
            </div>
        </div>
    )
}