import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch, Tree } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import axios from 'axios';

const { confirm } = Modal;


export default function RoleList() {
  const [rolesList, setRolesList] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rightList, setRightList] = useState([])
  const [checkedKeys, setCheckedKeys] = useState([])
  const [currentRole, setCurrentRole] = useState({});
  const getRolessList = () => {
    axios.get("http://localhost:5000/roles").then(res => {
      setRolesList(res.data);
    })
  }

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
    getRolessList();
  }, [])
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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => <div key={item.id}>
        < Button type='primary' shape='circle' onClick={() => showModal(item)} icon={< EditOutlined />}></Button >
        &nbsp;
        < Button danger onClick={() => showDeleteConfirm(item)}
          shape='circle' icon={< DeleteOutlined />} ></Button >
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
        deleteRoleListMethod(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteRoleListMethod = (item) => {
    // console.log("delete", item);
    axios.delete(`http://localhost:5000/roles/${item.id}`).then(res => {
      console.log(res);
      getRolessList();
    })
  }

  const updateRoleRights = () => {
    const data = {
      rights: checkedKeys
    }
    axios.patch(`http://localhost:5000/roles/${currentRole.id}`, data).then(res => {
      console.log("updateRoleRights", res);
      getRolessList();
    })
  }

  const showModal = (item) => {
    setIsModalOpen(true);
    // console.log(item.rights);
    setCurrentRole(item);
    setCheckedKeys(item.rights)
  };

  const handleOk = () => {
    updateRoleRights();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue.checked);
  };

  return (
    <div>
      <Table dataSource={rolesList} rowKey={item => item.id} columns={columns} pagination={{ pageSize: 5 }} />

      <Modal title="角色权限管理" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable

          treeData={rightList}
          // defaultCheckedKeys={checkedKeys}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          checkStrictly={true} // 父子节点选中状态不再关联
        />
      </Modal>
    </div>
  )
}
