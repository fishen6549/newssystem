import React, { useEffect, useState, Suspense } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import axios from 'axios'
import Login from "../views/login/Login"
import NewsSandBox from "../views/sandbox/NewsSandBox"


import Home from "../views/sandbox/home/Home";

import RightList from "../views/sandbox/right-manage/RightList";
import RoleList from "../views/sandbox/right-manage/RoleList";

import UserList from "../views/sandbox/user-manage/UserList";


import NewsAdd from '../views/sandbox/news-manage/NewsAdd';
import NewsDraft from '../views/sandbox/news-manage/NewsDraft';
import NewsCategory from '../views/sandbox/news-manage/NewsCategory';
import NewsPreview from '../views/sandbox/news-manage/NewsPreview';
import NewsUpdate from '../views/sandbox/news-manage/NewsUpdate';

import Audit from "../views/sandbox/audit-manage/Audit";
import AuditList from "../views/sandbox/audit-manage/AuditList";

import Unpublished from '../views/sandbox/publish-manage/Unpublished';
import Published from '../views/sandbox/publish-manage/Published';
import Sunset from '../views/sandbox/publish-manage/Sunset';


// 游客
import News from '../views/news/News'
import Detail from '../views/news/Detail'
import Nopermission from '../views/sandbox/nopermission/Nopermission';
import nprogress from "nprogress";
import "nprogress/nprogress.css";




const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />
}
// const LocalRouterMap = {
//     "/home": React.lazy(() => import('../views/sandbox/home/Home')),
//     "/user-manage/list": React.lazy(() => import('../views/sandbox/user-manage/UserList')),
//     "/right-manage/role/list": React.lazy(() => import('../views/sandbox/right-manage/RoleList')),
//     "/right-manage/right/list": React.lazy(() => import('../views/sandbox/right-manage/RightList')),
//     "/news-manage/add": React.lazy(() => import('../views/sandbox/news-manage/NewsAdd')),
//     "/news-manage/draft": React.lazy(() => import('../views/sandbox/news-manage/NewsDraft')),
//     "/news-manage/category": React.lazy(() => import('../views/sandbox/news-manage/NewsCategory')),
//     "/audit-manage/audit": React.lazy(() => import("../views/sandbox/audit-manage/Audit")),
//     "/audit-manage/list": React.lazy(() => import("../views/sandbox/audit-manage/AuditList")),
//     "/publish-manage/unpublished": React.lazy(() => import("../views/sandbox/publish-manage/Unpublished")),
//     "/publish-manage/published": React.lazy(() => import("../views/sandbox/publish-manage/Unpublished")),
//     "/publish-manage/sunset": React.lazy(() => import("../views/sandbox/publish-manage/Sunset")),
// }

const Loading = () => {
    useEffect(() => {
        console.log("进度条开始");
        nprogress.start();
        return () => {
            console.log("进度条结束");
            nprogress.done();
        }
    })
    return (
        <React.Fragment />
    )
}

export default function IndexRouter() {

    const [routeList, setRouteList] = useState([]);
    const [rights, setUserRights] = useState([]);

    // useEffect(() => {
    //     console.log("IndexRouter1 useEffect");
    //     // if (localStorage.getItem("token")) {
    //     //     const { role: { rights } } = JSON.parse(localStorage.getItem("token"));
    //     // }
    // }, [])
    useEffect(() => {
        // console.log("checkUser");
        checkUser();
    }, [])



    useEffect(() => {
        // console.log("Promise.all");
        Promise.all([
            axios.get("http://localhost:5000/rights"),
            axios.get("http://localhost:5000/children"),
        ]).then(res => {
            // console.log("IndexRouter", res);
            // 所有的路由组件表 后续还要根据用户的权限再添加有权限的路由组件
            // set之后会把会把render函数重新执行一遍 而useEffect看依赖的值有没有变化
            // 如果有依赖的值且变化了 才会再执行一遍
            // console.log("setRouteList");
            setRouteList([...res[0].data, ...res[1].data]);
            // console.log([...res[0].data, ...res[1].data]);
        })
    }, [])

    const checkUser = () => {
        // console.log("checkUser");
        if (localStorage.getItem("token")) {
            const { role: { rights } } = JSON.parse(localStorage.getItem("token"));
            // console.log(rights);
            setUserRights(rights);
        }
    }
    // let rights = [];
    // console.log("IndexRouter2 normal");
    // if (localStorage.getItem("token")) {
    // rights = JSON.parse(localStorage.getItem("token")).role.rights
    // console.log("rights",rights);
    // }
    // const { role: { rights } } = JSON.parse(localStorage.getItem("token"));
    const checkRoute = (item) => {
        // console.log("checkRoute");
        // 路由表里面要有 而且 后端返回的路由 pagepermisson 要等于1 才能显示
        // return LocalRouterMap[item.key] && item.pagepermisson === 1;
        return LocalRouterMap[item.key] && (item.pagepermisson === 1 || item.routepermisson);
    }

    const checkUserPermission = (item) => {
        // console.log("checkUserPermission");
        // 当前用户权限列表
        // console.log(item, rights.includes(item.key));
        return rights.includes(item.key);
    }

    const auth = () => {
        // console.log("auth");
        return localStorage.getItem("token") ? <NewsSandBox /> : <Navigate to="/login" />
    }

    const login = () => {
        // console.log("login");
        checkUser();
    }


    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={auth()
                    // localStorage.getItem("token") ? <NewsSandBox /> : <Navigate to="/login" />
                    // <NewsSandBox />
                } >

                    {
                        routeList.map((item) => {
                            if (checkRoute(item) && checkUserPermission(item)) {
                                let path = item.key.substring(1,); // 截取除第一个 / 后面的所有 /home => home
                                return <Route key={item.key} path={path} element={LocalRouterMap[item.key]}></Route>
                            }
                            return null;
                        })
                    }
                    <Route path="*" element={<Nopermission />}></Route>


                </Route>

                <Route path="/login" element={<Login login={login} />}></Route>
                <Route path="/news" element={<News />}></Route>
                <Route path="/detail/:id" element={<Detail />}></Route>
                <Route path="*" element={<Nopermission />}></Route>

            </Routes>
        </HashRouter>
    )
}
