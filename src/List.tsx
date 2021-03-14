import { Table, message } from "antd";
import { useState } from "react";
import useFetchData from "./CustomHooks/useFetchData";

function List() {
    const [total, setTotal] = useState(0);
    const {
        page,
        pageSize,
        setPage,
        setPageSize,
        loading,
        response
    } = useFetchData({
        url: 'http://localhost:8080/data',
        onSuccess: (response: any) => {
            if (response && response.data.count !== total) {
                setTotal(response.data.count);
            }
        },
        onError: (error: Error) => {
            message.error(error.message);
            setPage(1);
        }
    });


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