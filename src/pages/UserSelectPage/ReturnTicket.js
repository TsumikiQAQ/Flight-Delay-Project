import axios from 'axios';
import { useEthers } from "@usedapp/core";
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useRef,useState } from 'react';
import { toast } from 'react-toastify';
import { Web3Provider } from "@ethersproject/providers";
import FTcontractInterface from '../../artifacts/contracts/Flight.sol/Flight.json'
import IAcontractInterface from '../../artifacts/contracts/Insurance.sol/Insurance.json'

const ReturnTicketdata = ()=>{
  const FTcontractAddress = "0x9c966e7051B4ed77099f9900299F40c2099b0e5a";
  const IAcontractAddress = "0xF3D91537977876400A8d3018CEe80EBa7AF52fBF";
  const FTcontractInterfaceABI = FTcontractInterface.abi;
  const IAcontractInterfaceABI = IAcontractInterface.abi;
  const provider = new Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const FTcontract = new Contract(FTcontractAddress, FTcontractInterfaceABI,signer);
  const IAcontract = new Contract(IAcontractAddress, IAcontractInterfaceABI,signer);

    // 查看自己购买的机票和保险（可退票）
    const { account } = useEthers();
    let number;
    let idnumber;
    let seatnumber;
    let _insurance;
    let i = 0;
    const dataarr = [{flightNumber: 2 ,departuredate: '2023-6-4',scheduledArrivaldate: '2023-6-4',departureTime: '18:00',scheduledArrivalTime:'19:00',ticketPrice:'0.01',totalseat:30,departurePoint:'成都',destinationPoint:'北京',insurance:4,idNumber:'012345678910111213',seatnumber:'1'}]

    // axios.post('/selectTicket', {
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
    const handlerefund = async() => {
      if (number&&idnumber&&seatnumber&&_insurance) {
        await InsuranceRefund();
        TicketRefund();
      }
    };
      const setdata = (FN,ID,SN,IA)=>{
        number = FN;
        idnumber = ID;
        seatnumber = SN;
        _insurance = IA;
        console.log("number:" + number,"idnumber:" + idnumber,"setnumber:" + seatnumber ,"insurance" + _insurance);
      }
      const TicketRefund = async()=>{
        if (!FTcontract) {
          console.error("合约对象为空！");
          return;
        }
        else{
          try{
            const result =  await FTcontract.refundTicket(
              number,
              seatnumber)
              console.log(result);
          }catch(error){
            console.log(error);
        toast.error(error.message);
          }
        }
          
        }
        const InsuranceRefund = async()=>{
          if (!IAcontract) {
            console.error("合约对象为空！");
            return;
          }else if(_insurance == 4){
            alert('您未购买保险')
            return;
          }
          else{
            try{
              const result =  await IAcontract.refundInsurance(
                number,
                idnumber)
                console.log(result);
            }catch(error){
              console.log(error);
          toast.error(error.message);
            }
          }
            
          }
    

    let TicketList = [];

    dataarr.forEach(data => {
      const{flightNumber ,departureTime,scheduledArrivalTime,departuredate,scheduledArrivaldate,ticketPrice,departurePoint,destinationPoint,insurance,idNumber,seatnumber} = data;
      
      const departureTimeDate = new Date(departuredate +' '+ departureTime);
      const arrivalTimeDate = new Date(scheduledArrivaldate +" "+ scheduledArrivalTime);
      const duration = Math.floor((arrivalTimeDate - departureTimeDate) / 1000 / 60);
      let insuranceText;
  switch (insurance) {
    case 0:
      insuranceText = "购买延误险";
      break;
    case 1:
      insuranceText = "购买取消险";
      break;
    case 2:
      insuranceText = "购买延误险和取消险";
      break;
    default:
      insuranceText = "未购买保险";
      break;
  }
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
          <div className="arrival-place">价格：{'    '}{ticketPrice}{'ETH'}</div>
          <div className="col-12">
            购买保险类型:{insuranceText}
            <button onClick={()=>{setdata(flightNumber,idNumber,seatnumber,insurance);handlerefund()}} className="btn btn-primary w-100 py-3" type="submit">退票</button>
            <button onClick={()=>{setdata(flightNumber,idNumber,seatnumber,insurance);InsuranceRefund()}} className="btn btn-primary w-100 py-3" type="submit">退保险</button>

          </div>
        </div>
      );
      i++
    });

return TicketList;
};

export default  ReturnTicketdata