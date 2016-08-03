<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 7/27/16
 * Time: 10:17 PM
 */
require __DIR__.'/vendor/autoload.php';

$client = new Predis\Async\Client('tcp://127.0.0.1:6379');
$client_sync = new Predis\Client('tcp://127.0.0.1:6379');

$product_store = []; // 目前所有 products

/**
 * 使用前更新目前所有 products
 */
$all_product_keys = $client_sync->keys('product:*');
foreach ($all_product_keys as $product_key) {
    // 抓取 id
    preg_match('/product:(\d+)/',$product_key, $matches);
    $id = $matches[1];
    // 設定 id=>product 關聯
    $product_store[$id] = $client_sync->hgetall($product_key);
}
// 排序 product_store
ksort($product_store);
showStore();


/**
 * 處理新增事件
 * @param $id
 * @param $product
 */
function insertHandler($id, $product)
{
    global $product_store;
    echo "新增 product_store 項目:\n";
    echo "id: $id\n";
    echo "name: ${product['name']}\n";
    echo "price: ${product['price']}\n";
    echo "stock: ${product['stock']}\n\n";
    $product_store[$id] = $product;
}

/**
 * 處理更改事件
 * @param $id
 * @param $product
 */
function updateHandler($id, $product)
{
    global $product_store;
    echo "更改 product_store 項目:\n";
    echo "id: $id\n";
    if($product_store[$id]['name'] !== $product['name']){
        echo "name: ${product['name']}\n";
        $product_store[$id]['name'] = $product['name'];
    }
    if($product_store[$id]['price'] !== $product['price']){
        echo "price: ${product['price']}\n";
        $product_store[$id]['price'] = $product['price'];
    }
    if($product_store[$id]['stock'] !== $product['stock']){
        echo "stock: ${product['stock']}\n";
        $product_store[$id]['stock'] = $product['stock'];
    }
    echo "\n";
}

/**
 * 處理刪除事件
 * @param $id
 * @param $product
 */
function deleteHandler($id, $product)
{
    global $product_store;
    echo "刪除 product_store 項目:\n";
    echo "id: $id\n\n";
    unset($product_store[$id]);
}

/**
 * 顯示 product_store
 */
function showStore()
{
    global $product_store;
    foreach ($product_store as $id => $product) {
        echo "id: $id\n";
        echo "name: ${product['name']}\n";
        echo "price: ${product['price']}\n";
        echo "stock: ${product['stock']}\n";
        echo "----------------------------------------------\n";
    }
}

/**
 * 開始監聽新的事件，並同步更新本地 products
 */
$client->connect(function ($client) use ($client_sync, $product_store) {
    $client->pubSubLoop(['psubscribe'=>'__keyspace@*__:product:*'], function ($event, $pubsub) use ($client_sync, $product_store) {
        if (preg_match('/__keyspace@\d+__:(product:(\d+))/',$event->channel, $matches)) {
            $product_key = $matches[1];
            $product_id = $matches[2];
            $product = $client_sync->hgetall($product_key);
            $op = $event->payload;
            if ($op === 'del') {
                deleteHandler($product_id,$product);
            } else if ($op === 'hset') {
                if (isset($product_store[$product_id])) {
                    echo($product_id);
                    updateHandler($product_id, $product);
                } else {
                    insertHandler($product_id,$product);
                }
            }
        }
    });
});
$client->getEventLoop()->run();