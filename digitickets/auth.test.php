<?php

require __DIR__ . '/auth.php';

function check(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

$directory = sys_get_temp_dir() . '/digitickets-test-' . bin2hex(random_bytes(8));
mkdir($directory, 0700);
$keyPath = $directory . '/api-key';

try {
    $requests = 0;
    $success = function ($username, $password) use (&$requests) {
        $requests++;
        check($username === 'user' && $password === 'pass', 'Credentials were not passed to the request.');
        return [200, json_encode(['success' => true, 'user' => ['apiKey' => 'example-key']])];
    };
    authenticate('user', 'pass', $keyPath, $success);
    check(file_get_contents($keyPath) === 'example-key', 'The key was not saved.');
    check((fileperms($keyPath) & 0777) === 0600, 'The key file is not private.');

    try {
        authenticate('user', 'pass', $keyPath, $success);
        throw new RuntimeException('Existing key was overwritten.');
    } catch (RuntimeException $error) {
        check(str_contains($error->getMessage(), 'already stored'), 'Unexpected existing-key error.');
    }
    check($requests === 1, 'Authentication was repeated.');
    unlink($keyPath);

    foreach ([
        fn () => [401, '{"message":"bad credentials"}'],
        fn () => [200, '{"success":false}'],
        fn () => [200, 'not json'],
    ] as $failure) {
        try {
            authenticate('user', 'pass', $keyPath, $failure);
            throw new RuntimeException('Invalid response was accepted.');
        } catch (RuntimeException $error) {
            check($error->getMessage() !== 'Invalid response was accepted.', $error->getMessage());
        }
        check(!file_exists($keyPath), 'A key was saved after a failed request.');
    }

    try {
        authenticate('', 'pass', $keyPath, $success);
        throw new RuntimeException('Missing credentials were accepted.');
    } catch (RuntimeException $error) {
        check(str_contains($error->getMessage(), 'must be set'), 'Unexpected missing-credentials error.');
    }
    echo "Authentication tests passed.\n";
} finally {
    if (file_exists($keyPath)) {
        unlink($keyPath);
    }
    rmdir($directory);
}
