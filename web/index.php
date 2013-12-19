<?php

require_once __DIR__.'/../vendor/autoload.php';

use Johnsn\GuerrillaMail\Provider\Silex\GuerrillaServiceProvider as GuerrillaMailProvider;
use Symfony\Component\HttpFoundation\Request;

$app = new Silex\Application();
$app['debug'] = false;

$app->register(new Silex\Provider\SessionServiceProvider());
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../views',
));
$app->register(new GuerrillaMailProvider());

$app->before(function (Request $request) {
    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

$app->post('/me', function(Request $request) use ($app) {
    if(null === $user = $app['session']->get('user')) {
        return $app->json(array('message' => 'You are not logged in.'), 403);
    }

    $username = $request->get('username');
    $user = $app['gm.client']->set_email_address($user['sid_token'], $username);
    $app['session']->set('user', $user);

    $response = array(
        'user' => $user,
        'email' => $app['gm.client']->get_email_list($user['sid_token']),
    );

    return $app->json($response);
});

$app->get('/initialize', function() use ($app) {
    if(null === $user = $app['session']->get('user')) {
        $user = $app['gm.client']->get_email_address();
        $app['session']->set('user', $user);
    }

    $domainList = array();
    foreach($app['gm.client']->domains as $key => $value) {
        $domainList[] = array("id" => $key, "host" => $value);
    }

    $response = array(
        'user' => $user,
        'email' => $app['gm.client']->get_email_list($user['sid_token']),
        'domain_list' => $domainList,
    );

    return $app->json($response, 200);
});

$app->get('/', function() use ($app) {
    return $app['twig']->render('index.twig');
});

$app->run();