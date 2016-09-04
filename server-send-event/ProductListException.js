/**
 * Created by simon on 9/4/16.
 */

/**
 * ProductList 專屬 Exception
 */
export default class ProductListException  extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}