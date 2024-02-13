import { Link } from "react-router-dom";
import { TabGroup, Tab,TabList,Flex } from "@tremor/react";
const NavBar=()=>{
    return(
        <nav>
            <TabGroup>
                <div className="flex" >
                    <Tab ><Link to={'/'}>홈</Link></Tab>
                    <Tab><Link to={'/weather'}>날씨</Link></Tab>
                    <Tab><Link to={'/calculator'}>계산기</Link></Tab>
                </div>
            </TabGroup>
        </nav>
    )
}

export default NavBar;