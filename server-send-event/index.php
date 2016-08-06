<?php
require __DIR__.'/vendor/autoload.php';

$client = new Predis\Async\Client('tcp://127.0.0.1:6379');
$client_sync = new Predis\Client('tcp://127.0.0.1:6379');

$product_store = [];
$all_product_keys = $client_sync->keys('product:*');

foreach ($all_product_keys as $product_key) {
    // 抓取 id
    preg_match('/product:(\d+)/', $product_key, $matches);
    $id = $matches[1];
    // 設定 id=>product 關聯
    $product_store[$id] = $client_sync->hgetall($product_key);
}
// 排序 product_store
ksort($product_store);

// 準備資料
$data = json_encode($product_store);
// 輸出 HTML
$html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Server Send Event</title>
    <script>
    var product_store = $data;
    
    window.onload = function () {
        var body = document.getElementsByTagName('body')[0];
        var table = document.createElement('table');
        var title = document.createElement('thead');
        title.innerHTML = "<td>品項</td><td>價格</td><td>庫存</td>";
        table.appendChild(title);
        for (var i in product_store) {
            var tr = document.createElement('tr');
            for (var field in product_store[i]) {
                var td = document.createElement('td');
                var text = document.createTextNode(product_store[i][field]);
                td.appendChild(text);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        body.appendChild(table);
    };
    </script>
</head>
<body>

</body>
</html>
HTML;
echo $html;