<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 7/27/16
 * Time: 10:17 PM
 */
require __DIR__.'/vendor/autoload.php';
$client = new Predis\Async\Client('tcp://127.0.0.1:6379');
$client->connect(function ($client) {
    echo "Connected to Redis, now listening for incoming messages...\n";
    $client->pubSubLoop(['psubscribe'=>'__keyspace@*__:*'], function ($event, $pubsub) {
        $op = '';
        if (preg_match('/__keyevent@\d+__:(.+)/',$event->channel, $matches)) {
            $op = $matches[1];
        }

            echo "{$event->channel}: {$event->payload}";

        if ($event->payload === 'quit') {
            $pubsub->quit();
        }
    });
});
$client->getEventLoop()->run();