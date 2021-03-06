/**
 * Created by simon on 9/4/16.
 */
import ServerSendEventHandler from './ServerSendEventHandler.js';
import ProductList from './ProductList.js';

window.onload = function () {
    let product_list = new ProductList();
    let sse_handler = new ServerSendEventHandler();
    // 新連線的頁面先更新最新產品清單
    product_list.loadList('./getProductList.php');
    // 將產品清單的資訊顯示在頁面上
    let tbody = document.getElementById("product_list");
    makeTableFromProductList(tbody, product_list.getProductList());
    // 設定當產品異動時要進行的各種處理，這邊主要是更新產品清單資料 product_list 和修改頁面上顯示的資訊
    sse_handler.addEventHandler(ServerSendEventHandler.ADD, product_list.addItem.bind(product_list));
    sse_handler.addEventHandler(ServerSendEventHandler.ADD, insertRow.bind(undefined, tbody));
    sse_handler.addEventHandler(ServerSendEventHandler.UPDATE, product_list.updateItem.bind(product_list));
    sse_handler.addEventHandler(ServerSendEventHandler.UPDATE, updateRow);
    sse_handler.addEventHandler(ServerSendEventHandler.DELETE, product_list.deleteItemById.bind(product_list));
    sse_handler.addEventHandler(ServerSendEventHandler.DELETE, deleteRow.bind(undefined, tbody));
    // 開始監聽產品異動事件並進行相應處理
    sse_handler.listen("./getUpdates.php");
};

/**
 * 顯示產品清單
 * @param tbody
 * @param product_list
 */
function makeTableFromProductList (tbody, product_list) {
    let docfrag = document.createDocumentFragment();
    product_list.forEach(product => insertRow(docfrag, product));
    tbody.appendChild(docfrag);
}

/**
 * 插入產品
 * @param tbody
 * @param product
 */
function insertRow (tbody, product) {
    let tr = document.createElement("tr");
    let {id, name, price, stock} = product;
    tr.setAttribute('id', id);
    let td_name = document.createElement('td');
    let td_price = document.createElement('td');
    let td_stock = document.createElement('td');
    td_name.textContent = name;
    td_name.setAttribute('name','name');
    td_price.textContent = price;
    td_price.setAttribute('name','price');
    td_stock.textContent = stock;
    td_stock.setAttribute('name','stock');
    tr.appendChild(td_name);
    tr.appendChild(td_price);
    tr.appendChild(td_stock);
    tbody.appendChild(tr);
}

/**
 * 更新產品
 * @param product
 */
function updateRow (product) {
    let id = product.id;
    let tr = document.getElementById(id);
    if (tr === null) {
        return;
    }
    for (let key in product) {
        if (Object.prototype.hasOwnProperty.call(product, key)) {
            let updating_td = tr.querySelector(`td[name="${key}"]`);
            if (updating_td !== null) {
                updating_td.textContent = product[key];
            }
        }
    }
}

/**
 * 刪除產品
 * @param tbody
 * @param product
 */
function deleteRow (tbody, product) {
    let id = product.id;
    let tr = document.getElementById(id);
    if (tr !== null) {
        tbody.removeChild(tr);
    }
}