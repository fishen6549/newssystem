import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch, Tree } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, UploadOutlined } from "@ant-design/icons";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;
export default function NewsDraft() {

    const [dataSource, setDataSource] = useState([]);
    const { username } = JSON.parse(localStorage.getItem("token"))
    const navigate = useNavigate();
    const getNewsList = () => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            setDataSource(res.data);
        })
    }

    useEffect(() => {
        getNewsList();
    }, [])


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
            render: (item) => <div key={item.id}>
                < Button type='primary' shape='circle' icon={< EditOutlined />} onClick={() => navigate(`/news-manage/update/${item.id}`)}></Button >
                &nbsp;
                < Button danger
                    shape='circle' icon={< DeleteOutlined />} onClick={() => showDeleteConfirm(item)} ></Button >
                &nbsp;
                < Button type='primary'
                    shape='circle' icon={< UploadOutlined />} onClick={() => handleUpload(item)} ></Button >
            </div >
        },
    ];

    const handleUpload = (item) => {
        axios.patch(`/news/${item.id}`, {
            auditState: 1
        }).then(res => {
            navigate("/audit-manage/list")
        })
    }

    const showDeleteConfirm = (item) => {
        confirm({
            title: '确定删除吗?',
            icon: <ExclamationCircleFilled />,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteNewsMethod(item);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };


    const deleteNewsMethod = (item) => {
        // console.log("delete", item);
        axios.delete(`/news/${item.id}`).then(res => {
            // console.log(res);
            getNewsList();
        })
    }

    return (
        <div>
            <Table dataSource={dataSource} rowKey={item => item.id} columns={columns} pagination={{ pageSize: 5 }} />
        </div>
    )
}
