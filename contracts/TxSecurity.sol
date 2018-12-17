pragma solidity ^0.4.24;

contract TxSecurity {
    struct Transfer {
        address from;
        address to;
        uint val;
        bytes32 secret;
        uint timestamp;
        uint8 status; // 0: init 1: received 2: cancelled
    }

    Transfer[] transfers;

    // addres => tx list
    mapping(address => uint[]) userTransfers;

    function send(address to, bytes32 secret) external payable {
        /* require(to != address(0x0), "Invalid receiver"); */
        /* require(msg.value > 0, "Value too low"); */

        /* transfers.push(Transfer(msg.sender, to, msg.value, secret, block.timestamp, 0)); */
        /* userTransfers[msg.sender].push(transfers.length - 1); */
        /* userTransfers[to].push(transfers.length - 1); */
    }

    function receive(uint id, string pwd) external {
        require(id < transfers.length, "Invalid ID");
        require(msg.sender == transfers[id].to, "Invalid receiver");
        require(transfers[id].val != 0, "Value must be non-zero");
        require(keccak256(bytes(pwd)) == transfers[id].secret, "Invalid password");

        uint _val = transfers[id].val;
        transfers[id].val = 0;
        msg.sender.transfer(_val);
        transfers[id].status = 1;
    }

    function cancel(uint id) external {
        require(id < transfers.length, "Invalid ID");
        require(msg.sender == transfers[id].from, "Invalid sender");
        require(transfers[id].val != 0, "Value must be non-zero");

        uint _val = transfers[id].val;
        transfers[id].val = 0;
        msg.sender.transfer(_val);
        transfers[id].status = 2;
    }

    function getTransferListLen() external view returns (uint) {
        return transfers.length;
    }

    function getUserTransferListLen(address user) external view returns (uint) {
        return userTransfers[user].length;
    }

    /* function getTransferList(address user, uint startId) */
    /*     external */
    /*     view */
    /*     returns */
    /*     (bytes32[] data) { */

    /*     // batch of ten */
    /*     bytes32[] memory _data = new bytes32[](50); */

    /*     for(int i = (int)(startId); i >= 0 && i >= (int)(startId) - 10; i--) { */
    /*         int j = (int)(startId) - i; */
    /*         Transfer storage t = transfers[userTransfers[user][(uint)(i)]]; */
    /*         _data[(uint)(j * 5)] = bytes32(t.from); */
    /*         _data[(uint)(j * 5 + 1)] = bytes32(t.val); */
    /*         _data[(uint)(j * 5 + 2)] = bytes32(t.secret); */
    /*         _data[(uint)(j * 5 + 3)] = bytes32(t.timestamp); */
    /*         _data[(uint)(j * 5 + 4)] = bytes32(t.status); */
    /*     } */
    /*     return (_data); */
    /* } */
}
