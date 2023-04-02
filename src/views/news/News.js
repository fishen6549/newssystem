import React, { useEffect, useState } from 'react'
import { Card, Col, Row, List, Avatar, Button, Drawer } from 'antd';
import _ from "lodash";
import axios from 'axios'
export default function News() {
    const [viewList, setviewList] = useState([]);

    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category").then(res => {
            console.log("News", res.data);
            const _data = _.groupBy(res.data, item => item.category.title)
            console.log("_data", _data);
            // setviewList(_.groupBy(res.data, item => item.category.title))
            setviewList(Object.entries(_.groupBy(res.data, item => item.category.title)))
            // setTimeout(() => {
            //     console.log(viewList);
            // }, 1000);
        })
    }, [])


    const showList = () => {
        const card = [];
        for (const key in viewList) {
            const _data = <Col span={8}>
                <Card title={key} bordered={true} hoverable={true}>
                    <List

                        size='small'
                        dataSource={viewList[key]}
                        renderItem={(item) => (
                            <List.Item>
                                <a href={`#/detail/${item.id}`}> {item.title}</a>
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
            card.push(_data)
        }

        return card;
    }

    return (
        <div>
            <Row gutter={16}>
                {
                    // showList()
                    viewList.map(item =>
                        <Col span={8} key={item[0]}>
                            <Card title={item[0]} bordered={true} hoverable={true}>
                                <List
                                    pagination={{
                                        pageSize:3
                                    }}
                                    size='small'
                                    dataSource={item[1]}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <a href={`#/detail/${item.id}`}> {item.title}</a>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>)
                }
            </Row>
        </div>
    )
}
