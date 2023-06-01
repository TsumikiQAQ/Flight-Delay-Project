import { useRef, useState } from "react";  
import FlightCompanyPage from "./FlightSelectPage/FlightCompanyPage";  
import SelectPage from "./FlightSelectPage/SelectPage";  
import UpdatePage from "./FlightSelectPage/UpdatePage";


const SelectFlight = ({contractAddress,contractInterface}) => {  
  const [choose, setActiveButton] = useState(null);  
  const handleButtonClick = (choose) => {  
    setActiveButton(choose);  
  };
 

  return (  
    <>  
      <div>  
        <div>  
          <button onClick={() => handleButtonClick(0)} className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-xl mr-3">查询当前航班</button>  
          <button onClick={() => handleButtonClick(1)} className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-xl mr-3">发布航班信息</button>  
          <button onClick={() => handleButtonClick(2)} className="bg-indigo-800 hover:bg-indigo-900 p-3 rounded-xl mr-3">更新航班信息</button>  
        </div>  
        {choose === 0 && <SelectPage />}  
        {choose === 1 && <FlightCompanyPage contractAddress={contractAddress} contractInterface ={contractInterface}/>}  
        {choose === 2 && <UpdatePage contractAddress={contractAddress} contractInterface ={contractInterface}/>}  
      </div>  
    </>  
  );  
};
export default SelectFlight;

