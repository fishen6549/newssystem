import React, { useEffect, useState } from 'react'
import {
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import "./index.css"

import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { connect, useSelector, useDispatch } from 'react-redux';
const { Sider } = Layout;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}


function SideMenu(props) {
    // console.log("SideMenu", props);
    const [menuList, setMenuList] = useState([])
    const location = useLocation();
    const navigate = useNavigate();

    const isCollapsed = useSelector(state => {
        // console.log("SideMenu", state);
        return state.CollapsedReducer.isCollapsed;
    })

    useEffect(() => {
        // const location = useLocation();
        if (location.pathname === '/') {
            navigate("/home");
        }
    }, [])


    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            // console.log(res.data);
            setMenuList(res.data)
        })
    }, [])

    const { role: { rights } } = JSON.parse(localStorage.getItem("token"));


    const changePagePermission = (item) => {
        // 用户包含的key权限侧边栏才显示
        return item.pagepermisson === 1 && rights.includes(item.key);
    }

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children && item.children.length > 0 && changePagePermission(item)) {
                // return renderMenu(item)
                return getItem(item.title, item.key, item.icon, renderMenu(item.children));
            }
            return changePagePermission(item) && getItem(item.title, item.key, item.icon);
        })
    }


    // if (location.pathname === '/') {
    //     navigate("/home");
    // }
    const selectKey = [location.pathname];
    const openKey = ["/" + location.pathname.split("/")[1]] // 路径前面的一部分 ['', 'user-manage', 'list']
    // console.log(selectKey, openKey);
    const onClick = (e) => {
        // console.log('click ', e);
        navigate(e.key);
    };




    return (
        // <Sider trigger={null} collapsible collapsed={false} style={{ overflow: "auto" }}>
        // <Sider trigger={null} collapsible collapsed={props.isCollapsed} style={{ overflow: "auto" }}>
        <Sider trigger={null} collapsible collapsed={isCollapsed} style={{ overflow: "auto" }}>
            {/* <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}> */}


            <div className="logo" >全球新闻发布管理系统</div>
            <Menu
                onClick={onClick}
                theme="dark"
                mode="inline"
                // defaultSelectedKeys={selectKey}
                selectedKeys={selectKey}
                items={renderMenu(menuList)}
                defaultOpenKeys={openKey}
            />
            {/* </div> */}
        </Sider >
    )
}

// const mapStateToProps = (state) => {
//     console.log("state", state);
//     return {
//         isCollapsed: state.CollapsedReducer.isCollapsed
//     }
// }

// export default connect(mapStateToProps)(SideMenu) // 可以使用useDispatch修改值 和 useSelector 获取值
export default SideMenu