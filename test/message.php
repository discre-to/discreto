<?php
/**    _ _                 _
 *  __| (_)___ __ _ _ ___ | |_ ___
 * / _` | (_-</ _| '_/ -_)|  _/ _ \
 * \__,_|_/__/\__|_| \___(_)__\___/
 *
 * Copyright (c) 2022 - MIT License
 * Greg Deback <greg@discre.to>
 * <https://discre.to>
 *
 * XHR tests (utils)
 */

// ?nocors
// Return wrong Access-Control
if (isset($_GET['nocors'])) {
  header('Access-Control-Allow-Origin: elsewhere');
  exit;
}

// Add correct CORS header
$host = $_SERVER['HTTP_ORIGIN'] ?? '*';
header('Access-Control-Allow-Origin: ' . $host);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, *');

// Return 'GET' with status 404
if (isset($_GET['404'])) {
  header('HTTP/1.0 404 Page Not Found');
  echo "GET";
  exit;
}

// Return 'POST' with status 404
if (isset($_POST['404'])) {
  header('HTTP/1.0 404 Page Not Found');
  echo "POST";
  exit;
}

// Say hello with status 200
echo "Hello world";
exit;
