<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 9/5/16
 * Time: 6:56 AM
 */
require __DIR__.'/vendor/autoload.php';

class LocalStorage
{
    private $product_store = []; // 目前所有 products

    /**
     * 使用前更新目前所有 products
     * @param \Predis\Client $client_sync
     */
    public function init(\Predis\Client $client_sync)
    {
        $all_product_keys = $client_sync->keys('product:*');
        foreach ($all_product_keys as $product_key) {
            // 抓取 id
            preg_match('/product:(\d+)/', $product_key, $matches);
            $id = $matches[1];
            // 設定 id=>product 關聯
            $this->product_store[$id] = $client_sync->hgetall($product_key);
        }
        // 排序 product_store
        ksort($this->product_store);
    }

    /**
     * 判斷 id 是否在 product_store 內
     * @param $id
     * @return bool
     */
    public function contains($id)
    {
        if (isset($this->product_store[$id])) {
            return true;
        }
        return false;
    }


    /**
     * 處理新增事件
     * @param $id
     * @param $product
     */
    function insertHandler($id, $product)
    {
        echo "event: add" . PHP_EOL;
        echo 'data: {"id": "'.$id.'", "name": "'.$product['name'].'", "price": "'.$product['price'].'", "stock": "'.$product['stock'].'"}';
        echo PHP_EOL.PHP_EOL;
        ob_flush();
        flush();
        $this->product_store[$id] = $product;
    }


    /**
     * 處理更改事件
     * @param $id
     * @param $product
     */
    function updateHandler($id, $product)
    {
        echo "event: update".PHP_EOL;
        echo "data: ";
        $data = [];
        $data['id'] = $id;
        if ($this->product_store[$id]['name'] !== $product['name']) {
            $data['name'] = $product['name'];
            $this->product_store[$id]['name'] = $product['name'];
        }
        if ($this->product_store[$id]['price'] !== $product['price']) {
            $data['price'] = $product['price'];
            $this->product_store[$id]['price'] = $product['price'];
        }
        if ($this->product_store[$id]['stock'] !== $product['stock']) {
            $data['stock'] = $product['stock'];
            $this->product_store[$id]['stock'] = $product['stock'];
        }
        echo json_encode($data);
        echo PHP_EOL.PHP_EOL;
        ob_flush();
        flush();
    }

    /**
     * 處理刪除事件
     * @param $id
     * @param $product
     */
    function deleteHandler($id, $product)
    {
        $product = $this->product_store[$id];
        echo "event: delete".PHP_EOL;
        echo 'data: {"id": "'.$id.'", "name": "'.$product['name'].'", "price": "'.$product['price'].'", "stock": "'.$product['stock'].'"}';
        echo PHP_EOL.PHP_EOL;
        ob_flush();
        flush();
        unset($this->product_store[$id]);
    }
}
$client = new Predis\Async\Client('tcp://127.0.0.1:6379');
$client_sync = new Predis\Client('tcp://127.0.0.1:6379');

$local_storage = new LocalStorage();
$local_storage->init($client_sync);

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");

/**
 * 註冊處理 keyspace 異動的事件，並根據事件的訊息做相應的處理
 */
$client->connect(function ($client) use ($client_sync, $local_storage) {

    // 使用 psubscribe 訂閱 product:#id 這種樣式的 key 被異動的事件
    $client->pubSubLoop(['psubscribe'=>'__keyspace@*__:product:*'],
        function ($event, $pubsub) use ($client_sync, $local_storage) {
            // 當 product:#id 被異動的時候，根據事件發生的 channel 的名稱取得 key 的名稱和 product 的 id
            if (preg_match('/__keyspace@\d+__:(product:(\d+))/', $event->channel, $matches)) {
                $product_key = $matches[1];
                $product_id = $matches[2];
                // 取得被異動後，最新的 product 資料
                $product = $client_sync->hgetall($product_key);
                // 根據事件傳來的訊息得知操作 key 的類型
                $op = $event->payload;
                if ($op === 'del') {
                    $local_storage->deleteHandler($product_id, $product);
                } else if ($op === 'hset') {
                    // 當操作類型是 hset 的時候，需要從目前的 product store 去判斷是新增還是修改
                    if ($local_storage->contains($product_id)) {
                        $local_storage->updateHandler($product_id, $product);
                    } else {
                        $local_storage->insertHandler($product_id,$product);
                    }
                }
                if ($op === 'quit') {
                    $pubsub->quit();
                }
            }
        });
});
// 開始監聽 keyspace 異動事件
$client->getEventLoop()->run();


/*$descriptorspec = array(
    1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
);
if (ob_get_level())
    ob_end_clean();
$cwd = '/home/simon/demos/server-send-event/';
$env = array();
$process = proc_open('php notifier.php', $descriptorspec, $pipes, $cwd, $env);
$fout = fopen("php://output","w");
if( $fout ) {
    stream_copy_to_stream($pipes[1], $fout);
}*/
