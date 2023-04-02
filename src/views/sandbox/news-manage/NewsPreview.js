import React, { useEffect, useState } from 'react'
import { Breadcrumb, Descriptions, Button } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';


export default function NewsPreview(props) {
  // console.log(props);
  const params = useParams();
  const [newInfo, setnewsInfo] = useState(null)
  useEffect(() => {
    console.log(params);
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
      // console.log(res);
      setnewsInfo(res.data)
    })
  }, [params])

  const auditList = ["未审核", "审核中", "已通过", "未通过"];
  const publishList = ["未发布", "发布中", "已上线", "已下线"];

  return (
    <div>
      {/* <Breadcrumb>
        <Breadcrumb.Item href="#/news-manage/draft">返回</Breadcrumb.Item>

      </Breadcrumb> */}

      <Button onClick={() => window.history.back()} style={{ marginBottom:'15px'}}>返回</Button>
      {
    newInfo && <Descriptions title={newInfo.title}>
      <Descriptions.Item label="创建者">{newInfo.author}</Descriptions.Item>
      <Descriptions.Item label="创建时间">{dayjs(newInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
      <Descriptions.Item label="发布时间">{newInfo.publishTime ? dayjs(newInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
      <Descriptions.Item label="区域">{newInfo.region}</Descriptions.Item>
      <Descriptions.Item label="审核状态">
        {<span style={{ color: "red" }}> {auditList[newInfo.auditState]}</span>}

      </Descriptions.Item>
      <Descriptions.Item label="发布状态">
        {<span style={{ color: "red" }}> {publishList[newInfo.publishState]}</span>}
      </Descriptions.Item>
      <Descriptions.Item label="访问数量"> {newInfo.view}</Descriptions.Item>
      <Descriptions.Item label="评论数量">
        0        </Descriptions.Item>
      <Descriptions.Item label="点赞数量">
        {newInfo.star}</Descriptions.Item>
    </Descriptions>


  }
  {
    newInfo && <div dangerouslySetInnerHTML={{ __html: newInfo.content }} style={{ border: "1px solid #ccc" }}>

    </div>
  }
    </div >
  )
}
