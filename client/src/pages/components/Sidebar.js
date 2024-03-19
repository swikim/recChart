import React from "react";
import { Link } from "react-router-dom";
import './sidebar.css'
export default function Sidebar(){
    return(
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>
                    <ul className="sidebarList">
                        <li className="sidebarListItem"><Link to={'/'}>HOME</Link></li>
                        <li className="sidebarListItem"><Link to={'/weather'}>날씨</Link></li>
                        <li className="sidebarListItem"><Link to={'/calculator'}>계산기</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}