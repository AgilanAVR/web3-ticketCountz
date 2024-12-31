// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract TokenMaster is ERC721 {
     //state variables
    address public owner;
    uint256 public totalOccation;
    uint256 public totalNftsCinema;

    //struct
    struct Occasions{
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    //mapping
    mapping(uint256 => Occasions)public occasions; //nfts(shows)
    mapping(uint256=>mapping(uint256=>address))public seatBooked;
    mapping(uint256=>uint256[])public allotedSeats;  //where it holds the array of the nfts, which it cngtains the filled seats
    mapping(uint256 =>mapping(address => bool))public hasBought;

    //modifiers
    modifier OnlySeller(address sender){
        require(sender==owner , "only owner is allowed to call the list function");
        _;
    }

    modifier onlyOwner(address _owner){
        require(_owner==owner,"Only owner can call this funciton");
        _;
    }

    //constructor
    constructor(string memory _name , string memory _symbol)ERC721(_name , _symbol){
    owner=msg.sender;
    }

    //listing the shows
    function list(string memory _name , uint256 _cost, uint256 _maxTickets , string memory _date , string memory _time , string memory _location)public OnlySeller(msg.sender){
        totalOccation++;
        occasions[totalOccation] = Occasions(totalOccation,_name , _cost , _maxTickets , _maxTickets , _date , _time , _location);

    }



    //minting nfts(tickets)
    function mint(uint256 _id , uint256 _seatNo)public payable{
       //conttraints to book seat
       require(_id!=0);
       require(_id <= totalOccation , "Invalid NFTs");
       require(hasBought[_id][msg.sender]==false,"You Already buyed");
       require(occasions[_id].tickets > 0 ,"No Ticket Available");
       require(msg.value >=occasions[_id].cost , "Not enough Money");
       require(seatBooked[_id][_seatNo]==address(0) , "seat already sold");  //seat must be empty;

        occasions[_id].tickets--; //<-- Ticket updation
        hasBought[_id][msg.sender]=true;
        totalNftsCinema++;
        _safeMint(msg.sender , totalNftsCinema); 
        seatBooked[_id][_seatNo]=msg.sender;  //<--seat allocated;
        allotedSeats[_id].push(_seatNo); //<--seat has been tracked for the particular nfts.

    }

        function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return allotedSeats[_id];
    }


    function withdraw() public payable onlyOwner(msg.sender){
        (bool success,)=owner.call{value:address(this).balance}("");
        require(success);
    }
}
 