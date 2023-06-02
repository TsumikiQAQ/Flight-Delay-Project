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
  
      <div>
      <div className="container-xxl py-5">
      <div className="container">
          <div className="row g-4">
              <div className="col-lg-4 col-md-6 service-item-top wow fadeInUp" data-wow-delay="0.1s">
                  <div className="overflow-hidden">
                      <img className="img-fluid w-100 h-100" src="img/clound1.jpg" alt=""/>
                  </div>
                  <div className="d-flex align-items-center justify-content-between bg-light p-4">
                      
                      <h5 className="text-truncate me-3 mb-0">查询已发布航班</h5>
                      <a className="btn btn-square btn-outline-primary border-2 border-white flex-shrink-0" onClick={(e)=>{
                        e.preventDefault();
                        handleButtonClick(0)
                    }
                        }  
                        ><i className="fa fa-arrow-right"></i></a>
                  </div>
              </div>
              <div className="col-lg-4 col-md-6 service-item-top wow fadeInUp" data-wow-delay="0.3s">
                  <div className="overflow-hidden">
                      <img className="img-fluid w-100 h-100" src="img/clound2.jpg" alt=""/>
                  </div>
                  <div className="d-flex align-items-center justify-content-between bg-light p-4">
                      <h5 className="text-truncate me-3 mb-0">发布航班信息</h5>
                      <a className="btn btn-square btn-outline-primary border-2 border-white flex-shrink-0" onClick={(e)=>{
                        e.preventDefault();
                        handleButtonClick(1)
                    }
                        } href=""><i className="fa fa-arrow-right"></i></a>
                  </div>
              </div>
              <div className="col-lg-4 col-md-6 service-item-top wow fadeInUp" data-wow-delay="0.5s">
                  <div className="overflow-hidden">
                      <img className="img-fluid w-100 h-100" src="img/clound3.jpg" alt=""/>
                  </div>
                  <div className="d-flex align-items-center justify-content-between bg-light p-4">
                      <h5 className="text-truncate me-3 mb-0">更新航班信息</h5>
                      <a className="btn btn-square btn-outline-primary border-2 border-white flex-shrink-0"onClick={(e)=>{
                        e.preventDefault();
                        handleButtonClick(2)
                    }
                        } href=""><i className="fa fa-arrow-right"></i></a>
                  </div>
              </div>
          </div>
      </div>
  </div>  
       
        {choose === 0 && <SelectPage />}  
        {choose === 1 && <FlightCompanyPage contractAddress={contractAddress} contractInterface ={contractInterface}/>}  
        {choose === 2 && <UpdatePage contractAddress={contractAddress} contractInterface ={contractInterface}/>}  
      </div>   
  );  
};
export default SelectFlight;

