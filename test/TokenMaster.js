const { expect } = require("chai");
const {ethers}=require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("TokenMaster", () => {
    let tokenMaster;
    let deployer , buyer; 

    beforeEach(async()=>{

        //setting up accounts
        [deployer , buyer]=await ethers.getSigners();


        const TokenMaster=await ethers.getContractFactory("TokenMaster");
        tokenMaster=await TokenMaster.deploy("TokenMaster", "TM");

        //listing 
        let transaction=await tokenMaster.connect(deployer).list("LA Cinemas" , tokens(3) , 100 , "Apr 27" , "10:00 CST" , "Thillai nagar , Trichy");
        await transaction.wait();

        //minting nfts (Buying tickets)
        transaction=await tokenMaster.connect(buyer).mint(1, 20 , {value:tokens(3)});
        await transaction.wait();

    })

    //=============deployment
    describe("Deployment",async()=>{
        it("sets the name",async()=>{
            const name=await tokenMaster.name();
            expect(name).to.equal("TokenMaster");
        })
        it("sets the owner",async()=>{
            const own=await tokenMaster.owner();
            expect(own).to.equal(deployer.address);
        })
    })


    //==========listing 
    describe("Listing datas",async()=>{
        it("return the name",async()=>{
            const show=await tokenMaster.occasions(1);
            expect(show.name).to.equal("LA Cinemas");
        })
    })



    //==========minting or buying tickets;
    describe("ticket confirmed",async()=>{
        it("Stock reduced",async()=>{
            const show=await tokenMaster.occasions(1);
            expect(show.tickets).to.equal(99);
        })

        it("Booked seat",async()=>{
            const address=await tokenMaster.seatBooked(1,20);
            expect(address).to.equal(buyer.address);
        })
    })

})
