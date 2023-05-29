// import { useContractFunction } from "@usedapp/core";
// import { utils } from 'ethers';
// import { useEffect, useRef } from 'react';
// import { Contract } from "@ethersproject/contracts";
// import ALContractABI from './src/artifacts/contracts/Airline.sol/Airline.json';
// import FTContractABI from './src/artifacts/contracts/FlightTicket.sol/FlightTicket.json';
// import { Interface } from "@ethersproject/abi";
// import { toast, ToastContainer } from "react-toastify";

import { useRef, useState } from "react";  
import FlightTicketBuy from "./UserSelectPage/FlightTicketBuy";  
import ReturnTicket from "./UserSelectPage/ReturnTicket";  
import InsuranceBuy from "./UserSelectPage/InsuranceBuy";  
import SelectFlightPage from "./UserSelectPage/SelectFlightPage";  

const UserPage = () => {
// 流程：输入出发地、目的地、出发时间查询机票->购买机票:输入身份证、座位号->购买保险：选择保险类型、输入身份证号->查看自己购买的机票和保险（可退票）
  const [choose, setActiveButton] = useState(null);  
  const handleButtonClick = (choose) => {  
    setActiveButton(choose);  
  };

  return (  
    <>  
      <div>  
        <div>  
          <button onClick={() => handleButtonClick(0)} className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-xl mr-3">查询航班信息</button>  
          <button onClick={() => handleButtonClick(1)} className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-xl mr-3">购买机票</button>  
          <button onClick={() => handleButtonClick(2)} className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-xl mr-3">购买保险</button>  
          <button onClick={() => handleButtonClick(3)} className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-xl mr-3">查看交易列表</button>  
        </div>  
        {choose === 0 && <SelectFlightPage/>}  
        {choose === 1 && <FlightTicketBuy/>}  
        {choose === 2 && <InsuranceBuy/>} 
        {choose === 3 && <ReturnTicket/>}  
      </div>  
    </>  
  );  
};
    // const [choose, setActiveButton] = useState(null);  
    // const handleButtonClick = (choose) => {  
    //   setActiveButton(choose);  
    // };
    // const flightID = useRef();
    // const premiumPaid = useRef();
    // const contractInterface = new Interface(FTContractABI.abi);
    // const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    // const contract = new Contract(contractAddress, contractInterface);

    // const { state, send } = useContractFunction(contract, 'orderInsurance');

    // const orderInsurance = () => {
    //     if(!flightID.current.value || !premiumPaid.current.value){
    //         toast.error("Please input the empty field!");
    //     } else {
    //         send(flightID.current.value, {value: utils.parseEther(premiumPaid.current.value)})
    //     }
    // }

    // useEffect(() => {
    //     if(state.errorMessage){
    //         toast.error(state.errorMessage);
    //     }
    // }, [state])

    // return (
        // 购买机票和保险
        // 流程：输入出发地、目的地、出发时间查询机票->购买机票:输入身份证、座位号->购买保险：选择保险类型、输入身份证号->查看自己购买的机票和保险（可退票）
        // <div className="grid grid-cols-7 gap-4 mt-5 mx-10">
        //     <div className="bg-gray-800 p-8 rounded-3xl filter drop-shadow-xl col-span-3">
        //         <h1 className="text-center font-bold text-xl">机票查询</h1>
        //         <div className="mt-5">
        //             <label htmlFor="flight_id" className="text-xl mr-5 inline-block text-right w-1/5">出发地</label>
        //             <input ref={flightID} name="flight_id" type="text" className="text-black border w-3/4 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
        //         </div>
        //         <div className="mt-5">
        //             <label htmlFor="flight_id" className="text-xl mr-5 inline-block text-right w-1/5">目的地</label>
        //             <input ref={premiumPaid} name="flight_id" placeholder="输入在0.01 - 0.06ETH之间的值" type="number" min="0.01" max="0.06" step="0.01" className="text-black border w-3/4 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
        //         </div>
        //         <div className="mt-5">
        //             <label htmlFor="flight_date" className="text-xl mr-5 inline-block text-right w-1/5">目的地</label>
        //             <input name="flight_date" type="date" className="text-black border w-3/4 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
        //         </div>
        //         <div className="text-center mt-10">
        //             <button onClick={orderInsurance} className="py-2 px-8 bg-indigo-800 rounded-md text-white text-lg hover:bg-indigo-900">查询</button>
        //         </div>
        //     </div>
        //     <div className="bg-gray-800 p-8 rounded-3xl filter drop-shadow-xl col-span-4">
        //         <h1 className="text-center font-bold text-xl">注意事项</h1>
        //         <ul className="list-inside list-decimal mt-5 p-5 bg-gray-900 rounded-xl">
                
        //         </ul>
        //     </div>

//             <ToastContainer
//                 position="bottom-right"
//                 autoClose={5000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 />
//         </div>
//     )
// }

export default UserPage;