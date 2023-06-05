import React from 'react';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useRef,useState } from 'react';
import { toast } from 'react-toastify';
import { Web3Provider } from "@ethersproject/providers";
import FTcontractInterface from '../../artifacts/contracts/Flight.sol/Flight.json'
import IAcontractInterface from '../../artifacts/contracts/Insurance.sol/Insurance.json'


const FlightTicketBuy = ({dataarr}) => {
  console.log(dataarr);
  const FTcontractAddress = "0x9c966e7051B4ed77099f9900299F40c2099b0e5a";
  const IAcontractAddress = "0xF3D91537977876400A8d3018CEe80EBa7AF52fBF";
  const FTcontractInterfaceABI = FTcontractInterface.abi;
  const IAcontractInterfaceABI = IAcontractInterface.abi;
  const provider = new Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const FTcontract = new Contract(FTcontractAddress, FTcontractInterfaceABI,signer);
  const IAcontract = new Contract(IAcontractAddress, IAcontractInterfaceABI,signer);

  let number;
  let price;
  let i = 0;
const idnumber = useRef();
const seatnumber = useRef();
const [Insurance, setInsurance] = useState('4');

const handleBuy = async() => {
  const idNumberInput = prompt('请输入你的身份证号码:');
  const seatNumberInput = prompt('请输入你想要购买的座位号:');


  if (idNumberInput && seatNumberInput) {
    idnumber.current = idNumberInput;
    seatnumber.current = seatNumberInput;
    await TicketBuy();
    InsuranceBuy();
  }
};
  const setPrice = (TP,FN)=>{
    price = TP;
    number = FN;
    console.log("price:" + price , "number:" + number );
  }
  const TicketBuy = async()=>{
    if (!FTcontract) {
      console.error("合约对象为空！");
      return;
    }
    else{
      try{
        const result =  await FTcontract.buyTicket(
          number,
          idnumber.current,
          seatnumber.current,{
            value: utils.parseEther(price.toString())
          })
          console.log(result);
      }catch(error){
        console.log(error);
    toast.error(error.message);
      }
    }
      
    }
    const InsuranceBuy = async()=>{
      if (!IAcontract) {
        console.error("合约对象为空！");
        return;
      }else if (Insurance === "4"){
        return
      }
      else{
        try{
          const result =  await IAcontract.buyInsurance(
            number,
            Insurance.current,
            idnumber.current,{
              value: utils.parseEther(price.toString())
            })
            console.log(result);
        }catch(error){
          console.log(error);
      toast.error(error.message);
        }
      }
        
      }

  let TicketList = [];
      dataarr.forEach(data => {
        const{flightNumber ,departureTime,scheduledArrivalTime,departuredate,scheduledArrivaldate,ticketPrice,departurePoint,destinationPoint} = data;
        
        const departureTimeDate = new Date(departuredate +" "+ departureTime);
        const arrivalTimeDate = new Date(scheduledArrivaldate +" "+ scheduledArrivalTime);
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
            <div className="arrival-place">价格：{'    '}{ticketPrice}{'ETH'}</div>
            <div className="col-12">
            <label htmlFor="insurance-select">请选择保险类型:</label>
            <select value={Insurance} onChange={(e) => setInsurance(e.target.value)} className="form-select border-0" style={{height: "55px"}}>
                                        <option value="4">不购买保险</option>
                                        <option value="0">购买延误险</option>
                                        <option value="1">购买取消险</option>
                                        <option value="2">购买延误险和取消险</option>
            </select>
              <button onClick={()=>{setPrice(ticketPrice,flightNumber);handleBuy()}} className="btn btn-primary w-100 py-3" type="submit">购买</button>
            </div>
          </div>
        );
        i++
      });

  return TicketList;
};

export default FlightTicketBuy;
