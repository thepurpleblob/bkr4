<?php

require __DIR__ . '/auth.php';

try {
    $username = getenv('DIGITICKETS_USERNAME');
    $password = getenv('DIGITICKETS_PASSWORD');
    authenticate(
        $username === false ? '' : $username,
        $password === false ? '' : $password,
        '/var/lib/digitickets/api-key',
        'requestApiKey',
    );
    echo "Authentication succeeded; the API key was stored in the private Docker volume.\n";
} catch (Throwable $error) {
    fwrite(STDERR, "Authentication failed: " . $error->getMessage() . "\n");
    exit(1);
}
