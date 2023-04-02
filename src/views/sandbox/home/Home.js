import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Button, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as Echarts from 'echarts';
import _ from "lodash";
const { Meta } = Card;


export default function Home() {
    const [viewList, setviewList] = useState([]);
    const [starList, setstarList] = useState([]);
    const [pieData, setpieData] = useState([])
    const [pieChart, setpieChart] = useState(null)

    const [open, setOpen] = useState(false);


    const barRef = useRef();
    const pieRef = useRef();
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
            // console.log(res.data);
            setviewList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
            // console.log(res.data);
            setstarList(res.data)
        })
    }, [])

    useEffect(() => {

        axios.get("/news?publishState=2&_expand=category").then(res => {
            // console.log(res.data);
            // console.log(_.groupBy(res.data, item => item.category.title),);
            renderBar(_.groupBy(res.data, item => item.category.title))
            setpieData(res.data);
        })
        return () => {
            console.log("destory");
            window.onresize = null;
        }
    }, [])

    const renderBar = (data) => {
        // 基于准备好的dom，初始化echarts实例
        // var myChart = Echarts.init(document.getElementById('main'));
        // console.log("renderBar");
        let myChart = Echarts.init(barRef.current);

        // 指定图表的配置项和数据
        let option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(data),
                axisLabel: {
                    rotate: "45"
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(data).map(item => item.length)
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);


        // window.addEventListener('resize', function () {
        //     console.log("resize");
        //     myChart.resize();
        // });

        window.onresize = () => {
            // console.log(this);
            myChart.resize();
        }
    }

    const renderPie = (data) => {
        // console.log("pieData",pieData);
        const pieList = pieData.filter(item => item.author === username);
        // console.log("pieList",pieList);
        const groupBypieData = _.groupBy(pieList, item => item.category.title)
        // console.log("groupBypieData",groupBypieData);
        const list = [];
        for (const key in groupBypieData) {
            list.push({
                name: key,
                value: groupBypieData[key].length
            })
        }
        // var chartDom = document.getElementById('main');
        let myChart = null;
        if (pieChart === null) {
            myChart = Echarts.init(pieRef.current);
            setpieChart(myChart);
        } else {
            return;
        }
        let option;

        option = {
            title: {
                text: '当前用户新闻分类图示',
                // subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"));
    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List

                            size='small'
                            dataSource={viewList}
                            renderItem={(item) => (
                                <List.Item>
                                    <a href={`#/news-manage/preview/${item.id}`}> {item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List

                            size='small'
                            dataSource={starList}
                            renderItem={(item) => (
                                <List.Item>
                                    <a href={`#/news-manage/preview/${item.id}`}> {item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                setOpen(true);
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : "全球"}</b>&nbsp;&nbsp;
                                    {roleName}
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <>
                <Button type="primary" onClick={showDrawer}>
                    Open
                </Button>
                <Drawer width="500px" title="Basic Drawer" placement="right" onClose={onClose} open={open} afterOpenChange={(open) => {
                    // console.log("afterOpenChange", open);
                    if (open) {
                        renderPie(pieData);
                    }
                }}>
                    <div id="main" ref={pieRef} style={{ height: "400px", marginTop: "20px" }}></div>
                </Drawer>
            </>
            <div id="main" ref={barRef} style={{ height: "400px", marginTop: "20px" }}></div>
        </div>
    )
}
