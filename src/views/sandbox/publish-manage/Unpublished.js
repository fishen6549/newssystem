import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';

export default function Unpublished() {

    const { dataSource, handlePublish } = usePublish(1) // 1未发布

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button type='primary' onClick={() => {
                console.log("发布");
                handlePublish(id);
            }}>发布</Button>}>
                发布
            </NewsPublish>
        </div>
    )
}
