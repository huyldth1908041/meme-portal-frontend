import styled from 'styled-components';
import { Table } from 'antd';

const TableStyled = styled(Table)`
  overflow: auto;
  font-family: Roboto, sans-serif;
  tr {
    font-size: 16px;
  }
  thead th {
    font-weight: 600;
  }
`
export default function AppTable({columns, data, selectionType, width, onRowSelectionChange, pagination, renderFooter, renderTitle}) {
  const rowSelection = {
    onChange: onRowSelectionChange,
    // getCheckboxProps: (record) => ({
    //     disabled: record.name === 'Disabled User',
    //     // Column configuration not to be checked
    //     name: record.name,
    // }),
  };

  return (
    <TableStyled
      rowSelection={selectionType && {
        type: selectionType,
        ...rowSelection
      }}
      dataSource={data}
      columns={columns}
      pagination={pagination || {position: ["none", "none"]}}
      style={{width: width || "100%"}}
      footer={renderFooter && renderFooter}
      title ={renderTitle && renderTitle}
    />
  )
}