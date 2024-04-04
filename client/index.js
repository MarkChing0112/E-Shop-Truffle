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

//Product Element
const productsEl = document.getElementById('products');
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

const buyProduct = async (product) => {
  //const purchaseser = await contract.methods.getPurchasers(product);
  // await contract.methods
  // .purchaseProduct(product, purchaseser)
  // .send({from: account, value: product.price});
}

// const addProduct =async (product) =>{
//    const  name = document.getElementById('new-product-name').val();
//    const product_quantity = document.getElementById('new-product-amount').val();
//    const url = document.getElementById('new-product-image').val();
//    const price = document.getElementById('new-product-price').val();
//   //Create product to contrac

  
//   await contract.methods.addProduct(id_Str,product_quantity,name,url,web3.utils.toBN(price)).send({form: account,});
// }

const refreshProducts = async () =>{
  productsEl.innerHTML = '';
    let tmp = '';
    for (let i = 0; i < 10; i++) {
      var i_Str = i.toString();
      const product = await contract.productList[i_Str].call();
      const productEl = createElementFromString(
        `
        <div class="card">
        <div class="card-image">
            <figure class="image is-4by3" style="background-size: cover; background-position-y: center;">
            <img src="${product.url}" alt="Girl in a jacket">
            </figure>
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4 product-name" id="product_name">${product.name}</p>
                    <p class="subtitle is-7"><span class="product-amount" id="product_quantity">6</span>${product.quantity} in stock</p>
                    <p class="subtitle is-4 has-text-primary has-text-weight-semibold">$<span
                            class="product-price" id="product_price">${product.price}</span></p>
                </div>
                <div class="buttons">
                    <div class="button is-warning buy-now">
                        Buy Now
                    </div>
                </div>
            </div>
        </div>
    </div>
        `
      )
      // productsEl.onclick = buyTicket.bind(null, product);
      productsEl.appendChild(productEl);
  }
};

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

  // var id = Math.floor(Math.random() * 50);
  var id=0;
  var id_Str = id.toString();
  console.log(id_Str + " " + name + " " + price+ " " +product_quantity)

  await contract.methods.addProduct(id_Str,product_quantity,name,url,web3.utils.toBN(price)).send({from: account});
  id+=1;
};
 document.getElementById("new-product-submit").addEventListener("click", function () {
  AddProduct();
});
const main = async () => {
  const accounts = await web3.eth.requestAccounts();
  account = accounts[0];
  accountEl.innerText = account;
  await refreshProducts();
  // initProducts();
  
};

main();
