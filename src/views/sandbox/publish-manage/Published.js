import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Tag, Button } from 'antd'
import { useNavigate } from 'react-router-dom';
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';

export default function Unpublished() {



    const { dataSource, handleSunset } = usePublish(2) // 2已经发布

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button onClick={() => {
                console.log("下线");
                handleSunset(id);
            }}>下线</Button>}>

            </NewsPublish>
        </div>
    )
}
