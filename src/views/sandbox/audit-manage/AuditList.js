import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Tag, Button } from 'antd'
import { useNavigate } from 'react-router-dom';


export default function AuditList() {


    const { username } = JSON.parse(localStorage.getItem("token"))
    const navigate = useNavigate();

    const [dataSource, setdataSource] = useState([]);

    const auditList = ["未审核", "审核中", "已通过", "未通过"];
    // const publishList = ["未发布", "发布中", "已上线", "已下线"];
    const colorList = ["", 'orange', "green", "red"]
    useEffect(() => { // 不包含0 
        // axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
        //     console.log(res.data);
        //     setdataSource(res.data);
        // })
        getAuditList();
    }, [username])

    const getAuditList = () => {
        axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            console.log(res.data);
            setdataSource(res.data);
        })
    }

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
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {

                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => <div key={item.id}>
                {
                    item.auditState === 1 && < Button danger onClick={() => handleRevert(item)} >撤销</Button >
                }
                {
                    item.auditState === 2 && < Button onClick={() => handlePublish(item)} >发布</Button >
                }
                {
                    item.auditState === 3 && < Button type='primary' onClick={() => handleUpdate(item)}>更新</Button >
                }
            </div >
        },
    ];

    const handleRevert = (item) => {
        console.log("handleRevert", item);
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            getAuditList();
        })
    }

    const handlePublish = (item) => {
        axios.patch(`/news/${item.id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            // getAuditList();
            navigate(`/publish-manage/published`)
        })
    }

    const handleUpdate = (item) => {
        navigate(`/news-manage/update/${item.id}`)
    }

    return (
        <div>
            <Table dataSource={dataSource} rowKey={item => item.id} columns={columns} pagination={{ pageSize: 5 }} />

        </div>
    )
}
