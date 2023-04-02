import React, { useState, useEffect } from 'react'
import { Steps, Button, Form, Input, Select, message, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import style from "./News.module.css";

import NewsEditor from '../../../components/news-manage/NewsEditor';


export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [category, setCategory] = useState([]);
  const [addNewsForm] = Form.useForm();
  const [formInfo, setFormInfo] = useState({});
  const [content, setContent] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("/categories").then(res => {
      setCategory(res.data);
    })
  }, [])
  const next = () => {
    if (current === 0) {
      addNewsForm
        .validateFields()
        .then((values) => {
          // console.log(values);
          setFormInfo(values);
          setCurrent(current + 1);
        }).catch(error => {
          console.log(error);
        })
    } else {
      // console.log("content", content);
      if (content === '' || content.trim() === '<p></p>') {
        messageApi.open({
          type: 'error',
          content: '输入内容为空',
        });
      } else {
        setCurrent(current + 1);

      }
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const user = JSON.parse(localStorage.getItem('token'));
  const handleSave = (auditState) => {
    // console.log("handleSave");
    axios.post('/news', {
      ...formInfo,
      "content": content,
      "region": user.region ? user.region : '全球',
      "author": user.username,
      "roleId": user.roleId,
      "auditState": auditState, // 0 草稿箱 1提交审核
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 0
    }).then(res => {
      // navigate("/news-manage/draft")
      messageApi.open({
        type: 'success',
        content: '提交成功',
      })
      navigate(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")
    })
  }
  return (
    <div>
      {contextHolder}
      <h3 style={{ marginBottom: "20px" }}>撰写新闻</h3>
      <Steps
        current={current}
        items={[
          {
            title: '基本信息',
            description: '新闻标题, 新闻分类',
          },
          {
            title: '新闻内容',
            description: "新闻主题内容",
          },
          {
            title: '新闻提交',
            description: "保存草稿或提交审核",
          },
        ]}
      />
      <div style={{ marginTop: "25px" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form
            name="basic"
            // labelCol={{
            //   span: 8,
            // }}
            // wrapperCol={{
            //   span: 16,
            // }}
            // initialValues={{
            //   remember: true,
            // }}
            form={addNewsForm}
            onFinish={(values) => {
              console.log(values);
            }}
            // onFinishFailed={()=>{
            //   console.log("onFinishFailed");
            // }}
            autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: '请输入新闻标题',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: '请选择新闻类别',
                },
              ]}
            >
              <Select options={category} fieldNames={{ label: "value", value: "id" }} />
            </Form.Item>



            {/* <Form.Item
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item> */}
          </Form>
        </div>
        <div className={current === 1 ? "" : style.active}>
          <NewsEditor getContent={(content) => {
            // console.log("content", content);
            setContent(content);
          }}></NewsEditor>
        </div>
        {/* <div className={current === 2 ? "" : style.active}>333</div> */}
      </div>
      <div className="steps-action">
        {current < 2 && (
          <Button type="primary" onClick={() => {
            next()
          }}>
            下一步
          </Button>
        )}
        {current === 2 && (
          <>
            {/* <Button type='primary' onClick={handleSave}>保存到草稿箱</Button> */}
            <Button type='primary' onClick={() => handleSave(0)}>保存到草稿箱</Button>
            <Button style={{
              margin: '0 8px',
            }} onClick={() => handleSave(1)} danger >
              提交审核
            </Button>
          </>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: '0 8px',
            }}
            onClick={() => prev()}
          >
            上一步
          </Button>
        )}
      </div>

      {/* <Button type='primary'>上一步</Button> & nbsp;
      <Button type='primary'>下一步</Button> */}
    </div >
  )
}
