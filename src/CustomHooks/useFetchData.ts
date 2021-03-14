import { useState, useEffect } from "react";
import request from "axios";

function getData(url: string, page: number, pageSize: number, timeout = 15000) {
    return request.get(`${url}?page=${page}&pageSize=${pageSize}`, {
        timeout
        // transformResponse: [data => JSON.parse(data)]
    })
}

// type Status = "success" | "error" | "loading";

interface Config {
    url: string,  // 请求url
    page?: number, // 初始页码
    pageSize?: number,  // 初始页容量
    onSuccess: Function, // 成功回调 function(response)
    onError: Function  // 失败回调　function(error)
}

interface HookResponse {
    // setPage/setPageSize/loadMore 这三个方法用于加载更多数据（除此之外还可以定义如gotoPage/nextPage/prevPage等方法）
    setPage: Function,
    setPageSize: Function,
    loadMore: Function,
    // 当前页和当前页容量
    page: number,
    pageSize: number,
    // loading状态
    loading: boolean,
    // 请求成功返回对象
    response: any,
    // 错误对象
    error: Error | null
}

export default function useFetchData(config: Config): HookResponse {
    const {
        url,
        page: initialPage = 1,
        pageSize: initialPageSize = 10,
        onSuccess = () => { },
        onError = () => { }
    } = config;
    const [page, setPage] = useState(initialPage);
    const [error, setError] = useState(null);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getData(url, page, pageSize).then(res => {
            const { data } = res
            if (data.code === 1) {
                onSuccess(res);
                setResponse(data);
            } else {
                setResponse(null);
                throw new Error(data.message);
            }
        }).catch(err => {
            setError(error);
            onError(err);
        }).finally(() => {
            setLoading(false);
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
        error,
        response
    }
}