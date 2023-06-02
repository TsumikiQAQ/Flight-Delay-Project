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
        <div>
        <div className="container position-relative wow fadeInUp" data-wow-delay="0.1s" style={{"marginTop" : "1rem"}}>
        <div className="row justify-content-center">
            <div className="col-lg-8">
                <div className="bg-light text-center p-5">
                    <h1 className="mb-4">查询机票信息</h1>
                        <div className="row g-3">
                            <div className="col-12 col-sm-6">
                                <input ref={departplace} type="text" className="form-control border-0" placeholder="出发地" style={{height: "55px"}}/>
                            </div>
                            <div className="col-12 col-sm-6">
                                <input ref={arriveplace} type="text" className="form-control border-0" placeholder="目的地" style={{height: "55px"}}/>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="date">
                                    <input ref={departtime } type="date" placeholder="预计出发时间"  style={{height: "55px"}}/>
                                </div>
                            </div>
                            <div className="col-12">
                                <button onClick={selectFlight} className="btn btn-primary w-100 py-3" type="submit">查询</button>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>  
</div>
    )
}

export default  SelectFlight