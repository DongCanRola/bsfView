/**
 * Created by dongc_000 on 2018/5/1.
 */

const customerList = [
  {
    title: "编号",
    width: "10%",
    dataIndex: "customerId",
    sorter: (a, b) => a.customerId - b.customerId,
  },{
    title: "类型",
    render:(record) => {
      let show = "直接销售";
      if(record.customerType === 3)
        show = "代理销售";
      return(<span>{show}</span>);
    },
    width: "10%"
    //dataIndex: "customerType"
  },{
    title: "名称",
    width: "20%",
    dataIndex: "customerName"
  },{
    title: "负责人",
    width: "10%",
    dataIndex: "customerManager"
  },{
    title: "电话",
    dataIndex: "customerTelephone",
    width: "10%"
  },{
    title: "邮箱",
    dataIndex: "customerEmail",
    width: "15%"
  },{
    title:"地址",
    dataIndex: "customerAddress",
    width:"25%"
  }
];
export function customerColumn() {
  return customerList;
}
