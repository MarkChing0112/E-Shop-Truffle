import Web3 from 'web3';
import data from '../build/contracts/products.json';
import 'bootstrap/dist/css/bootstrap.css';
import ticketImage from './images/ticket.png';

const createElementFromString = (string) => {
  const el = document.createElement('div');
  el.innerHTML = string;
  return el.firstChild;
};

const CONTRACT_ADDRESS =
data.networks['5777'].address;
console.log(CONTRACT_ADDRESS)
const CONTRACT_ABI = data.abi;

const web3 = new Web3(
  Web3.givenProvider || 'http://127.0.0.1:1234'
);
const contract = new web3.eth.Contract(
  CONTRACT_ABI,
  CONTRACT_ADDRESS
);

let account;

const accountEl = document.getElementById('account');
const ticketsEl = document.getElementById('tickets');


const AddproductEl= document.getElementById('add-product')

const TOTAL_TICKETS = 10;
const EMPTY_ADDRESS =
  '0x0000000000000000000000000000000000000000';

const TOTAL_Products = 10;

const buyTicket = async (ticket) => {
  await contract.methods
    .buyTicket(ticket.id)
    .send({ from: account, value: ticket.price });
};

const buyProduct = async (product_number,price) => {
  console.log("BuyProduct Function Receive data:",product_number,price)
  let Dprice = Number(price).toString();
  await contract.methods.buyProduct(product_number, account)
  .send({from: account, value: Dprice});
  let purchasersAry = await contract.methods.getPurchasers(product_number).call();
  location.reload();
  console.log("purchasers: ",purchasersAry);
}

//get Products Function
const GetAllProducts = async ()=>{
  let tmp ="";
  //Product Element
  const productsEl = document.getElementById('product');
  const keys = await contract.methods.getMyStructsKeys().call();
  console.log("Keys of Products",keys);
    const myProducts = [];
    for (let i = 0; i < keys.length; i++) {
        const myProduct = await contract.methods.getMyProduct(keys[i]).call();
        console.log("Product",myProduct);
        //append product to array
        myProducts.push(myProduct);

        //get data from each product
        let data = myProducts[i];
        
        //get remain of each product
        const remain = await contract.methods.getcountRemain(keys[i]).call();
        // Create a new div element for the product
        let productDiv = document.createElement('div');
        productDiv.className = 'card';
        //count data[4] address repeats
        let count = {};
        for(let i = 0; i < data[4].length; i++) {
          let key = data[4][i];
          count[key] = (count[key] ? count[key] + 1 : 1);
        }
        let countString = JSON.stringify(count, null, 0.2);
        if(remain > 0){
        productDiv.innerHTML =
          ` 
          
            <div class="card ">
              <div class="card-image ">
                  <figure class="image is-4by3" style="background-size: cover; background-position-y: center;">
                  <img src="${data[2]}" alt="">
                  </figure>
              </div>

              <div class="card-body ">
                  <div class="media">
                      <div class="media-content" >
                          <p class="title is-4 product-name" id="product_name">${data[0]}</p>
                          <p class="subtitle is-7">${remain} in stock</p>
                          Owners:<textarea class"subtitle is-7"> ${countString}</textarea>
                          <p class="subtitle is-4 has-text-primary has-text-weight-semibold">$<span
                                  class="product-price" id="product_price">0.1 ETH</span></p>
                      </div>
                      <div class="buttons">
                          <div class="btn btn-warning buy-now">
                              Buy Now
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </div
          `;
      console.log("keys id",keys[i])
      // productDiv.onclick = buyProduct(keys[i],data[3]);
      // Get the "Buy Now" button and attach the click event listener
      const buyNowButton = productDiv.querySelector('.buy-now');
      buyNowButton.addEventListener('click', () => buyProduct(keys[i], data[3]));
      productsEl.appendChild(productDiv);
    }else{
      productDiv.innerHTML =
      `

        <div class="card">
          <div class="card-image">
              <figure class="image is-4by3" ; >
              <img src="${data[2]}" alt="Girl in a jacket">
              </figure>
          </div>
          
          <div class="card-content">
              <div class="media">
                  <div class="media-content">
                      <p class="title is-4 ">${data[0]}</p>
                      <p class="subtitle is-7">${remain} in stock</p>
                      Owners:<textarea class"subtitle is-7"> ${countString}</textarea>
                      <p class="subtitle is-4 has-text-primary has-text-weight-semibold">$<span
                              class="product-price" id="product_price">0.1 ETH</span></p>
                  </div>
                  <div class="buttons">
                      <div class="btn btn-outline-danger">
                          sold Out!!!!
                      </div>
                  </div>
              </div>
            </div>
          </div>
        
      `;
      productsEl.appendChild(productDiv);
    }
    }
}

const refreshTickets = async () => {
  ticketsEl.innerHTML = '';
  for (let i = 0; i < TOTAL_TICKETS; i++) {
    const ticket = await contract.methods.tickets(i).call();
    ticket.id = i;
    if (ticket.owner === EMPTY_ADDRESS) {
      const ticketEl = createElementFromString(
        `<div class="ticket card" style="width: 18rem;">
          <img src="${ticketImage}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Ticket</h5>
            <p class="card-text">${
              ticket.price / 1e18
            } Eth</p>
            <button class="btn btn-primary">Buy Ticket</button>
          </div>
        </div>`
      );
      ticketEl.onclick = buyTicket.bind(null, ticket);
      ticketsEl.appendChild(ticketEl);
    }
  }
};

 const AddProduct = async () =>{
  var name = document.getElementById('new-product-name').value;
  var product_quantity= document.getElementById('new-product-amount').value;
  var url= document.getElementById('new-product-image').value;
  var price = document.getElementById('new-product-price').value;
  //get product length
  const keys = await contract.methods.getMyStructsKeys().call();
  // var id = Math.floor(Math.random() * 50);
  var id=keys.length + 1;
  console.log(id);
  var id_Str = id.toString();
  console.log(id_Str);
  console.log(id_Str + " " + name + " " + price+ " " +product_quantity)

  await contract.methods.addProduct(id_Str,product_quantity,name,url,price).send({from: account});
  id+=1;
  location.reload();
};
 document.getElementById("new-product-submit").addEventListener("click", function () {
  AddProduct();
});
const main = async () => {
  const accounts = await web3.eth.requestAccounts();
  account = accounts[0];
  accountEl.innerText = account;
  await GetAllProducts();
  // await refreshProducts();
  // initProducts();
  
};

main();
