import { useRef, useState, useEffect,useCallback  } from 'react';
import { Web3Provider } from "@ethersproject/providers";
import { useContractFunction } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
// import ALContractABI from './artifacts/contracts/Airline.sol/Airline.json';
import { utils } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FlightCompanyPage = (ALcontract) => {
 
    //  /**
    //  * @dev 发布机票合约(msg.value必须大于_totalSeat * _ticketPrice / 2)
    //  * @param _totalSeat 总座位数
    //  * @param _departureTime 出发时间
    //  * @param _scheduledArrivalTime 预计到达时间
    //  * @param _ticketPrice 机票价格
    //  * @param _departurePoint 出发地点
    //  * @param _destinationPoint 目的地点
    //  * @param _flightNumber 航班号
    //  */
    const flightNumber = useRef();
    const departureTime = useRef();
    const scheduledArrivalTime = useRef();
    const totalSeat = useRef();
    const ticketPrice = useRef();
    const departurePoint = useRef()
    const destinationPoint = useRef()

  
    // const contractInterface = new utils.Interface(ALContractABI.abi);
    // const contractAddress ='0xb31a21D6Fe5238265BE0c604D3cE477342989AB6';
    // const provider = new Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const contract = new Contract(contractAddress, contractInterface,signer);

    const { send,state } = useContractFunction(ALcontract, 'releaseFlight');
    const callContractFunction = useCallback(() => {
        // 检查 contract 对象是否存在
        if (!ALcontract) {
          console.error("合约对象为空！");
          return;
        }
    
        // 获取用户输入的参数，并进行一些验证和格式化
        const flightNumberValue = flightNumber.current.value.trim();
        if (!flightNumberValue) {
          toast.error("请输入一个航班编号！");
          return;
        }
        const departureTimeValue = new Date(departureTime.current.value).getTime() / 1000;
        if (isNaN(departureTimeValue)) {
          toast.error("请输入出发时间！");
          return;
        }
        const scheduledArrivalTimeValue = new Date(scheduledArrivalTime.current.value).getTime() / 1000;
        if (isNaN(scheduledArrivalTimeValue)) {
          toast.error("请输入预计到达时间！");
          return;
        }
        if (departureTimeValue >= scheduledArrivalTimeValue) {
          toast.error("输入的到达时间小于出发时间！");
          return;
        }
        const totalSeatValue = parseInt(totalSeat.current.value);
        if (isNaN(totalSeatValue) || totalSeatValue <= 0) {
          toast.error("请输入一个正确的座位数！");
          return;
        }
        const ticketPriceValue = parseFloat(ticketPrice.current.value);
        if (isNaN(ticketPriceValue) || ticketPriceValue <= 0) {
          toast.error("请输入一个正确的票价！");
          return;
        }const departurePointValue = departurePoint.current.value;
        if (!departurePoint) {
          toast.error("请输入出发地！");
          return;
        }const destinationPointValue = destinationPoint.current.value;
        if (!destinationPoint) {
          toast.error("请输入目的地！");
          return;
        }
    
        // 调用合约函数，并传入参数，注意要把机票价格转换为 wei 单位
        send(
          totalSeatValue,
          departureTimeValue ,
          scheduledArrivalTimeValue,
          utils.parseEther(ticketPriceValue.toString()),
          departurePointValue,
          destinationPointValue,
          flightNumberValue,
         {value: utils.parseEther((ticketPriceValue*totalSeatValue/2).toString())})
      }, [send]);

    useEffect(() => {
        if(state.errorMessage){
            toast.error(state.errorMessage);
        }
    }, [state])
    

    return (
        <div className="grid grid-cols-2 gap-4 mt-5 mx-10">
            {/* 发布航班机票 */}
            <div className="bg-gray-800 p-8 rounded-3xl filter drop-shadow-xl">
                <h1 className="text-center font-bold text-xl">发布航班信息</h1>
                <div className="mt-5">
                    <label htmlFor="flightNumber" className="text-xl mr-5 inline-block text-right w-1/4">航班编号</label>
                    <input ref={flightNumber} name="flight_id" type="text" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
                </div>
                  <div className="mt-5">
                    <label htmlFor="flightNumber" className="text-xl mr-5 inline-block text-right w-1/4">出发地</label>
                    <input ref={departurePoint} name="flight_id" type="text" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
                </div>
                <div className="mt-5">
                    <label htmlFor="flightNumber" className="text-xl mr-5 inline-block text-right w-1/4">目的地</label>
                    <input ref={destinationPoint} name="flight_id" type="text" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
                </div>
                <div className="mt-5">
                    <label htmlFor="flight_id" className="text-xl mr-5 inline-block text-right w-1/4">总座位数</label>
                    <input ref={totalSeat} name="flight_id" type="number" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3" required/>
                </div>
                <div className="mt-5">
                    <label htmlFor="flight_id" className="text-xl mr-5 inline-block text-right w-1/4">机票价格</label>
                    <input ref={ticketPrice} name="flight_id" type="number" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
                </div>
                <div className="mt-5">
                    <label htmlFor="depart" className="text-xl mr-5 inline-block text-right w-1/4">预计起飞时间</label>
                    <input ref={departureTime} name="depart" type="datetime-local" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
                </div>
                <div className="mt-5">
                    <label htmlFor="arrive" className="text-xl mr-5 inline-block text-right w-1/4">预计到达时间</label>
                    <input ref={scheduledArrivalTime } name="arrive" type="datetime-local" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
                </div>
                
                <div className="text-center mt-10">
                    <button onClick={callContractFunction} className="py-2 px-3 bg-indigo-800 rounded-md text-white text-lg hover:bg-indigo-900">提交</button>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                />
        </div>
    )
}

export default FlightCompanyPage;