import { useContractFunction } from "@usedapp/core";
import { utils } from 'ethers';
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = ({ contract }) => {
    //  /**
    //  * @dev 添加航空公司
    //  * @param _airlineCompany 航空公司的地址
    //  */
    //  function addAirlines(address _airlineCompany,string memory _airlineName,uint8 _delayRates,uint8 _cancelRates) external;

    //  /**
    //   * @dev 移除航空公司
    //   * @param _airlineCompany 航空公司的地址
    //   */
    //  function removeAirlines(address _airlineCompany) external;

    console.log(contract);
    const delayRates = useRef();
    const cancelRates = useRef();
    const airlineAddress = useRef();
    const removeAirlineAddress = useRef();
    const airlineName = useRef();
    const removeairlineName = useRef();

    const [functionName, setFunctionName] = useState('');
    const { state, send } = useContractFunction(contract, functionName);

    const addAirlines = () => {
        const address = airlineAddress.current.value;
        console.log(address);
        if (!utils.isAddress(address)) {
            console.log(address);
            toast.error("请输入一个正确的地址值!");
        } else if (!airlineName.current.value) {
            toast.error("航空公司名称不能为空!")
        } else if (!delayRates.current.value || delayRates.current.value < 0 || delayRates.current.value >= 100) {
            toast.error("延误率不能为空且在0-100之间!")
        } else if (!cancelRates.current.value || cancelRates.current.value < 0 || cancelRates.current.value >= 100) {
            toast.error("取消率不能为空且在0-100之间!")
        } else {
            setFunctionName('addAirlines')
        }
    }

    const removeAirlines = () => {
        if (!utils.isAddress(removeAirlineAddress.current.value)) {
            toast.error("请输入一个正确的地址值!");
        } else if (!removeairlineName.current.value) {
            toast.error("航空公司名称不能为空!")
        } else {
            setFunctionName('removeAirlines')
        }
    }
    const getContractBlance = () => {
        contract.functions.getContractBalance().then((blance) => console.log(blance))
    }


    useEffect(() => {
        if (functionName === 'addAirlines') {
            console.log(airlineAddress.current.value, airlineName.current.value, delayRates.current.value * 100, cancelRates.current.value * 100);
            send(airlineName.current.value, airlineAddress.current.value, delayRates.current.value * 100, cancelRates.current.value * 100);
            setFunctionName('');
        } else if (functionName === 'removeAirlines') {
            send(removeAirlineAddress.current.value);
            setFunctionName('');
        }
    }, [functionName, send]
    )

    useEffect(() => {
        if (state.errorMessage) {
            toast.error(state.errorMessage);
        }
    }, [state])
    return (
        <div className="grid grid-cols-1  mt-5 mx-10 ">
            <div className="mt-10 text-center">
                <div className="flex bg-blue-100 p-2 rounded-2xl" style={{float: "right", width: "114px", justifyContent: "flex-end", marginTop: "-50px" }}>
                    <button onClick={getContractBlance} style={{ float: "right" ,width: "96px"}} className="p-4 bg-gradient-to-r from-red-700 to-red-700 text-white text-lg font-bold rounded-xl hover:from-purple-400 hover:to-pink-400" >查&nbsp;&nbsp;询<br />余&nbsp;&nbsp;额</button>
                </div>
            </div>
            {/* 注册航空公司，将航空公司地址添加到航空公司dao */}
            {/* <CenteredDiv> */}
            <div className="bg-blue-100 p-8 rounded-3xl filter drop-shadow-xl col-span-5" style={{ width: '900px', margin: '0 auto' }}>
                <h1 className="text-center font-bold text-3xl blue-text">注册航空公司</h1>
                {/* 输入航空公司名字 */}
                <div className="mt-5">
                    <label htmlFor="name" className="text-xl mr-5 inline-block text-right w-1/5 blue-text">航空公司名称</label>
                    <input ref={airlineName} name="name" type="text" className="text-black border w-2/3 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3" placeholder="请输入您的航空公司名称" />
                </div>
                {/* 输入航空公司地址 */}
                <div className="mt-5">
                    <label htmlFor="address" className="text-xl mr-5 inline-block text-right w-1/5 blue-text">航空公司地址</label>
                    <input ref={airlineAddress} name="address" type="text" className="text-black border w-2/3 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3" placeholder="请输入您的航空公司地址" />
                </div>
                <div className="mt-5">
                    <label htmlFor="delayRates" className="text-xl mr-5 inline-block text-right w-1/5 blue-text">航空公司延误率</label>
                    <input ref={delayRates} name="delayRates" type="number" className="text-black border w-2/3 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3" placeholder="请输入您的航空公司延误率" />
                </div>
                <div className="mt-5">
                    <label htmlFor="cancelRates" className="text-xl mr-5 inline-block text-right w-1/5 blue-text">航空公司取消率</label>
                    <input ref={cancelRates} name="cancelRates" type="number" className="text-black border w-2/3 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3" placeholder="请输入您的航空公司取消率" />
                </div>
                {/* 将航空公司添加进dao名单 */}
                <div className="mt-10 text-center">
                    <button onClick={addAirlines} className="font-bold py-2 px-5 bg-red-700 rounded-md text-white text-lg hover:bg-red-400">注&nbsp;册</button>
                </div>
            </div>
            {/* </CenteredDiv> */}

            {/*注销航空公司，将航空公司移除dao组织*/}
            {/* <CenteredDiv> */}
            <div className="bg-blue-100 p-8 rounded-3xl filter drop-shadow-xl col-span-5" style={{ width: '900px', margin: '0 auto' }}>
                <h1 className="blue-text text-center font-bold text-3xl">注销航空公司</h1>
                {/* 输入航空公司名字 */}
                <div className="mt-5">
                    <label htmlFor="name" className="blue-text text-xl mr-5 inline-block text-right w-1/5">航空公司名字</label>
                    <input ref={removeairlineName} name="name" type="text" className="text-black border w-2/3 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3" placeholder="请输入您要注销的航空公司名称" />
                </div>
                {/* 输入航空公司地址 */}
                <div className="mt-5">
                    <label htmlFor="address" className="blue-text text-xl mr-5 inline-block text-right w-1/5">航空公司地址</label>
                    <input ref={removeAirlineAddress} name="address" type="text" className="text-black border w-2/3 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3" placeholder="请输入您要注销的航空公司地址" />
                </div>
                {/* 将航空公司添加进dao名单 */}
                <div className="mt-10 text-center">
                    <button onClick={removeAirlines} className="font-bold py-2 px-5 bg-red-700 rounded-md text-white text-lg hover:bg-red-400">注&nbsp;销</button>
                </div>
            </div>
            {/* </CenteredDiv> */}

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
    );
}

export default AdminPage;