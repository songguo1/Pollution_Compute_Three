export const hotSettings={
    data: null,
    licenseKey: "non-commercial-and-evaluation",
    width: "auto",
    height: "400px",
    startRows: 1,
    startCols: 3,
    minRows: 1,
    minCols: 3,
    colHeaders: true,
    rowHeaders: true,
    dropdownMenu: false,
    className: "htCenter",
    currentRowClassName: "my-selectRow",
    currentColClassName: "my-selectCol",
    autoWrapRow: true,
    fixedRowsTop: 0,
    fixedColumnsLeft: 4,
    fillHandle: true,
    wordWrap: true, // 启用单元格内容自动换行
    autoColumnSize: true, // 根据内容自动调整列宽
    autoRowSize: true, // 根据内容自动调整行高

    afterSelection:null,

    contextMenu: {
      items: {
        row_above: {
          name: "上面插入一行",
        },
        row_below: {
          name: "下面插入一行",
        },
        col_left: {
          name: "左侧插入一列",
        },
        col_right: {
          name: "右侧插入一列",
        },
        remove_row: {
          name: "移除本行",
        },
        remove_col: {
          name: "移除本列",
        },
        alignment: {
          name: "对齐方式",
        },
        make_read_only: {
          name: "只读",
        },
        copy: {
          name: "复制",
        },
        cut: {
          name: "剪切",
        },

        clear_custom: {
          name: "清空所有单元格数据",
          callback: function () {
            this.clear();
          },
        },
      },
    },
  }