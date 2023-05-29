import './App.css';
import './index.css';
import { Web3Provider } from "@ethersproject/providers";
import AdminPage from './pages/AdminPage';
import { utils } from 'ethers';
import ALContractABI from './artifacts/contracts/Airline.sol/Airline.json';
import WalletConnectButton from './components/WalletConnectButton';
import { addressEqual, useEthers } from '@usedapp/core';
import UserPage from './pages/UserPage';
import SelectFlight from './pages/SelectFlightPage';
import { useContractFunction } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';

const App = () => {
 // require('dotenv').config();
 const { account } = useEthers();
 // 设置合约拥有者地址
 const ownerAddress = '0x0dae840A4bf822897957f9BcDf767c96164BEf84';
 // 航空公司地址用于测试 
 const FlightCompanyaddress = '0x0dae840A4bf822897957f9BcDf767c96164BEf84';

 // 通过航空公司合约地址、接口创建合约实例对象
 const contractInterface = new utils.Interface(ALContractABI.abi);
 // console.log(process.env.REACT_APP_ALAddr);
 const contractAddress = '0x620E06BCD8437dee974f1d8e4cE33AeC73A8563f';
 const provider = new Web3Provider(window.ethereum);
 const { library } = useWeb3React();
 console.log(library);
 const signer = provider.getSigner();
 console.log(signer);
 const contract = new Contract(contractAddress, contractInterface,signer);
 console.log(contract);
 // 调用航空公司合约内的airlineAuthority方法判断账户是否是航空公司dao成员
 const {boolair}= contract.functions.getAirlineAuthority(account).then((boolair) =>{
 return boolair
 }).catch((error) => {
 return error.Message
 })

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
 {account === ownerAddress && <AdminPage contract={contract}/>}
 {/* {account === FlightCompanyaddress&& <SelectFlight/>} */}
 {boolair && <SelectFlight contract={contract}/>}
 {account !== ownerAddress && !boolair && account && <UserPage contract={contract}/>}
 {!account && (
 <div className="flex justify-center">
 <div className="bg-gray-800 p-8 rounded-3xl filter drop-shadow-xl text-center m-20 w-max">
 <h1 className="text-center font-bold text-xl">连接你的钱包继续使用此APP</h1>
 </div>
 </div>
 )}
 </div>
 );
 }
export default App;
