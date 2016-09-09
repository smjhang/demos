<?php
/**
 * Author: simon
 */
require __DIR__.'/vendor/autoload.php';
$client_sync = new Predis\Client('tcp://127.0.0.1:6379');
$all_product_keys = $client_sync->keys('product:*');
$product_store = [];
foreach ($all_product_keys as $product_key) {
    // 抓取 id
    preg_match('/product:(\d+)/', $product_key, $matches);
    $id = $matches[1];
    // 設定 id=>product 關聯
    $product_store[$id] = $client_sync->hgetall($product_key);
}
$output = [];
foreach ($product_store as $id => $product) {
    $output[] = ["id" => $id, "name" => $product['name'], "price" => $product['price'], "stock" => $product['stock']];
}
echo json_encode($output);