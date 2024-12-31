const hre = require("hardhat")
const {ethers}=require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  let tokenMaster;
  let deployer; 

  //account setup
  [deployer]=await ethers.getSigners();

  //tokenmaster contract
  const TokenMaster=await ethers.getContractFactory("TokenMaster");
  tokenMaster=await TokenMaster.deploy("TokenMaster", "TM");
  await tokenMaster.deployed();
  

  console.log(`TokenMaster smartContract Address at : ${tokenMaster.address}`);

  const occasion=[
    {
      name:"Raj Mandir Cinema",
      cost:tokens(0.03),
      tickets:0,
      date:"May 31",
      time:"6.00PM EST",
      location:"Jaipur"
    },
    {
      name:"Sathyam Cinemas",
      cost:tokens(0.04),
      tickets:75,
      date:"December 31",
      time:"10.00PM EST",
      location:"Chennai"
    },
    {
      name:"Prasads IMAX",
      cost:tokens(0.02),
      tickets:125,
      date:"june 2",
      time:"1.00PM JST",
      location:"Hyderabad"
    },
    {
      name:"PVR Director's Cut",
      cost:tokens(0.05),
      tickets:170,
      date:"Augest 14",
      time:"9.00PM EST",
      location:"New Delhi"
    },
    {
      name:"Maratha Mandir",
      cost:tokens(0.02),
      tickets:0,
      date:"May 7",
      time:"10.00AM EST",
      location:"Mumbai"
    },
    {
      name: "Luxe Cinemas",
      cost:tokens(0.03),
      tickets:40,
      date:"July 8",
      time:"6.00AM EST",
      location:"Chennai"
    },
  ]
  
  //minting nfts
  for(var i=0;i<5;i++){
    const transaction=await tokenMaster.connect(deployer).list(occasion[i].name , occasion[i].cost , occasion[i].tickets , occasion[i].date , occasion[i].time , occasion[i].location);
    await transaction.wait();
  }
  console.log('NFTs Minted...')



}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});