pragma solidity ^0.8.0;


interface IAlice {
    function handleLoan() external payable;
}

contract FlashLoan {
    constructor(){}
  
    function flashLoan(uint amount, address reciever) external  {
        require(amount <= address(this).balance, "not enough balance");
        uint balanceBefore = address(this).balance;
        IAlice(reciever).handleLoan{value:amount}();
        uint balanceAfter  = address(this).balance;
        require(balanceAfter >= balanceBefore, "Loan was not repaid");
    }   

    receive() external payable {}

}

contract Alice{
    address public flashLoan;
    constructor(address _flashLoan){
        flashLoan = _flashLoan;
    }
    function handleLoan() external payable{
        require(msg.sender == address(flashLoan), "caller must be flashloan contract");
        // * do some stuff with the loan.
        // * but tokenx on exchange A
        // * sell tokenx on exhcange B.
        (bool sent,) = flashLoan.call{value: msg.value}("");
        require(sent,"loan repayment failed");
    }

}


contract Bob{
    address public flashLoan;
    constructor(address _flashLoan){
        flashLoan = _flashLoan;
    }
    function handleLoan() external payable{
        require(msg.sender == address(flashLoan), "caller must be flashloan contract");
        // * do some stuff with the loan.
        // * but tokenx on exchange A
        // * sell tokenx on exhcange B.
        (bool sent,) = flashLoan.call{value: msg.value - 1 ether}("");
        require(sent,"loan repayment failed");
    }

}


