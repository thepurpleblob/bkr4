<?php

function requestApiKey(string $username, string $password): array
{
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query(['username' => $username, 'password' => $password]),
            'timeout' => 15,
            'ignore_errors' => true,
            'follow_location' => 0,
        ],
    ]);

    $response = file_get_contents('https://api.digitickets.co.uk/v2/users/auth', false, $context);
    if ($response === false) {
        throw new RuntimeException('Unable to contact DigiTickets.');
    }

    $statusLine = $http_response_header[0] ?? '';
    if (!preg_match('/^HTTP\/\S+ (\d{3})\b/', $statusLine, $match)) {
        throw new RuntimeException('DigiTickets returned an invalid HTTP response.');
    }
    return [(int) $match[1], $response];
}

function authenticate(string $username, string $password, string $keyPath, callable $request): void
{
    if ($username === '' || $password === '') {
        throw new RuntimeException('DIGITICKETS_USERNAME and DIGITICKETS_PASSWORD must be set.');
    }
    if (file_exists($keyPath)) {
        throw new RuntimeException('An API key is already stored; authentication was not repeated.');
    }

    [$status, $body] = $request($username, $password);
    if ($status !== 200) {
        throw new RuntimeException("DigiTickets authentication failed (HTTP $status).");
    }
    try {
        $result = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $error) {
        throw new RuntimeException('DigiTickets returned invalid JSON.', 0, $error);
    }
    $key = $result['user']['apiKey'] ?? null;
    if (($result['success'] ?? false) !== true || !is_string($key) || $key === '') {
        throw new RuntimeException('DigiTickets did not return a valid API key.');
    }

    $previousUmask = umask(0077);
    try {
        $file = fopen($keyPath, 'x');
    } finally {
        umask($previousUmask);
    }
    if ($file === false) {
        throw new RuntimeException('Could not create the API key file.');
    }
    try {
        if (fwrite($file, $key) !== strlen($key) || !fflush($file)) {
            throw new RuntimeException('Could not write the API key file.');
        }
    } catch (Throwable $error) {
        fclose($file);
        unlink($keyPath);
        throw $error;
    }
    fclose($file);
}
