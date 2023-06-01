import { useRef } from "react";
import axios from 'axios';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from "@ethersproject/providers";


const SelectFlight = (ALcontract)=>{
    // 输入出发地、目的地、出发时间查询机票->
    const departplace = useRef()
    const arriveplace = useRef()
    const departtime = useRef()
    async function selectFlight(){
    const departPlace = departplace.current.value;
    const arrivePlace = arriveplace.current.value;
    const departTime = departtime.current.value;
    let dataarr;
    await axios.post('/selectFlight', {
      departPlace,
      arrivePlace,
      departTime
    })
    .then(response => {
      // 处理响应数据
     dataarr =  response.data;
    })
    .catch(error => {
      // 处理错误
      console.error(error);
    });
}
   

    return (
        
        <div className="grid grid-cols-2 gap-4 mt-5 mx-10">
            <div className="bg-gray-800 p-8 rounded-3xl filter drop-shadow-xl">
                <h1 className="text-center font-bold text-xl">查询机票</h1>
                <div className="mt-5">
                    <label htmlFor="flightNumber" className="text-xl mr-5 inline-block text-right w-1/4">出发地</label>
                    <input ref={departplace} name="flight_id" type="text" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
                </div>
                <div className="mt-5">
                    <label htmlFor="flight_id" className="text-xl mr-5 inline-block text-right w-1/4">目的地</label>
                    <input ref={arriveplace} name="flight_id" type="text" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3" required/>
                </div>
                    <label htmlFor="arrive" className="text-xl mr-5 inline-block text-right w-1/4">出发时间</label>
                    <input ref={departtime } name="arrive" type="datetime-local" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
                    <div className="text-center mt-10">
                    <button onClick={selectFlight} className="py-2 px-3 bg-indigo-800 rounded-md text-white text-lg hover:bg-indigo-900">查询</button>
                </div>
                </div>
                
                
            </div>
    )
}

export default  SelectFlight