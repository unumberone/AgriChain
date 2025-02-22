// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgriChain {
    struct Product {
        uint id;
        string name;
        uint price;
        address farmer;
        bool sold;
    }

    uint public productCount = 0;
    mapping(uint => Product) public products;

    event ProductListed(uint id, string name, uint price, address farmer);
    event ProductPurchased(uint id, address buyer);

    function listProduct(string memory _name, uint _price) public {
        require(_price > 0, "Price must be greater than 0");
        productCount++;
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        emit ProductListed(productCount, _name, _price, msg.sender);
    }

    function purchaseProduct(uint _id) public payable {
        Product storage product = products[_id];
        require(!product.sold, "Product already sold");
        require(msg.value >= product.price, "Insufficient payment");

        payable(product.farmer).transfer(msg.value);
        product.sold = true;

        emit ProductPurchased(_id, msg.sender);
    }
}
