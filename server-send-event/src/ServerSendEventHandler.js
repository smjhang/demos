/**
 * Created by simon on 9/4/16.
 */

import ServerSendEventHandlerException from './ServerSendEventHandlerException.js';

const ADD = 0; // 產品新增事件代碼
const UPDATE = 1; // 產品修改事件代碼
const DELETE = 2; // 產品刪除事件代碼
/**
 * Server Send Event 處理物件
 */
export default class ServerSendEventHandler {
    constructor () {
        this.update_events = [];
        this.delete_events = [];
        this.add_events = [];
    }

    /**
     * 取得產品新增事件代碼
     * @returns {number}
     * @constructor
     */
    static get ADD () {
        return ADD;
    }

    /**
     * 取得產品修改事件代碼
     * @returns {number}
     * @constructor
     */
    static get UPDATE () {
        return UPDATE;
    }

    /**
     * 取得產品刪除事件代碼
     * @returns {number}
     * @constructor
     */
    static get DELETE () {
        return DELETE;
    }

    /**
     * 開始監聽 Server Send Event 並進行處理
     * @param url
     */
    listen (url) {
        if ([this.update_events.length, this.delete_events.length, this.add_events.length].includes(0)) {
            throw new ServerSendEventHandlerException(`Error #2: Event handlers must be specified before listing event.`);
        }
        let event_source = new EventSource("url");
        event_source.addEventListener('add', function (e) {
            let response_data = JSON.parse(e.data);
            Array.prototype.forEach.call(this.add_events, function (event_handler) {
                event_handler(response_data);
            });
        }, false);
        event_source.addEventListener('update', function (e) {
            let response_data = JSON.parse(e.data);
            Array.prototype.forEach.call(this.update_events, function (event_handler) {
                event_handler(response_data);
            });
        }, false);
        event_source.addEventListener('delete', function (e) {
            let response_data = JSON.parse(e.data);
            Array.prototype.forEach.call(this.delete_events, function (event_handler) {
                event_handler(response_data);
            });
        }, false);
        event_source.onerror = function(e) {
            throw new ServerSendEventHandlerException(`Error #4: Server send event failed: ${e.message}.`);
        };
    }

    /**
     * 附加事件處理函數
     * @param event_type
     * @param event_handler
     */
    addEventHandler (event_type, event_handler) {
        switch (event_type) {
            case ServerSendEventHandler.ADD:
                this.add_events.push(event_handler);
                break;
            case ServerSendEventHandler.UPDATE:
                this.update_events.push(event_handler);
                break;
            case ServerSendEventHandler.DELETE:
                this.delete_events.push(event_handler);
                break;
            default:
                throw new ServerSendEventHandlerException(`Error #1: Invalid event types: ${event_type}.`);
                break;
        }
    }

    /**
     * 移除事件處理函數
     * @param event_type
     * @param event_handler
     */
    removeEventHandler (event_type, event_handler) {
        switch (event_type) {
            case ServerSendEventHandler.ADD:
                let index = this.add_events.findIndex(item => Object.is(item, event_handler));
                if (index === -1) {
                    throw new ServerSendEventHandlerException(`Error #3: No such event handler.`);
                }
                this.add_events.splice(index, 1);
                break;
            case ServerSendEventHandler.UPDATE:
                this.update_events.findIndex(item => Object.is(item, event_handler));
                if (index === -1) {
                    throw new ServerSendEventHandlerException(`Error #3: No such event handler.`);
                }
                this.update_events.splice(index, 1);
                break;
            case ServerSendEventHandler.DELETE:
                this.delete_events.findIndex(item => Object.is(item, event_handler));
                if (index === -1) {
                    throw new ServerSendEventHandlerException(`Error #3: No such event handler.`);
                }
                this.delete_events.splice(index, 1);
                break;
            default:
                throw new ServerSendEventHandlerException(`Error #1: Invalid event types: ${event_type}.`);
                break;
        }
    }
}
