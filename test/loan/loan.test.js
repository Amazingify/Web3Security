const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Testing FlashLoan', function () {
    let deployer, user, attacker;

    const ETHER_IN_POOL = ethers.utils.parseEther('100');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, user, attacker] = await ethers.getSigners();

        const FlashLoan = await ethers.getContractFactory('FlashLoan', deployer);
        const Alice = await ethers.getContractFactory('Alice', deployer);

        this.FlashLoan = await FlashLoan.deploy();
        await this.FlashLoan.deployed();

        this.Alice = await Alice.deploy(this.FlashLoan.address);
        await this.Alice.deployed();

        await deployer.sendTransaction({ to: this.FlashLoan.address, value: ETHER_IN_POOL });

        expect(await ethers.provider.getBalance(this.FlashLoan.address)).to.be.equal(ETHER_IN_POOL);
    });

    it('Testing loan', async function () {
        /** CODE YOUR EXPLOIT HERE */   
        await this.FlashLoan.flashLoan(ethers.utils.parseEther('10'), this.Alice.address);
    });

    it('Testing bad loan', async function () {
        /** CODE YOUR EXPLOIT HERE */   
        let bob = await ethers.getContractFactory("Bob", deployer);
        bob = await bob.deploy(this.FlashLoan.address);
        bob = await bob.deployed();

        let tx = this.FlashLoan.flashLoan(ethers.utils.parseEther('10'), bob.address);
        await expect(tx).to.revertedWith("Loan was not repaid");
    });

    after(async function () {
    
    });
});
