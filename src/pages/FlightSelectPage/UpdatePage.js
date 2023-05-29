import { useRef, useState, useEffect } from 'react';
import { useContractFunction } from '@usedapp/core';
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from '@ethersproject/contracts';
import ALContractABI from 'E:/Flight_Delay_Project/flight-delay-insurance-dapps/src/artifacts/contracts/Airline.sol/Airline.json';
import { utils } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
    // /**
    //  * @dev 由航空公司上传航班实际到达时间
    //  * @param _actualArrivalTime 实际到达时间
    //  */
    // 航班号对于机票合约地址
    // mapping(string => address) public flightNumberToAddress;

const Update = ()=>{
    
    const flightNumber = useRef()
    const _actualArrivalTime = useRef();
      // 创建合约对象
    const ALcontractInterface = new utils.Interface(ALContractABI.abi);
    const ALcontractAddress ='0xb31a21D6Fe5238265BE0c604D3cE477342989AB6';
    const provider = new Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const ALcontract = new Contract(ALcontractAddress,ALcontractInterface,signer);
    const { send,state } = useContractFunction(ALcontract, '');

    const FTUpdate = ()=>{
        // 更新机票信息
        const arrtime = new Date(_actualArrivalTime.current.value).getTime()/1000
    ALcontract.functions.update(flightNumber.current.value,arrtime).then(()=>{
    })
    }
    useEffect(() => {
        if(state.errorMessage){
            toast.error(state.errorMessage);
        }
    }, [state])

return(
<div className="">
      {/* 发布航班延误信息 */}
      <div className="bg-gray-800 p-8 rounded-3xl filter drop-shadow-xl">
      <h1 className="text-center font-bold text-xl">更新机票详情</h1>
      <div className="mt-5">
          <label htmlFor="flight_id" className="text-xl mr-5 inline-block text-right w-1/4">航班编号</label>
          <input ref={flightNumber} name="flight_id" type="text" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>      
          </div>
      <div className="mt-5">
          <label htmlFor="reason" className="text-xl mr-5 inline-block text-right w-1/4">实际到达时间</label>
          <input ref={_actualArrivalTime} name="flight_id" type="datetime-local" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
      </div>
      <div className="text-center mt-10">
          <button onClick={FTUpdate} className="py-2 px-3 bg-indigo-800 rounded-md text-white text-lg hover:bg-indigo-900">更新</button>
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
export default Update;
