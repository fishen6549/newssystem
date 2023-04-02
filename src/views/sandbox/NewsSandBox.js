import React, { useEffect, Suspense } from 'react'

import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'

import { Outlet, Navigate } from 'react-router-dom'

import { Layout } from 'antd';
import "./NewsSandBox.css";


import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';





const { Content } = Layout;

// const Loading = () => {
//     useEffect(() => {
//         console.log("进度条开始");
//         nprogress.start();
//         return () => {
//             console.log("进度条结束");
//             nprogress.done();
//         }
//     })
//     return (
//         <React.Fragment />
//     )
// }


export default function NewsSandBox() {
    const isLoading = useSelector(state => {
        // console.log("NewsSandBox",state);
        return state.LoadingReducer.isLoading;
    });
    nprogress.start();
    useEffect(() => {
        // console.log("NewsSandBox");
        // localStorage.getItem("token") ? <Navigate to="/home" /> : <Navigate to="/login" />
        nprogress.done();
    })
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">

                <TopHeader></TopHeader>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: "white",
                        overflow: "auto"
                    }}
                >
                    <Spin spinning={isLoading}>
                        <Outlet></Outlet>
                    </Spin>
                </Content>
            </Layout>

        </Layout>
    )
}
