import { useEthers } from "@usedapp/core";

const WalletConnectButton = () => {
    const { activateBrowserWallet, account, deactivate } = useEthers();
    

    return account ? (
        <div className="flex bg-gray-800 p-3 rounded-xl">
            <button onClick={deactivate} className="bg-gray-600 bg-gradient-to-r hover:from-gray-400 font-bold hover:to-gray-400 p-4 rounded-xl mr-3">断开钱包</button>
            <h1 className="p-4 bg-gradient-to-r from-pink-700 to-purple-700 text-white text-lg rounded-xl">欢迎(*^▽^*), {account}</h1>
        </div>
    ) : (
        <button className="p-4 bg-gradient-to-r from-pink-700 to-purple-700 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-pink-700" onClick={() => {activateBrowserWallet()}}>连接钱包</button>
    )
}

export default WalletConnectButton;