import { useRef } from "react"

const SelectFlight = ()=>{
    // 购买保险：选择保险类型、输入身份证号
    const departplace = useRef()
    const arriveplace = useRef()
    const departtime = useRef()


    return (
        <div className="grid grid-cols-2 gap-4 mt-5 mx-10">
        <div className="bg-gray-800 p-8 rounded-3xl filter drop-shadow-xl">
            <h1 className="text-center font-bold text-xl">购买保险</h1>
            <div className="mt-5">
                <label htmlFor="flightNumber" className="text-xl mr-5 inline-block text-right w-1/4">身份证</label>
                <input ref={departplace} name="flight_id" type="text" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3"/>
            </div>
            <div className="mt-5">
                <label htmlFor="flight_id" className="text-xl mr-5 inline-block text-right w-1/4">保险类型</label>
                <input ref={arriveplace} name="flight_id" type="text" className="text-black border w-1/2 rounded-xl focus:outline-none focus:border-indigo-500 mt-5 py-1 px-3" required/>
            </div>
             <div className="text-center mt-10">
                <button onClick={''} className="py-2 px-3 bg-indigo-800 rounded-md text-white text-lg hover:bg-indigo-900">订票</button>
            </div>
            </div>
            
            
        </div>
    )
}

export default  SelectFlight