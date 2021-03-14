import { useState, useEffect } from "react";
import request from "axios";

interface Config {
    url: string,
    page?: number,
    errorHandler: Function
}

interface HookData {
    setPage: Function,
    setPageSize: Function,
    loadMore: Function,
    page: number,
    pageSize: number,
    loading: boolean,
    resData: any,
    total: number
}

function getData(url: string, page: number, pageSize: number, timeout = 15000) {
    return request.get(`${url}?page=${page}&pageSize=${pageSize}`, {
        timeout
        // transformResponse: [data => JSON.parse(data)]
    })
}

export default function useFetchData(config: Config): HookData {
    const { url, page: initialPage = 1, errorHandler = () => { } } = config
    const [page, setPage] = useState(initialPage);
    const [resData, setResData] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getData(url, page, pageSize).then(res => {
            const { data } = res
            if (data.code === 1) {
                setLoading(false);
                setResData(data);
                setTotal(data.count);
            } else {
                setLoading(false);
                setResData(null);
                throw new Error(data.message);
            }
        }).catch(err => {
            console.log(err)
            errorHandler(err);
        })
    }, [url, page, pageSize]);

    function loadMore() {
        setPage(page + 1);
    }

    return {
        setPage,
        setPageSize,
        loadMore,
        page,
        pageSize,
        loading,
        resData,
        total: total + 100
    }
}