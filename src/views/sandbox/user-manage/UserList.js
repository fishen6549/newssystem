import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Popover, Switch, Modal, Form, Input, Radio, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";

import axios from 'axios';
import { isContentEditable } from '@testing-library/user-event/dist/utils/edit/isContentEditable';

const { confirm } = Modal;

const regionsObj = [
  {
    "id": 1,
    "title": "亚洲",
    "value": "亚洲"
  },
  {
    "id": 2,
    "title": "欧洲",
    "value": "欧洲"
  },
  {
    "id": 3,
    "title": "北美洲",
    "value": "北美洲"
  },
  {
    "id": 4,
    "title": "南美洲",
    "value": "南美洲"
  },
  {
    "id": 5,
    "title": "非洲",
    "value": "非洲"
  },
  {
    "id": 6,
    "title": "大洋洲",
    "value": "大洋洲"
  },
  {
    "id": 7,
    "title": "南极洲",
    "value": "南极洲"
  }
];

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addUserForm] = Form.useForm();

  const [rolesList, setRolesList] = useState([])

  const [messageApi, contextHolder] = message.useMessage();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentUpdateUser, setCurrentUpdateUser] = useState(null);

  // 范围
  const [regions, setRegions] = useState(regionsObj)

  const { username, roleId, region } = JSON.parse(localStorage.getItem("token"));
  const roleObj = {
    "1": "superadmin",// 超级管理员
    "2": "admin", // 区域管理员
    "3": "editor" // 区域编辑
  }
  const getUserList = () => {
    axios.get("http://localhost:5000/users?_expand=role").then(res => {
      // setUserList(res.data);
      // 用户只能看到自己和自己下面的用户 没有后端前端自己处理下
      const list = res.data;
      setUserList(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ]);

    })
  }

  const getRolessList = () => {
    axios.get("http://localhost:5000/roles").then(res => {
      setRolesList(res.data);
    })
  }

  // const getRegions = ()=>{
  //   axios.get("http://localhost:5000/regions").then(res => {
  //     setRolesList(res.data);
  //   })
  // }

  const addUser = (data) => {
    const _data = {
      ...data,
      "roleState": true,
      "default": false,
    }
    if (_data.region === "全球") {
      _data.region = "";
    }
    axios.post("http://localhost:5000/users", _data).then(res => {
      messageApi.open({
        type: 'success',
        content: '用户添加成功',
      });
      setIsModalOpen(false);
      getUserList(res.data);
    })
  }

  const updateUser = (data) => {
    axios.patch(`http://localhost:5000/users/${currentUpdateUser.id}`, data).then(res => {
      messageApi.open({
        type: 'success',
        content: '用户更新成功',
      });
      setIsModalOpen(false);
      getUserList(res.data);
    })
  }

  useEffect(() => {
    getUserList();
    getRolessList();
  }, [])

  useEffect(() => {
    // console.log("isAdmin,isUpdate");
    checkRegionDisabled();
  }, [isAdmin, isUpdate])


  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => <b>{region === "" ? "全球" : region}</b>,
      filters: [
        ...regions.map(item => ({ text: item.title, value: item.value })),
        {

          "text": "全球",
          "value": "全球"
        }

      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === "";
        }
        return item.region === value;
      }
    },
    {
      title: '角色名称',
      dataIndex: "role",
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        // console.log(roleState,item);
        return <Switch disabled={item.default} defaultChecked={roleState} onChange={(checked) => roleStateChange(checked, item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => <div>

        < Button disabled={item.default} type='primary' shape='circle' icon={< EditOutlined />} onClick={() => showUpdateModal(item)}></Button >

        &nbsp;
        < Button disabled={item.default} danger shape='circle' icon={< DeleteOutlined />} onClick={() => showDeleteConfirm(item)} ></Button >
      </div >
    },
  ];


  const checkRegionDisabled = () => {
    // console.log("checkRegionDisabled");
    if (isUpdate) {
      // 如果是更新 超级管理员可以选择所有
      if (roleObj[roleId] === "superadmin") {
        return regions;
      } else {
        // 非超管不能改地区
        // return regions.map(item => item.disabled = true);
        setRegions(regions.map(item => {
          item.disabled = true
          return item;
        }));
      }
    } else { // 新增用户
      // console.log("新增用户");
      if (roleObj[roleId] === "superadmin") {
        return regions;
      } else {
        setRegions(regions.map((item) => {
          if (item.value === region) {
            item.disabled = false;
          } else {
            item.disabled = true;
          }
          return item;
        }))
      }
    }
  }



  const roleStateChange = (checked, item) => {
    // console.log(checked, item);
    // let flag = checked ? 1 : 0;
    const data = {
      roleState: checked
    }
    // patch 修改其中一个属性
    axios.patch(`http://localhost:5000/users/${item.id}`, data).then(res => {
      // console.log(res);
      getUserList();
    })
  }

  const deleteUserMethod = (item) => {
    // console.log("delete", item);
    axios.delete(`http://localhost:5000/users/${item.id}`).then(res => {
      console.log(res);
      getUserList();
    })
  }


  const showDeleteConfirm = (item) => {
    confirm({
      title: '确定删除用户吗?',
      icon: <ExclamationCircleFilled />,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteUserMethod(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const showAddUserModal = () => {
    setIsUpdate(false);
    setIsModalOpen(true);
  }

  const showUpdateModal = (item) => {
    setCurrentUpdateUser(item);
    setIsUpdate(true);
    setIsModalOpen(true);
    // 如果是超级管理员
    if (item.roleId === 1) {
      setIsAdmin(true);
    }
    addUserForm.setFieldsValue(item);
    console.log(item);
  }



  return (
    <div>
      {contextHolder}
      <Button type='primary' onClick={() => showAddUserModal()}>添加用户</Button>
      <Table dataSource={userList} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 5 }} />
      <Modal
        open={isModalOpen}
        title={isUpdate ? "用户更新" : '添加用户'}
        okText={isUpdate ? "更新" : '添加'}
        cancelText="取消"
        onCancel={() => {
          addUserForm.resetFields();
          setIsModalOpen(false);
        }}
        onOk={() => {
          addUserForm
            .validateFields()
            .then((values) => {
              // addUserForm.resetFields();
              // onCreate(values);
              console.log(values);
              if (isUpdate) {
                updateUser(values);
              } else {
                addUser(values);
              }
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}


        afterClose={() => {
          addUserForm.resetFields();
          setIsAdmin(false);
        }}
      >
        <Form
          form={addUserForm}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          ><Input type='password' /></Form.Item>
          <Form.Item
            name="region"
            label="区域"
            // 如果是超级管理员 取消校验+空字符
            rules={isAdmin ? [] : [
              {
                required: true,
                message: '请选择区域!',
              },
            ]}

          >
            <Select options={regions} disabled={isAdmin} />
            {/* <Select options={() => checkRegionDisabled()} disabled={isAdmin} /> */}
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色"
            rules={[
              {
                required: true,
                message: '请选择角色!',
              },
            ]}
          >
            <Select fieldNames={{ label: "roleName", value: "roleType", }} options={rolesList}
              onChange={(value) => {
                // console.log(value);
                // 如果是超级管理员 区域不用选
                if (value === 1) {
                  setIsAdmin(true);
                  addUserForm.setFieldValue("region", "")
                } else {
                  setIsAdmin(false);
                }
              }} />
          </Form.Item>
        </Form>
      </Modal>
    </div >
  )
}
