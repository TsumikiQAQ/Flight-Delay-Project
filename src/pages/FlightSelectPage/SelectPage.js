import { useEthers } from '@usedapp/core';
import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { useContractFunction } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import { utils } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Select = ()=>{
    const { account } = useEthers();
    
    let dataarr;
    axios.post('/selectFlight', {
      account
    })
    .then(response => {
      // 处理响应数据
     dataarr =  response.data;
    })
    .catch(error => {
      // 处理错误
      console.error(error);
    });
  

return(
<div>
    <div>

        </div>
        </div>
)
}
export default Select;
