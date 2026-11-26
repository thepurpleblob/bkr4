<?php

if ($_SERVER['REQUEST_METHOD'] === 'GET' && parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) === '/health') {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'ok'], JSON_THROW_ON_ERROR);
    return;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) === '/api/santa-availability') {
    require __DIR__ . '/santa-availability.php';
    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    try {
        echo json_encode(santaAvailability(), JSON_THROW_ON_ERROR);
    } catch (Throwable $error) {
        error_log('Santa availability: ' . $error->getMessage());
        http_response_code(502);
        echo json_encode(['error' => 'Availability is temporarily unavailable.'], JSON_THROW_ON_ERROR);
    }
    return;
}

http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not found'], JSON_THROW_ON_ERROR);
