/**
 * Created by simon on 9/4/16.
 */
import ProductListException from './ProductListException.js';
/**
 * 維護本地產品列表的物件
 */
export default class ProductList {
    constructor () {
        this.product_list = [];
    }

    /**
     * 從 Server 取得目前所有產品列表
     * @param url Server Url
     */
    loadList (url) {
        try {
            let xhr = new XMLHttpRequest();
            // 因為這個方法必須確實取得資料才能回傳，所以使用同步版本的 xhr
            xhr.open("GET", url, false);
            xhr.send();
            let result = JSON.parse(xhr.responseText);
            this.product_list = result;
            return result;
        } catch (e) {
            throw new ProductListException(`Error #1: Cannot load product list from remote server: ${url}.`)
        }
    }

    /**
     * 取得產品列表
     * @returns {Array|*}
     */
    getProductList () {
        return this.product_list;
    }

    /**
     * 增加產品
     */
    addItem (item) {
         this.product_list.push(item);
    }

    /**
     * 刪除產品
     * @param id
     */
    deleteItemById (id) {
        let index = this.product_list.findIndex(item => id === item.id);
        if (index === -1) {
            throw new ProductListException(`Error #2: Delete product error, not such product id: ${id}.`);
        }
        this.product_list.splice(index,1);
    }

    /**
     * 更新產品
     * @param updating_item
     */
    updateItem (updating_item) {
        let index = this.product_list.findIndex(item => item.id === updating_item.id);
        if (index === -1) {
            throw new ProductListException(`Error #3: Update product error, not such product id: ${id}.`);
        }
        // 更新產品部分資訊
        for (let prop in updating_item) {
            if (Object.prototype.hasOwnProperty.call(updating_item, prop)) {
                this.product_list[index][prop] = updating_item[prop];
            }
        }
    }
}
