<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 8/2/16
 * Time: 6:17 AM
 */
require __DIR__.'/vendor/autoload.php';
$client = new Predis\Client('tcp://127.0.0.1:6379');
$product_details = []; // product_id => product_details
// 先取得商品清單
$products = $client->smembers('products');
foreach ($products as $id) {
    // 取得每個商品的細項資料
    $product = $client->hgetall("product:$id");
    $product_details[$id]=$product;
}
$response = <<< HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" /> 
</head>
<body>

</body>
</html>
HTML;

