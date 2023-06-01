import { useRef } from "react"
import axios from 'axios';
import { useEthers } from "@usedapp/core";

const ReturnTicketdata = (contract)=>{
    // 查看自己购买的机票和保险（可退票）
    const { account } = useEthers();

    let dataarr;
    axios.post('/selectTicket', {
      account
    })
    .then(response => {
      // 处理响应数据
     dataarr =  response.data;
    })
    .catch(error => {
      // 处理错误
      console.error(error);
    });
  



    return (
   '查看自己购买的机票和保险（可退票）'
    )
}

export default  ReturnTicketdata