import { Table, Empty, message } from "antd";
import useFetchData from "./CustomHooks/useFetchData";

function List() {
    const {
        page,
        pageSize,
        setPage,
        setPageSize,
        loading,
        resData,
        total
    } = useFetchData({
        url: 'http://localhost:8080/data',
        errorHandler: (error: Error) => {
            message.error(error.message);
            setPage(1);
            setPageSize(10);
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

    const dataSource: Array<Object> = resData === null ? [] : resData.data.list;
    return (
        <>
            <div style={{ height: "100%", overflow: "auto" }}>
                <Table
                    dataSource={dataSource}
                    columns={getColumns()}
                    pagination={{
                        current: page,
                        pageSize,
                        total,
                        onChange: handlePageChange
                    }}
                    loading={loading}
                />
            </div>
        </>
    )
}

export default List;