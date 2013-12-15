<?php

require_once __DIR__.'/../vendor/autoload.php';

use Johnsn\GuerrillaMail\GuerrillaConnect\CurlConnection;
use Johnsn\GuerrillaMail\GuerrillaMail;

$app = new Silex\Application();

$app['gm.connection'] = function() {
    return new CurlConnection('127.0.0.1');
};

$app['gm.client'] = function($app) {
    return new GuerrillaMail($app['gm.connection']);
};

$app->register(new Silex\Provider\SessionServiceProvider());
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../views',
));

$app->get('new', function() use ($app) {
    $client = $app['gm.client'];

    $response = $client->get_email_address();

    var_dump($response);

    return true;
});

$app->get('/', function() use ($app) {
    return $app['twig']->render('index.twig');
});

$app->run();
