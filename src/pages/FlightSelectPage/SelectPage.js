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
    const dataarr = [{flightNumber: 2 ,departuredate: '2023-6-4',scheduledArrivaldate: '2023-6-4',departureTime: '18:00',scheduledArrivalTime:'19:00',totalseat:30,departurePoint:'成都',destinationPoint:'北京'}]
    let i = 0;
    // let dataarr;
    // axios.post('/selectFlight', {
    //   account
    // })
    // .then(response => {
    //   // 处理响应数据
    //  dataarr =  response.data;
    // })
    // .catch(error => {
    //   // 处理错误
    //   console.error(error);
    // });
    
    let TicketList = [];
    dataarr.forEach(data => {
      const{flightNumber ,departureTime,scheduledArrivalTime,departuredate,scheduledArrivaldate,departurePoint,destinationPoint} = data;
      
      const departureTimeDate = new Date(departuredate +' '+ departureTime);
      console.log(departureTimeDate);
      const arrivalTimeDate = new Date(scheduledArrivaldate +' '+ scheduledArrivalTime);
      const duration = Math.floor((arrivalTimeDate - departureTimeDate) / 1000 / 60);
     
      TicketList.push(
        <div className="ticket" key={i}  style={{"marginTop" : "1rem"}}>
          <div className="header">
            <img src="./logos/logo.png" alt="Logo" className="logo" />
            <div className="number">{flightNumber}</div>
          </div>
          <div className="times">
            <div className="departure-time">{departureTime}</div>
            <div className="duration">总时长: {duration} 分钟</div>
            <div className="arrival-time">{scheduledArrivalTime}</div>
          </div>
          <div className="places">
            <div className="departure-place">{departurePoint}</div>
            <div className="arrival-place">{destinationPoint}</div>
          </div>
          </div>
      );
      i++
    });

return TicketList;

}
export default Select;
