// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IAirline {
    
    enum PlanState {
        None, // 未结束
        OnTimeArrival, // 准时到达
        Canceled, // 航班取消
        LateArrival2, // 延误2小时以内
        LateArrival4, // 延误4小时以内
        LateArrival // 延误4小时以上
    }
    /**
     * @dev 添加航空公司
     * @param _airlineName 航空公司名称
     * @param _airlineCompany 航空公司地址
     * @param _delayRate 延误率
     * @param _cancelRate 取消率
     */
    function addAirlines(string memory _airlineName, address _airlineCompany, uint128 _delayRate, uint128 _cancelRate) external;

    /**
     * @dev 移除航空公司权限
     * @param _airlineCompany 航空公司地址
     */
    function removeAirlines(address _airlineCompany) external;

    /**
     * @dev 修改航空公司自己的名字
     * @param _name 航空公司名称
     */
    function setAirlineName(string memory _name) external;

    /**
     * @dev 更新航空公司自己的延误率
     * @param _delayRate 延误率
     */
    function setDelayRate(uint128 _delayRate) external;

    /**
     * @dev 更新航空公司自己的取消率
     * @param _cancelRate 取消率
     */
    function setCancelRate(uint128 _cancelRate) external;

    /**
     * @dev 发布机票合约(msg.value必须大于_totalSeat * _ticketPrice / 2)
     * @param _totalSeat 总座位数
     * @param _departureTime 出发时间
     * @param _scheduledArrivalTime 预计到达时间
     * @param _ticketPrice 机票价格
     * @param _departurePoint 出发地点
     * @param _destinationPoint 目的地点
     * @param _flightNumber 航班号
     */
    function releaseFlight(uint24 _totalSeat, uint32 _departureTime, uint32 _scheduledArrivalTime, uint128 _ticketPrice, string memory _departurePoint, string memory _destinationPoint, uint256 _flightNumber) external payable;

    /**
     * @dev 购买机票逻辑 (msg.value必须等于机票价格!!!)
     * @param _flightNumber 航班号
     * @param _idCard 身份证号
     * @param _tokenId 座位号
     */
    function buyTicket(uint256 _flightNumber, string memory _idCard, uint24 _tokenId) external payable;

    /**
     * @dev 退票逻辑
     * @param _flightNumber 航班号
     * @param _tokenId 座位号
     */
    function refundTicket(uint256 _flightNumber, uint24 _tokenId) external;

    /**
     * @dev 购买保险逻辑 (msg.value必须等于保金价格!!!)
     * @param _flightNumber 航班号
     * @param choose 保险选择（0：延误险，1：取消险，2：延误险+取消险）
     * @param _idCard 身份证号
     */
    function buyInsurance(uint256 _flightNumber, uint8 choose, string memory _idCard) external payable;

    /**
     * @dev 由航空公司上传航班实际到达时间
     * @param _flightNumber 航班号
     * @param _actualArrivalTime 实际到达时间
     */
    function update(uint256 _flightNumber, uint32 _actualArrivalTime) external;

    /**
     * @dev 进行资金结算
     * @param _flightNumber 航班号
     */
    function settlement(uint256 _flightNumber) external;

    /**
     * @dev 返回合约余额。
     * @return 合约余额。
     */
    function getContractBalance() external view returns (uint256);

    /**
     * @dev 查看航空公司地址记录的延误率。
     * @param _address 航空公司地址。
     * @return 延误率。
     */
    function getDelayRate(address _address) external view returns (uint256);

    /**
     * @dev 查看航空公司地址记录的取消率。
     * @param _address 航空公司地址。
     * @return 取消率。
     */
    function getCancelRate(address _address) external view returns (uint256);

    /**
     * @dev 输入航班号和身份证返回座位号。
     * @param _flightNumber 航班号。
     * @param _idCard 身份证号。
     * @return 座位号。
     */
    function getIdCardToSeat(uint256 _flightNumber, string memory _idCard) external view returns (uint256);

    /**
     * @dev 返回航班机票价格。
     * @param _flightNumber 航班号。
     * @return 机票价格。
     */
    function getTicketPrice(uint256 _flightNumber) external view returns (uint256);

    /**
     * @dev 返回航班状态。
     * @param _flightNumber 航班号。
     * @return 航班状态。
     */
    function getPlaState(uint256 _flightNumber) external view returns (PlanState);

    /**
     * @dev 返回航班在合约中的余额。
     * @param _flightNumber 航班号。
     * @return 航班余额。
     */
    function getFlightBalance(uint256 _flightNumber) external view returns (uint256);

    /**
     * @dev 获取航班对应的航空公司名称。
     * @param _flightNumber 航班号。
     * @return 航空公司名称。
     */
    function getFlightToAirline(uint256 _flightNumber) external view returns (string memory);

    /**
     * @dev 查询航班的延误险保金。
     * @param _flightNumber 航班号。
     * @return 延误险保金。
     */
    function getDelayInsurancePrice(uint256 _flightNumber) external view returns (uint128);

    /**
     * @dev 查询航班的取消险保金。
     * @param _flightNumber 航班号。
     * @return 取消险保金。
     */
    function getCancelInsurancePrice(uint256 _flightNumber) external view returns (uint128);
    
    /**
     * @dev 查看航班的预定起飞时间和到达时间。
     * @param _flightNumber 航班号。
     * @return takeOffTime 预定起飞时间  arriveTime 到达时间。
     */
    function getFlightTime(uint256 _flightNumber) external view returns (uint256 takeOffTime, uint256 arriveTime);

    /**
     * @dev 查看航班的出发地点和目的地点。
     * @param _flightNumber 航班号。
     * @return from 出发地点  to 目的地点
     */
    function getPoint(uint256 _flightNumber) external view returns (string memory from, string memory to);

    /**
     * @dev 查看航空公司的权限。
     * @param _account 航空公司地址。
     * @return 是否有权限。
     */
    function getAirlineAuthority(address _account) external view returns(bool);

    /**
     * @dev 根据航班号查询空余座位号。
     * @param _flightNumber 航班号。
     * @return 空余座位号数组。
     */
    function getEmptySeat(uint256 _flightNumber) external view returns (uint24[] memory);
}
