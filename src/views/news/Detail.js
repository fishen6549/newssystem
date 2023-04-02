import React, { useEffect, useState } from 'react'
import { Breadcrumb, Descriptions, Button, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { HeartTwoTone } from "@ant-design/icons"

export default function Detail(props) {
  // console.log(props);
  const params = useParams();
  const [newInfo, setnewsInfo] = useState(null)
  useEffect(() => {
    console.log(params);
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
      // console.log(res);
      setnewsInfo(res.data)
      setnewsInfo({
        ...res.data,
        view: res.data.view + 1
      })
      return res.data;
    }).then(res => {
      axios.patch(`/news/${params.id}`, {
        view: res.view + 1
      })
    })
  }, [params])

  const auditList = ["未审核", "审核中", "已通过", "未通过"];
  const publishList = ["未发布", "发布中", "已上线", "已下线"];

  const handleStar = () => {
    setnewsInfo({
      ...newInfo,
      star: newInfo.star + 1
    })
    axios.patch(`/news/${params.id}`, {
      star: newInfo.star + 1
    })
  }

  return (
    <div style={{ padding: "10px 20px 0" }}>
      {/* <Breadcrumb>
        <Breadcrumb.Item href="#/news-manage/draft">返回</Breadcrumb.Item>

      </Breadcrumb> */}

      <Button onClick={() => window.history.back()} style={{ marginBottom: '15px' }}>返回</Button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar} />
      {
        newInfo && <Descriptions title={newInfo.title}>
          <Descriptions.Item label="创建者">{newInfo.author}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{newInfo.publishTime ? dayjs(newInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
          <Descriptions.Item label="区域">{newInfo.region}</Descriptions.Item>
          <Descriptions.Item label="访问数量"> {newInfo.view}</Descriptions.Item>
          <Descriptions.Item label="评论数量">
            0        </Descriptions.Item>
          <Descriptions.Item label="点赞数量">
            {newInfo.star}</Descriptions.Item>
        </Descriptions>


      }
      <Divider />

      {
        newInfo && <div dangerouslySetInnerHTML={{ __html: newInfo.content }} >

        </div>
      }
    </div >
  )
}
