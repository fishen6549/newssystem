import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import axios from 'axios';

const { confirm } = Modal;

export default function RightList() {

  const [rightList, setRightList] = useState([])
  const getRightsList = () => {
    axios.get("http://localhost:5000/rights?_embed=children").then(res => {
      res.data.forEach(item => {
        if (item.children.length === 0) {
          item.children = "";
        }
      })
      setRightList(res.data);
    })
  }

  useEffect(() => {
    getRightsList();
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => <Tag color='orange'>{key}</Tag>
    },
    {
      title: '操作',
      render: (key) => <div>
        <Popover trigger={key.pagepermisson === undefined ? "focus" : "hover"} title="页面配置项" content={
          <div style={{ textAlign: "center" }}>
            <Switch defaultChecked={key.pagepermisson === 1} onChange={(checked) => pagepermissonChange(checked, key)}></Switch>
          </div>
        } >
          {/* 有pagepermisson属性的可以配置开关 */}
          < Button disabled={key.pagepermisson === undefined} type='primary' shape='circle' icon={< EditOutlined />}></Button >
        </Popover >
        &nbsp;
        < Button danger onClick={() => showDeleteConfirm(key)
        } shape='circle' icon={< DeleteOutlined />} ></Button >
      </div >
    },
  ];

  const showDeleteConfirm = (item) => {
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleFilled />,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteMethod = (item) => {
    // console.log("delete", item);
    if (item.grade === 1) {
      axios.delete(`http://localhost:5000/rights/${item.id}`).then(res => {
        console.log(res);
        getRightsList();
      })
    } else {
      deleteChildrenMethod(item);
    }
  }
  // 删除children权限
  const deleteChildrenMethod = (item) => {
    axios.delete(`http://localhost:5000/children/${item.id}`).then(res => {
      console.log(res);
      getRightsList();
    })
  }

  // 开关侧边栏权限

  const pagepermissonChange = (checked, item) => {
    console.log(checked, item);
    let flag = checked ? 1 : 0;
    const data = {
      pagepermisson: flag
    }
    // patch 修改其中一个属性
    axios.patch(`http://localhost:5000/rights/${item.id}`, data).then(res => {
      // console.log(res);
      getRightsList();
    })
  }

  return (
    <div>
      <Table dataSource={rightList} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 5 }} />

    </div>
  )
}
