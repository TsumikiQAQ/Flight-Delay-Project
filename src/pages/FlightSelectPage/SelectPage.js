import { useEthers } from '@usedapp/core';
import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { useContractFunction } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import { utils } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Select = ()=>{
    const { account } = useEthers();
    
    let dataarr;
    axios.post('/selectFlight', {
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
    let FlighttList =''
    for(let i=0; i<dataarr.length; i++){
        FlighttList += `
        <tr>
        <th>航班编号</th>
        <th>预定起飞时间</th>
        <th>预定到达时间</th>
        <th>机票价格</th>
        <th>座位数量</th>
        <th>出发地</th>
        <th>目的地</th>
      </tr>
      <tr>
        <td>${dataarr[i].flightNumber}</td>
        <td>${dataarr[i].departureTime}</td>
        <td>${dataarr[i].scheduledArrivalTime}</td>
        <td>${dataarr[i].ticketPrice}</td>
        <td>${dataarr[i].totalSeat}</td>
        <td>${dataarr[i].departurePoint}</td>
        <td>${dataarr[i].destinationPoint}</td>
      </tr>
      <div><button>预订</button></div>
        `
    }

return(
<div>
    <div>
  {FlighttList}
        </div>
        </div>
)
}
export default Select;
