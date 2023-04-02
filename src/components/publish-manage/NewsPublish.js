import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Tag, Button } from 'antd'
import { useNavigate } from 'react-router-dom';

export default function NewsPublish(props) {



    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                // console.log('render',item, title);
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title;
            }
        },
        {
            title: '操作',
            render: (item) => <div >
                {/* <Button>button</Button> */}
                {props.button(item.id)}
            </div >
        },
    ];



    return (
        <div>
            <Table dataSource={props.dataSource} rowKey={item => item.id} columns={columns} pagination={{ pageSize: 25 }} />
        </div>
    )
}
