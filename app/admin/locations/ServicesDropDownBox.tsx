import { DataGrid, DropDownBox } from "devextreme-react";
import { Column, Paging, Scrolling } from "devextreme-react/data-grid";
import { OptionChangedEventInfo } from "devextreme/core/dom_component";
import { EventInfo } from "devextreme/events";
import dxDataGrid, { SelectionChangedInfo } from "devextreme/ui/data_grid";
import dxDropDownBox from "devextreme/ui/drop_down_box";
import React, { useState } from "react";

interface Props {
  data: any;
}

export default function ServicesDropDownBox({ props }: { props: Props }) {
  const dropDownOptions = { width: 500 };
  const ownerLabel = { "aria-label": "name" };

  const [isDropDownOpened, setIsDropDownOpened] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([props.data.value]);

  function boxOptionChanged(e: OptionChangedEventInfo<dxDropDownBox>) {
    if (e.name === "opened") {
      setIsDropDownOpened(e.value);
    }
  }

  function onSelectionChanged(
    selectionChangedArgs: SelectionChangedInfo<dxDataGrid>
  ) {
    setSelectedRowKeys(selectionChangedArgs.selectedRowKeys);
    setIsDropDownOpened(false);
    props.data.setValue(selectedRowKeys[0]);
  }

  const contentRender = (): React.ReactNode => {
    return (
      <DataGrid
        dataSource={props.data.column.lookup.dataSource}
        remoteOperations={true}
        height={250}
        selectedRowKeys={selectedRowKeys}
        hoverStateEnabled={true}
        onSelectionChanged={onSelectionChanged}
        focusedRowEnabled={true}
        defaultFocusedRowKey={selectedRowKeys[0]}
      >
        <Column dataField="name" />
        {/* <Column dataField="Title" />
        <Column dataField="Department" />
        <Paging enabled={true} defaultPageSize={10} />
        <Scrolling mode="virtual" /> */}
        {/* <Selection mode="single" /> */}
      </DataGrid>
    );
  };

  return (
    <DropDownBox
      onOptionChanged={boxOptionChanged}
      opened={isDropDownOpened}
      dropDownOptions={dropDownOptions}
      dataSource={props.data.column.lookup.dataSource}
      value={selectedRowKeys[0]}
      displayExpr="name"
      valueExpr="id"
      inputAttr={ownerLabel}
      contentRender={contentRender}
    ></DropDownBox>
  );
}
