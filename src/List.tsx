import { Table, message } from "antd";
import { useState } from "react";
import useFetchData from "./CustomHooks/useFetchData";

function List() {
    const {
        page,
        pageSize,
        setPage,
        setPageSize,
        loading,
        response
    } = useFetchData({
        url: 'http://localhost:8080/data',
        onSuccess: (response: Object) => {
            console.log(response);
        },
        onError: (error: Error) => {
            message.error(error.message);
            setPage(1);
        }
    });

    const [total, setTotal] = useState(0);
    if (response && response.count !== total) {
        setTotal(response.count);
    }


    function getColumns() {
        return [
            {
                title: 'id',
                dataIndex: 'id',
                key: 'id',
            }, {
                title: '姓名',
                dataIndex: 'name',
                key: 'name'
            }
        ];
    }

    function handlePageChange(newPage = 1, newPageSize = 10) {
        setPage(newPage);
        setPageSize(newPageSize);
    }

    const dataSource: Array<Object> = !response ? [] : response.data.list.slice(0, pageSize);
    return (
        <>
            <div>
                <Table
                    dataSource={dataSource}
                    columns={getColumns()}
                    rowKey="id"
                    pagination={{
                        current: page,
                        pageSize,
                        total,
                        onChange: handlePageChange
                    }}
                    loading={loading}
                    scroll={{
                        y: 500
                    }}
                />
            </div>
        </>
    )
}

export default List;