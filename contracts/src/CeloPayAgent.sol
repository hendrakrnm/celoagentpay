// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CeloPayAgent is Ownable {
    IERC20 public cUSD;

    event PaymentExecuted(
        address indexed from,
        address indexed to,
        uint256 amount,
        string memo,
        uint256 timestamp
    );

    event BatchPaymentExecuted(
        address indexed from,
        uint256 totalAmount,
        uint256 recipientCount,
        uint256 timestamp
    );

    struct Payment {
        address recipient;
        uint256 amount;
    }

    constructor(address _cUSD) Ownable(msg.sender) {
        require(_cUSD != address(0), "Invalid cUSD address");
        cUSD = IERC20(_cUSD);
    }

    /// @notice Send cUSD to a single recipient with a memo
    function sendPayment(
        address to,
        uint256 amount,
        string calldata memo
    ) external {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(cUSD.transferFrom(msg.sender, to, amount), "Transfer failed");
        emit PaymentExecuted(msg.sender, to, amount, memo, block.timestamp);
    }

    /// @notice Send cUSD to multiple recipients in one transaction
    function batchSend(Payment[] calldata payments) external {
        require(payments.length > 0, "Empty payments");
        require(payments.length <= 20, "Max 20 recipients");

        uint256 total = 0;
        for (uint256 i = 0; i < payments.length; i++) {
            require(payments[i].recipient != address(0), "Invalid recipient");
            require(payments[i].amount > 0, "Amount must be > 0");
            total += payments[i].amount;
        }
        require(
            cUSD.allowance(msg.sender, address(this)) >= total,
            "Insufficient allowance"
        );

        for (uint256 i = 0; i < payments.length; i++) {
            require(
                cUSD.transferFrom(msg.sender, payments[i].recipient, payments[i].amount),
                "Transfer failed"
            );
        }

        emit BatchPaymentExecuted(msg.sender, total, payments.length, block.timestamp);
    }

    /// @notice Get payment count (for frontend pagination)
    function getBalance(address account) external view returns (uint256) {
        return cUSD.balanceOf(account);
    }
}
