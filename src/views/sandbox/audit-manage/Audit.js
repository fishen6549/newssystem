import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Tag, Button } from 'antd'
import { DownloadOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';



export default function Audit() {

  const [dataSource, setdataSource] = useState([]);
  // const auditList = ["未审核", "审核中", "已通过", "未通过"];
  // const publishList = ["未发布", "发布中", "已上线", "已下线"];

  const { username, roleId, region } = JSON.parse(localStorage.getItem("token"));
  const roleObj = {
    "1": "superadmin",// 超级管理员
    "2": "admin", // 区域管理员
    "3": "editor" // 区域编辑
  }
  const getList = () => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data;
      setdataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ]);
    })
  }

  useEffect(() => {
    getList();
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
        <Button shape='circle' type='primary' icon={<CheckOutlined />} onClick={() => handleAudit(item, 2, 1)}></Button>
        &nbsp;&nbsp;
        <Button shape='circle' danger icon={<CloseOutlined />} onClick={() => handleAudit(item, 3, 0)} ></ Button>
      </div >
    },
  ];

  const handleAudit = (item, auditState, publishState) => {
    axios.patch(`/news/${item.id}`, {
      auditState, publishState
    }).then(res => {
      getList();
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} rowKey={item => item.id} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
