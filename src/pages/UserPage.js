import { useRef, useState } from "react";  
import FlightTicketBuy from "./UserSelectPage/FlightTicketBuy";  
import ReturnTicket from "./UserSelectPage/ReturnTicket";  
import InsuranceBuy from "./UserSelectPage/InsuranceBuy";  
import SelectFlightPage from "./UserSelectPage/SelectFlightPage";  
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from '@ethersproject/contracts';

const UserPage = ({contractAddress,contractInterface}) => {
// 流程：输入出发地、目的地、出发时间查询机票->购买机票:输入身份证、座位号->购买保险：选择保险类型、输入身份证号->查看自己购买的机票和保险（可退票）
  const [choose, setActiveButton] = useState(null);  
  const handleButtonClick = (choose) => {  
    setActiveButton(choose);  
  };
  const provider = new Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new Contract(contractAddress, contractInterface,signer);

  return (  
    <>  
      <div>  
        <div>  
          <button onClick={() => handleButtonClick(0)} className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-xl mr-3">查询航班信息</button>  
          <button onClick={() => handleButtonClick(1)} className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-xl mr-3">购买机票</button>  
          <button onClick={() => handleButtonClick(2)} className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-xl mr-3">购买保险</button>  
          <button onClick={() => handleButtonClick(3)} className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-xl mr-3">查看交易列表</button>  
        </div>  
        {choose === 0 && <SelectFlightPage contract={contract}/>}  
        {choose === 1 && <FlightTicketBuy contract={contract}/>}  
        {choose === 2 && <InsuranceBuy contract={contract}/>} 
        {choose === 3 && <ReturnTicket contract={contract}/>}  
      </div>  
    </>  
  );  
};

export default UserPage;