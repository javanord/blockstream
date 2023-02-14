const fs = require('fs');
const { ethers } = require('hardhat');

async function main() {
    const HelloContract = await ethers.getContractFactory("SimpleStorage");
    const hello = await HelloContract.deploy();
    await hello.deployed();
    console.log("The HelloWorld Contract was deployed to: " + hello.address);

    let addresses = {"hellocontract": hello.address};
    let addressesJson = JSON.stringify(addresses);
    fs.writeFileSync("environment/contract-address.json", addressesJson);
}

main()
.then(() => {
    process.exit(0);
})
.catch((error) => {
    console.log(error);
    process.exit(1);
})