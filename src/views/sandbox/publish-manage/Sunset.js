import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Tag, Button } from 'antd'
import { useNavigate } from 'react-router-dom';
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';

export default function Sunset() {

    const {dataSource,handleDelete} = usePublish(3) // 3 已经 

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => {
                console.log("删除");
                handleDelete(id);
            }}>删除</Button>}>

            </NewsPublish>
        </div>
    )
}
