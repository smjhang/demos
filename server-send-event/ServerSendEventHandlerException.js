/**
 * Created by simon on 9/4/16.
 */

/**
 * ServerSendEventHandler 專屬 Exception
 */
export default class ServerSendEventHandlerException  extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
    }
}