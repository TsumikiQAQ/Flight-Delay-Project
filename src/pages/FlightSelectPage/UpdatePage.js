import { useRef, useState, useEffect } from 'react';
import { useContractFunction } from '@usedapp/core';
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from '@ethersproject/contracts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
    // /**
    //  * @dev 由航空公司上传航班实际到达时间
    //  * @param _actualArrivalTime 实际到达时间
    //  */
    // 航班号对于机票合约地址
    // mapping(string => address) public flightNumberToAddress;

const Update = ({contractAddress,contractInterface})=>{
    
    const flightNumber = useRef()
    const _actualArrivalTime = useRef();
      // 创建合约对象

     const provider = new Web3Provider(window.ethereum)
     const signer = provider.getSigner()
     const contract = new Contract(contractAddress, contractInterface,signer);
    
    const { send,state } = useContractFunction(contract, '');

    const FTUpdate = ()=>{
        // 更新机票信息
        const arrtime = new Date(_actualArrivalTime.current.value).getTime()/1000
    contract.functions.update(flightNumber.current.value,arrtime).then(()=>{
    })
    }
    useEffect(() => {
        if(state.errorMessage){
            toast.error(state.errorMessage);
        }
    }, [state])

return(
    
<div className="">
          {/* 更新航班延误信息 */}
<div className="container position-relative wow fadeInUp" data-wow-delay="0.1s" style={{"marginTop" : "1rem"}}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="bg-light text-center p-5">
                        <h1 className="mb-4">更新机票详情</h1>
                            <div className="row g-3">
                                <div className="col-12 col-sm-6">
                                    <input ref={flightNumber} type="text" className="form-control border-0" placeholder="航班编号" style={{height: "55px"}}/>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <div className="date">
                                        <input ref={_actualArrivalTime} type="datetime-local" placeholder="实际到达时间"  style={{height: "55px"}}/>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button  onClick={FTUpdate} className="btn btn-primary w-100 py-3" type="submit">查询</button>
                                </div>
                            </div>
                    </div>
                </div>
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
