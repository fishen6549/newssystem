import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "./Login.css"
export default function Login(props) {

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const login = (data) => {
        // axios.get(`http://localhost:5000/users?username=${data.username}&password=${data.password}&roleState=true&_expand=role`)
        axios.get(`/users?username=${data.username}&password=${data.password}&roleState=true&_expand=role`)
            .then(res => {
                console.log(res.data);
                if (res.data.length === 0) {
                    messageApi.open({
                        type: 'error',
                        content: '用户名或密码错误',
                    });
                } else {
                    localStorage.setItem("token", JSON.stringify(res.data[0]));
                    messageApi.open({
                        type: 'success',
                        content: '登录成功',
                    });
                    // console.log(props);
                    props.login();
                    // navigate("/home"); 动态路由跳到/home有问题 因为还没有被创建出来
                    navigate("/");

                }
            })
    }

    return (
        <div style={{ background: "rgb(35,39,65)", height: "100%" }}>
            {contextHolder}
            <div className='login-form-warp'>
                <h2>全球新闻发布系统</h2>
                <Form
                    name="normal_login"
                    className="login-form"

                    onFinish={(values) => {
                        console.log(values);
                        login(values);
                    }}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{
                            required: true,
                            message: 'Please input your Password!',
                        }
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
