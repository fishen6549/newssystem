import { useEffect, useState } from 'react'
import axios from 'axios'


function usePublish(type) {

    const [dataSource, setdataSource] = useState([]);
    const { username } = JSON.parse(localStorage.getItem("token"))



    const getDataSource = () => {
        axios(`/news?author${username}&publishState=${type}&_expand=category`).then(res => {
            console.log(res.data);
            setdataSource(res.data);
        })
    }


    useEffect(() => {
        getDataSource();
    }, [])


    const handlePublish = (id) => {
        console.log(id);

        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            getDataSource();
        })
    }
    const handleSunset = (id) => {
        axios.patch(`/news/${id}`, {
            publishState: 3,
        }).then(res => {
            getDataSource();
        })
    }
    const handleDelete = (id) => {
        axios.delete(`/news/${id}`).then(res => {
            getDataSource();
        })
    }
    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish;