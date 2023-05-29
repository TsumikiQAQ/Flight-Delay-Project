// SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;

import "./String.sol";
import "./Address.sol";
import "./IAirline.sol";

// 航空公司合约
contract Airline is IAirline {
    using Address for address;
    using String for bytes32;
    using String for string;
    // 航空公司DAO管理者
    address administrator;
    // 保存航空公司的延误率，取消率，航空公司名字；
    mapping(address => uint128) delayRates; // 延误率值为百分率 * 10000
    mapping(address => uint128) cancelRates; // 取消率值为百分率 * 10000
    mapping(address => bytes32) airlineName;

    // 记录航空公司的发布机票和发布保险的权限
    mapping(address => bool) airlineAuthority;

    // 记录航班在合约中的余额(在用户支付时，钱装入当前合约，需要记录航班在合约中的资金)
    mapping(uint256 => uint256) balance;

    // 航班号对应机票信息
    mapping(uint256 => FlightData) flightNumberToFlight;

    // 根据出发地点，目的地，出发时间，查询航班编号
    //mapping(bytes32 => mapping(bytes32 => mapping(uint32 => uint256))) findFlight;

    // 航班信息(时间使用UNIX时间)
    struct FlightData {
        PlanState planState; // 航班状态
        bool End; // 航班是否结算
        uint24 totalSeat; // 座位数量
        uint32 departureTime; // 预定起飞时间
        uint32 scheduledArrivalTime; // 预定到达时间
        uint32 actualArrivalTime; //实际到达时间
        uint128 ticketPrice; // 机票价
        uint128 delayInsurancePrice; // 延误险保金
        uint128 cancelInsurancePrice; // 取消险保金
        bytes32 airline; //航空公司名字
        bytes32 departurePoint; //出发地点
        bytes32 destinationPoint; //目的地
        uint256 flightNumber; //航班号
        // 座位号对应身份证号
        mapping(uint24 => bytes32) seatToIdCard;
        // 身份证号对应座位号
        mapping(bytes32 => uint24) idCardToSeat;
        // 身份证号对应账户地址
        mapping(bytes32 => address) idCardToAddress;
        // 记录是否购买延误险
        mapping(bytes32 => bool) idCardToDelay;
        // 记录是否购买取消险
        mapping(bytes32 => bool) idCardToCancel;
    }



    // 发布航班事件
    event TicketIssued(address indexed airlineCompany, uint256 indexed flightNumber);
    // 参保，退保事件
    event InsurancePurchased(string indexed customer, uint256 indexed flightNumber, string insuranceName);
    event InsuranceRefund(string indexed customer, uint256 indexed flightNumber, string insuranceName);

    // 买票，退票事件
    event TicketPurchased(string indexed customer, uint256 indexed flightNumber, uint24 tokenId);
    event TicketRefund(string indexed customer, uint256 indexed flightNumber, uint24 tokenId);

    // 限制航空公司权限
    modifier onlyAirline() {
        require(airlineAuthority[msg.sender] == true,"You don't have airline status.");
        _;
    }

    // 限制平台管理员权限
    modifier onlyAdministrator() {
        require(msg.sender == administrator,"You are not an airline DAO administrator!");
        _;
    }

    // 购买保险的前提是已经购买机票
    modifier onlyTicketOwner(uint256 _flightNumber, string memory _idCard) {
        require(msg.sender ==flightNumberToFlight[_flightNumber].idCardToAddress[_idCard.stringToBytes32()],"The ID card is not yours.");
        require(flightNumberToFlight[_flightNumber].idCardToSeat[_idCard.stringToBytes32()] != 0,"You don't have a ticket.");
        _;
    }

    // 限制航空公司身份调用
    modifier onlyAirlineOwner(uint256 _flightNumber) {
        require(airlineName[msg.sender] ==flightNumberToFlight[_flightNumber].airline,"You're not a flight owner.");
        _;
    }

    // 限制用户不能为合约地址
    modifier notContact() {
        require(msg.sender.isContract() != true,"The account address cannot be a contract.");
        _;
    }

    // 限制用户输入的身份证为18位
    modifier isIdCard(string memory _idCard) {
        require(bytes(_idCard).length == 18,"The ID card entered is not 18 digits.");
        _;
    }

    // 限制飞机起飞前2小时不能购买票和保险
    modifier isFlighting2(uint256 _flightNumber) {
        require(block.timestamp + 7200 <=flightNumberToFlight[_flightNumber].departureTime,"Over the buying time");
        _;
    }

    // 限制飞机起飞前4小时不能退票和退保险
    modifier isFlighting4(uint256 _flightNumber) {
        require(block.timestamp + 14400 <= flightNumberToFlight[_flightNumber].departureTime,"It is beyond the refund time");
        _;
    }

    // 限制航班结算重入
    modifier isEnd(uint256 _flightNumber) {
        require(flightNumberToFlight[_flightNumber].End == false,"The flight has been settled.");
        flightNumberToFlight[_flightNumber].End = true;
        _;
    }

    constructor() {
        // 将部署合约的地址设置为管理者；
        administrator = msg.sender;
    }

    // 添加航空公司
    function addAirlines(string memory _airlineName, address _airlineCompany, uint128 _delayRate, uint128 _cancelRate) external onlyAdministrator {
        airlineName[_airlineCompany] = _airlineName.stringToBytes32();
        airlineAuthority[_airlineCompany] = true;
        delayRates[_airlineCompany] = _delayRate;
        cancelRates[_airlineCompany] = _cancelRate;
    }

    // 移除航空公司权限
    function removeAirlines(address _airlineCompany) external onlyAdministrator{
        airlineAuthority[_airlineCompany] = false;
    }

    // 修改航空公司自己的名字
    function setAirlineName(string memory _name) external onlyAirline {
        airlineName[msg.sender] = _name.stringToBytes32();
    }

    // 更新航空公司自己的延误率
    function setDelayRate(uint128 _delayRate) external onlyAirline {
        require(_delayRate <= 10000 && _delayRate >= 100,"The incoming delay rate is illegal");
        delayRates[msg.sender] = _delayRate;
    }

    // 更新航空公司自己的取消率
    function setCancelRate(uint128 _cancelRate) external onlyAirline {
        require(_cancelRate <= 10000 && _cancelRate >= 100,"The incoming cancel rate is illegal");
        cancelRates[msg.sender] = _cancelRate;
    }

    // 必须转入足够的资金，_totalSeat * _ticketPrice / 2;
    // 发布机票合约（传入的时间参数采取UNIX时间）
    function releaseFlight(uint24 _totalSeat, uint32 _departureTime, uint32 _scheduledArrivalTime, uint128 _ticketPrice, string memory _departurePoint, string memory _destinationPoint, uint256 _flightNumber) external payable onlyAirline {
        require(flightNumberToFlight[_flightNumber].flightNumber == 0,"The flight number already exists");
        require(msg.value >= (_totalSeat * _ticketPrice) / 2,"Not saving enough money");
        // 传入航班参数
        flightNumberToFlight[_flightNumber].totalSeat = _totalSeat;
        flightNumberToFlight[_flightNumber].departureTime = _departureTime;
        flightNumberToFlight[_flightNumber].scheduledArrivalTime = _scheduledArrivalTime;
        flightNumberToFlight[_flightNumber].ticketPrice = _ticketPrice;
        flightNumberToFlight[_flightNumber].delayInsurancePrice = (delayRates[msg.sender] * _ticketPrice) /10000;
        flightNumberToFlight[_flightNumber].cancelInsurancePrice = (cancelRates[msg.sender] * _ticketPrice) / 10000;
        flightNumberToFlight[_flightNumber].airline = airlineName[msg.sender];
        flightNumberToFlight[_flightNumber].departurePoint = _departurePoint.stringToBytes32();
        flightNumberToFlight[_flightNumber].destinationPoint = _destinationPoint.stringToBytes32();
        flightNumberToFlight[_flightNumber].flightNumber = _flightNumber;
        // 触发事件
        balance[_flightNumber] += msg.value;
        emit TicketIssued(msg.sender, _flightNumber);
    }

    // 购买机票逻辑(msg.value必须等于机票价格！！！)
    function buyTicket(uint256 _flightNumber, string memory _idCard, uint24 _tokenId) external payable notContact isFlighting2(_flightNumber) isIdCard(_idCard) {
        // 提交的身份证是否以及购买过机票
        require(flightNumberToFlight[_flightNumber].idCardToSeat[_idCard.stringToBytes32()] == 0, "One ID card can only buy one ticket.");
        // 这个座位是否卖出
        require(flightNumberToFlight[_flightNumber].seatToIdCard[_tokenId] == 0x0000000000000000000000000000000000000000000000000000000000000000, "The seat is for sale.");
        // 验证转入的钱是否等于机票价格
        require(msg.value == flightNumberToFlight[_flightNumber].ticketPrice, "Please transfer the correct ticket price.");

        flightNumberToFlight[_flightNumber].seatToIdCard[_tokenId] = _idCard.stringToBytes32();
        flightNumberToFlight[_flightNumber].idCardToSeat[_idCard.stringToBytes32()] = _tokenId;
        flightNumberToFlight[_flightNumber].idCardToAddress[_idCard.stringToBytes32()] = msg.sender;

        balance[_flightNumber] += msg.value;
        emit TicketPurchased(_idCard, _flightNumber, _tokenId);
    }

    // 退票逻辑
    function refundTicket(uint256 _flightNumber, uint24 _tokenId) external notContact isFlighting4(_flightNumber) {
        bytes32 _idCard = flightNumberToFlight[_flightNumber].seatToIdCard[_tokenId];
        require(flightNumberToFlight[_flightNumber].idCardToAddress[_idCard] == msg.sender, "This ticket doesn't belong to you.");

        flightNumberToFlight[_flightNumber].seatToIdCard[_tokenId] = 0x0000000000000000000000000000000000000000000000000000000000000000;
        flightNumberToFlight[_flightNumber].idCardToSeat[_idCard] = 0;
        flightNumberToFlight[_flightNumber].idCardToAddress[_idCard] = address(0);

        _refundInsurance(_flightNumber, _idCard);

        payable(msg.sender).transfer(flightNumberToFlight[_flightNumber].ticketPrice);

        balance[_flightNumber] -= flightNumberToFlight[_flightNumber].ticketPrice;

        emit TicketRefund(_idCard.bytes32ToString(), _flightNumber, _tokenId);
    }

    // 购买保险逻辑（msg.value必须等于保金价格！！！！）
    function buyInsurance(uint256 _flightNumber,uint8 choose,string memory _idCard) external payable onlyTicketOwner(_flightNumber, _idCard) isIdCard(_idCard) notContact isFlighting2(_flightNumber) {
        uint256 price;
        require(choose == 0 || choose == 1 || choose == 2, "Illegal parameter.");
        // 0表示购买延误险，1表示购买取消险，2表示两种保险都购买
        if (choose == 0) {
            price = flightNumberToFlight[_flightNumber].delayInsurancePrice;
            require(flightNumberToFlight[_flightNumber].idCardToDelay[_idCard.stringToBytes32()] == false, "Delay insurance has been purchased");
            require(msg.value == price, "The amount transferred is incorrect.");
            flightNumberToFlight[_flightNumber].idCardToDelay[_idCard.stringToBytes32()] = true;
            emit InsurancePurchased(_idCard, _flightNumber, "delayInsurance");
        } else if (choose == 1) {
            price = flightNumberToFlight[_flightNumber].cancelInsurancePrice;
            require(flightNumberToFlight[_flightNumber].idCardToCancel[_idCard.stringToBytes32()] == false, "Cancel insurance has been purchased");
            require(msg.value == price, "The amount transferred is incorrect.");
            flightNumberToFlight[_flightNumber].idCardToCancel[_idCard.stringToBytes32()] = true;
            emit InsurancePurchased(_idCard, _flightNumber, "cancelInsurance");
        } else if (choose == 2) {
            price = flightNumberToFlight[_flightNumber].delayInsurancePrice + flightNumberToFlight[_flightNumber].cancelInsurancePrice;
            require(flightNumberToFlight[_flightNumber].idCardToDelay[_idCard.stringToBytes32()] == false && flightNumberToFlight[_flightNumber].idCardToCancel[_idCard.stringToBytes32()] == false, "Insurance has been purchased");
            require(msg.value == price, "The amount transferred is incorrect.");
            flightNumberToFlight[_flightNumber].idCardToDelay[_idCard.stringToBytes32()] = true;
            flightNumberToFlight[_flightNumber].idCardToCancel[_idCard.stringToBytes32()] = true;
            emit InsurancePurchased(_idCard, _flightNumber, "delayInsurance");
            emit InsurancePurchased(_idCard, _flightNumber, "cancelInsurance");
        }
        balance[_flightNumber] += price;
    }

    // 退保险(在退票时同时进行)
    function _refundInsurance(uint256 _flightNumber, bytes32 _idCard) private {
        uint256 price;
        if (flightNumberToFlight[_flightNumber].idCardToDelay[_idCard] == true) {
            price += flightNumberToFlight[_flightNumber].delayInsurancePrice;
            flightNumberToFlight[_flightNumber].idCardToDelay[_idCard] = false;
            emit InsuranceRefund(_idCard.bytes32ToString(), _flightNumber, "delayInsurance");
        }
        if (flightNumberToFlight[_flightNumber].idCardToCancel[_idCard] == true) {
            price += flightNumberToFlight[_flightNumber].cancelInsurancePrice;
            flightNumberToFlight[_flightNumber].idCardToCancel[_idCard] = false;
            emit InsuranceRefund(_idCard.bytes32ToString(), _flightNumber, "cancelInsurance");
        }
        payable(msg.sender).transfer(price);
        balance[_flightNumber] -= price;
    }

    // 由航空公司上传航班实际到达时间
    function update(uint256 _flightNumber, uint32 _actualArrivalTime) external onlyAirlineOwner(_flightNumber){
        // 更新航班实际到达时间逻辑
        flightNumberToFlight[_flightNumber].actualArrivalTime = _actualArrivalTime;
        // 判断航班状态
        _updateFlightStatus(_flightNumber);
    }
    
    

    // 更新航班状态
    function _updateFlightStatus(uint256 _flightNumber) private {
        if (flightNumberToFlight[_flightNumber].actualArrivalTime == 0) {
            // 航班被取消了
            flightNumberToFlight[_flightNumber].planState = PlanState.Canceled;
        } else {
            if (flightNumberToFlight[_flightNumber].actualArrivalTime <= flightNumberToFlight[_flightNumber].scheduledArrivalTime) {
                // 航班准时到达
                flightNumberToFlight[_flightNumber].planState = PlanState.OnTimeArrival;
            } else {
                uint256 delayTime = (flightNumberToFlight[_flightNumber].actualArrivalTime - flightNumberToFlight[_flightNumber].scheduledArrivalTime) / 60;
                if (delayTime <= 120) {
                    // 延误两小时以内
                    flightNumberToFlight[_flightNumber].planState = PlanState.LateArrival2;
                } else if (delayTime <= 240) {
                    // 延误4小时以内
                    flightNumberToFlight[_flightNumber].planState = PlanState.LateArrival4;
                } else {
                    // 延误4小时以上
                    flightNumberToFlight[_flightNumber].planState = PlanState.LateArrival;
                }
            }
        }
    }

    // 进行资金结算
    function settlement(uint256 _flightNumber) external onlyAirlineOwner(_flightNumber) isEnd(_flightNumber){
        if (flightNumberToFlight[_flightNumber].planState == PlanState.OnTimeArrival) {
            _settlement1(_flightNumber);
        } else if (flightNumberToFlight[_flightNumber].planState == PlanState.Canceled) {
            _settlement2(_flightNumber);
        } else if (flightNumberToFlight[_flightNumber].planState == PlanState.LateArrival2) {
            _settlement3(_flightNumber);
        } else if (flightNumberToFlight[_flightNumber].planState == PlanState.LateArrival4) {
            _settlement4(_flightNumber);
        } else if (flightNumberToFlight[_flightNumber].planState == PlanState.LateArrival) {
            _settlement5(_flightNumber);
        }
    }

    // 结算1 准时到达
    function _settlement1(uint256 _flightNumber) private {
        uint256 _balance = balance[_flightNumber];
        payable(msg.sender).transfer(_balance);
        balance[_flightNumber] -= _balance;
    }

    // 结算2 航班取消
    function _settlement2(uint256 _flightNumber) private {
        uint256 _cancelPrice = flightNumberToFlight[_flightNumber].ticketPrice / 2;
        bytes32 _idCard;
        uint256 _price;
        for (uint24 i = 1; i <= flightNumberToFlight[_flightNumber].totalSeat; i++) {
            _price = flightNumberToFlight[_flightNumber].ticketPrice;
            _idCard = flightNumberToFlight[_flightNumber].seatToIdCard[i];
            if (flightNumberToFlight[_flightNumber].seatToIdCard[i] != 0x0000000000000000000000000000000000000000000000000000000000000000) {
                if (flightNumberToFlight[_flightNumber].idCardToDelay[_idCard] == true) {
                    _price += flightNumberToFlight[_flightNumber].delayInsurancePrice;
                }
                if (flightNumberToFlight[_flightNumber].idCardToCancel[_idCard] == true) {
                    _price += _cancelPrice;
                }
                payable(flightNumberToFlight[_flightNumber].idCardToAddress[_idCard]).transfer(_price);
                balance[_flightNumber] -= _price;
            }
        }
        uint256 _balance = balance[_flightNumber];
        payable(msg.sender).transfer(_balance);
        balance[_flightNumber] -= _balance;
    }

    // 结算3 延误2小时内
    function _settlement3(uint256 _flightNumber) private {
        uint256 _price = flightNumberToFlight[_flightNumber].ticketPrice / 4;
        bytes32 _idCard;
        for (uint24 i = 1; i <= flightNumberToFlight[_flightNumber].totalSeat; i++) {
            _idCard = flightNumberToFlight[_flightNumber].seatToIdCard[i];
            if (flightNumberToFlight[_flightNumber].idCardToDelay[_idCard] == true) {
                payable(flightNumberToFlight[_flightNumber].idCardToAddress[_idCard]).transfer(_price);
                balance[_flightNumber] -= _price;
            }
        }
        uint256 _balance = balance[_flightNumber];
        payable(msg.sender).transfer(_balance);
        balance[_flightNumber] -= _balance;
    }

    // 结算4 延误4小时内
    function _settlement4(uint256 _flightNumber) private {
        uint256 _price = flightNumberToFlight[_flightNumber].ticketPrice / 2;
        bytes32 _idCard;
        for (uint24 i = 1; i <= flightNumberToFlight[_flightNumber].totalSeat; i++) {
            _idCard = flightNumberToFlight[_flightNumber].seatToIdCard[i];
            if (flightNumberToFlight[_flightNumber].idCardToDelay[_idCard] == true) {
                payable(flightNumberToFlight[_flightNumber].idCardToAddress[_idCard]).transfer(_price);
                balance[_flightNumber] -= _price;
            }
        }
        uint256 _balance = balance[_flightNumber];
        payable(msg.sender).transfer(_balance);
        balance[_flightNumber] -= _balance;
    }

    // 结算5 延误超过4小时
    function _settlement5(uint256 _flightNumber) private {
        uint256 _price = (flightNumberToFlight[_flightNumber].ticketPrice * 3) / 4;
        bytes32 _idCard;
        for (uint24 i = 1; i <= flightNumberToFlight[_flightNumber].totalSeat; i++) {
            _idCard = flightNumberToFlight[_flightNumber].seatToIdCard[i];
            if (flightNumberToFlight[_flightNumber].idCardToDelay[_idCard] == true) {
                payable(flightNumberToFlight[_flightNumber].idCardToAddress[_idCard]).transfer(_price);
                balance[_flightNumber] -= _price;
            }
        }
        uint256 _balance = balance[_flightNumber];
        payable(msg.sender).transfer(_balance);
        balance[_flightNumber] -= _balance;
    }

       // 返回合约余额
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // 查看航空公司地址记录的延误率
    function getDelayRate(address _address) external view returns (uint256) {
        return delayRates[_address];
    }

    // 查看航空公司地址记录的取消率
    function getCancelRate(address _address) external view returns (uint256) {
        return delayRates[_address];
    }

    // 输入航班号和身份证返回座位号
    function getIdCardToSeat(uint256 _flightNumber, string memory _idCard) external view returns (uint256){
        return flightNumberToFlight[_flightNumber].idCardToSeat[_idCard.stringToBytes32()];
    }

    // 返回航班机票价格
    function getTicketPrice(uint256 _flightNumber) external view returns (uint256){
        return flightNumberToFlight[_flightNumber].ticketPrice;
    }

    // 返回航班状态
    function getPlaState(uint256 _flightNumber) external view returns (PlanState){
        return flightNumberToFlight[_flightNumber].planState;
    }

    // 返回航班在合约中的余额
    function getFlightBalance(uint256 _flightNumber) external view returns (uint256){
        return balance[_flightNumber];
    }

    // 查看航班号对应的航空公司名字
    function getFlightToAirline(uint256 _flightNumber) external view returns (string memory){
        return flightNumberToFlight[_flightNumber].airline.bytes32ToString();
    }

    // 查询航班的延误险保金
    function getDelayInsurancePrice(uint256 _flightNumber) external view returns (uint128) {
        return flightNumberToFlight[_flightNumber].delayInsurancePrice;
    }

    // 查询航班的延误险保金
    function getCancelInsurancePrice(uint256 _flightNumber) external view returns (uint128) {
        return flightNumberToFlight[_flightNumber].cancelInsurancePrice;
    }

    // 查看航班的预定起飞时间和到达时间
    function getFlightTime(uint256 _flightNumber) external view returns (uint256 takeOffTime, uint256 arriveTime){
        takeOffTime = flightNumberToFlight[_flightNumber].departureTime;
        arriveTime = flightNumberToFlight[_flightNumber].scheduledArrivalTime;
    }

    // 查看航班的出发地点
    function getPoint(uint256 _flightNumber) external view returns (string memory from, string memory to){
        from = flightNumberToFlight[_flightNumber].departurePoint.bytes32ToString(); //出发地点
        to = flightNumberToFlight[_flightNumber].destinationPoint.bytes32ToString(); //目的地
    }

    // 获取查看航空公司的权限
    function getAirlineAuthority(address _account) external view returns(bool){
       return airlineAuthority[_account];
    }

    // 根据航班号查询空余座位号
    function getEmptySeat(uint256 _flightNumber) external view returns (uint24[] memory){
        uint24[] memory emptySeat = new uint24[](flightNumberToFlight[_flightNumber].totalSeat);
        uint24 n = 0;
        for (uint24 i = 1; i <= flightNumberToFlight[_flightNumber].totalSeat; i++) {
            if (flightNumberToFlight[_flightNumber].seatToIdCard[i] == 0x0000000000000000000000000000000000000000000000000000000000000000) {
                emptySeat[n] = i;
                n++;
            }
        }
        return emptySeat;
    }

    // 查询航班(缺陷：输入的出发时间只能跟航班信息记录的出发时间一样才能查询到)（不用）
    // function getFlightNumber(string memory from, string memory to, uint32 time) external view returns (uint256 flightNumber) {
    //     return findFlight[from.stringToBytes32()][to.stringToBytes32()][time];
    // }

}
