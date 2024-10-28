export function createChartConfig(xAxisData, yAxisData) {
  return {
     
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: yAxisData, // 这里应该填充实际的数据
          type: "bar",
        },
      ],
    }
  
}