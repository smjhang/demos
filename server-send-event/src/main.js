/**
 * Created by simon on 9/4/16.
 */
import ServerSendEventHandler from './ServerSendEventHandler.js';
import ProductList from './ProductList.js';

window.onload = function () {
    let product_list = new ProductList();
    let sse_handler = new ServerSendEventHandler();
    product_list.loadList('./getProductList.php');
    makeTableFromProductList("product_list", product_list.getProductList());
    sse_handler.add_events(ServerSendEventHandler.ADD, Function.prototype.call(product_list,));
};
function makeTableFromProductList (tbody_id, product_list) {
    let tbody = document.getElementById(tbody_id);
    let docfrag = document.createDocumentFragment();
    Array.prototype.forEach.call(product_list, function (product) {
        let tr = document.createElement("tr");
        let {id, name, price, stock} = product;
        tr.setAttribute('id', id);
        let td_name = document.createElement('td');
        let td_price = document.createElement('td');
        let td_stock = document.createElement('td');
        td_name.textContent = name;
        td_price.textContent = price;
        td_stock.textContent = stock;
        tr.appendChild(td_name);
        tr.appendChild(td_price);
        tr.appendChild(td_stock);
        docfrag.appendChild(tr);
    });
    tbody.appendChild(docfrag);
}