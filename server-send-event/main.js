/**
 * Created by simon on 9/4/16.
 */
import ServerSendEventHandler from "ServerSendEventHandler";
import ProductList from "ProductList";
import ServerSendEventHandlerException from "ServerSendEventHandlerException";
import ProductListException from "ProductListException";

document.onload = function () {
    let product_list = new ProductList();
    let sse_handler = new ServerSendEventHandler();
    product_list.loadList('getProductList.php');
    makeTableFromProductList("product_list", product_list.getProductList());
};
function makeTableFromProductList (tbody_id, product_list) {
    let tbody = document.getElementById(tbody_id);
    let docfrag = document.createDocumentFragment();
    Array.prototype.forEach.call(product_list, function (product) {
        let tr = document.createElement("tr");
        let {name, price, stock} = product;
        let td_name = document.createElement('td');
        let td_price = document.createElement('td');
        let td_stock = document.createElement('td');
        td_name.textContent = product.name;
        td_price.textContent = product.price;
        td_stock.textContent = product.stock;
        tr.appendChild(td);
        docfrag.appendChild(tr);
    });
    tbody.appendChild(docfrag);
}