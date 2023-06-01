import "./App.css";
import "./index.css";
import { Web3Provider } from "@ethersproject/providers";
import AdminPage from "./pages/AdminPage";
import { utils } from "ethers";
import ALContractABI from "./artifacts/contracts/Airline.sol/Airline.json";
import WalletConnectButton from "./components/WalletConnectButton";
import { useEthers } from "@usedapp/core";
import UserPage from "./pages/UserPage";
import SelectFlight from "./pages/SelectFlightPage";
import { Contract } from "@ethersproject/contracts";
import { useState,useEffect } from 'react';

const App = () => {
    // require('dotenv').config();
    const { account } = useEthers();
    // 设置合约拥有者地址
    const ownerAddress = "0xB970deaB39cfE184385c75f4B7a666BB632e8F69";

    // 通过航空公司合约地址、接口创建合约实例对象
    const contractInterface = new utils.Interface(ALContractABI.abi);
    // console.log(process.env.REACT_APP_ALAddr);
    const contractAddress = "0x184A7055491bCEDA8c922d722E341B41689B3015";
    const provider = new Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new Contract(contractAddress, contractInterface, signer);

    const [boolair,setBoolair] = useState(false);
    // 调用航空公司合约内的airlineAuthority方法判断账户是否是航空公司dao成员
     useEffect(() => {
      if (account) {
          contract.functions.getAirlineAuthority(account).then(([bool]) => {
              setBoolair(bool);
          });
      } else {
          setBoolair(false);
      }
   }, [account]);
    return (
     // 获取账户地址
 <div className="text-white">
 <div className="flex justify-end mt-5 mx-10">
 <WalletConnectButton/>
 </div>
            {/* 账户权限获取：
 地址为ownerAddress进入合约管理界面
 地址为garudaIndonesiaAddress进入航班发布界面
 两个都不是进入购票界面 */}
            {account === ownerAddress && <AdminPage contract={contract} />}
            {boolair && <SelectFlight contractAddress={contractAddress} contractInterface={contractInterface} />}
            {account !== ownerAddress && !boolair && account && <UserPage contractAddress={contractAddress} contractInterface={contractInterface} />}
            {!account && !boolair && (
                <div className="flex justify-center">
                    <div className="bg-gray-50 p-5 rounded-3xl filter drop-shadow-xl text-center m-20 w-max">
                        <h1 className="p-2 text-center font-bold text-3xl blue-text">请先连接钱包</h1>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
