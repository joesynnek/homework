import { useState, useEffect } from "react";
import request from "axios";

interface Config {
    url: string,
    page?: number,
    pageSize?: number,
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


/**
* 1. 翻页和加载更多
    通过调用hook返回的setPage和loadMore实现（也可以实现对page操作提供更简单的api例如gotoPage/nextPage/prevPage等）
  2. 错误处理
    对于错误只关心如何处理，不需要保存状态，所以通过config中配置errorHandler回调方法来抛出Error到外部
*/

export default function useFetchData(config: Config): HookData {
    const {
        url,
        page: initialPage = 1,
        pageSize: initialPageSize = 10,
        errorHandler = () => { }
    } = config
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [total, setTotal] = useState(0);
    const [resData, setResData] = useState(null);
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
        total
    }
}