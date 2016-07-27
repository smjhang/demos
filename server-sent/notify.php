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
    $client->pubSubLoop(['psubscribe'=>'__keyevent*__:*'], function ($event, $pubsub) {
        $op = '';
        if (preg_match('/__keyevent@\d+__:(.+)/',$event->channel, $matches)) {
            $op = $matches[1];
        }
        if ($op === 'expired') {
            $key = $event->payload;
            echo "$key is expired!";
        }
        if ($event->payload === 'quit') {
            $pubsub->quit();
        }
    });
});
$client->getEventLoop()->run();