<?php

require __DIR__ . '/santa-availability.php';

function check(bool $condition, string $message): void
{
    if (!$condition) throw new RuntimeException($message);
}

function session(int $event, string $date, string $time, $capacity, $available): array
{
    return [
        'eventCatID' => $event, 'date' => $date, 'time' => $time, 'status' => 'Active',
        'capacity' => $capacity, 'spacesAvailable' => $available,
    ];
}

$result = buildSantaAvailability([
    42858 => [
        session(42858, '2026-12-05', '10:00:00', 100, 30),
        session(42858, '2026-12-05', '11:30:00', 100, 0),
        session(42858, '2026-12-05', '13:30:00', 100, 20),
        session(42858, '2026-12-05', '15:00:00', 100, 50),
        session(42858, '2026-12-06', '10:00:00', 0, 0),
    ],
    80632 => [session(80632, '2026-12-05', '10:00:00', 10, 10)],
    43043 => [session(43043, '2026-12-05', '10:00:00', 10, 10)],
], '2026-11-26T20:00:00+00:00');
check($result['times'] === ['10:00', '11:30', '13:30', '15:00'], 'Departure times were not sorted.');
check($result['dates'][0]['levels'] === [
    '10:00' => 'limited', '11:30' => 'sold-out', '13:30' => 'very-low', '15:00' => 'limited',
], 'Combined percentages or threshold boundaries were incorrect.');
check($result['dates'][1]['levels']['10:00'] === 'unknown', 'Zero capacity must be unknown.');
check(!isset($result['dates'][1]['levels']['15:00']), 'Missing departures must not be reported as sold out.');

$good = buildSantaAvailability([42858 => [session(42858, '2026-12-05', '10:00:00', 100, 51)]], 'now');
check($good['dates'][0]['levels']['10:00'] === 'good', 'Above 50 percent should be good.');
$duplicate = buildSantaAvailability([42858 => [
    session(42858, '2026-12-05', '10:00:00', 100, 50),
    session(42858, '2026-12-05', '10:00:00', 100, 50),
]], 'now');
check($duplicate['dates'][0]['levels']['10:00'] === 'unknown', 'Duplicate event sessions must be unknown.');

check(santaNextPage(['Link: <https://example.test/sessions?page=2>; rel="next"'], 1) === 2, 'Next page missing.');
check(santaNextPage(['Link: <https://example.test/sessions?page=1>; rel="prev"'], 2) === null, 'Unexpected next page.');
try {
    santaNextPage(['Link: <https://example.test/sessions?page=1>; rel="next"'], 1);
    throw new RuntimeException('Invalid pagination was accepted.');
} catch (RuntimeException $error) {
    check(str_contains($error->getMessage(), 'Invalid DigiTickets'), 'Unexpected pagination error.');
}

$directory = sys_get_temp_dir() . '/santa-test-' . bin2hex(random_bytes(8));
mkdir($directory, 0700);
$cachePath = $directory . '/cache.json';
try {
    $calls = 0;
    $refresh = function () use (&$calls) {
        $calls++;
        return ['updatedAt' => "refresh-$calls"];
    };
    check(cachedSantaAvailability($cachePath, $refresh)['updatedAt'] === 'refresh-1', 'Initial refresh failed.');
    check(cachedSantaAvailability($cachePath, $refresh)['updatedAt'] === 'refresh-1', 'Fresh cache was not reused.');
    touch($cachePath, time() - 29 * 60);
    clearstatcache(true, $cachePath);
    check(cachedSantaAvailability($cachePath, $refresh)['updatedAt'] === 'refresh-1', 'Cache expired before 30 minutes.');
    touch($cachePath, time() - 31 * 60);
    clearstatcache(true, $cachePath);
    check(cachedSantaAvailability($cachePath, $refresh)['updatedAt'] === 'refresh-2', 'Cache was not refreshed after 30 minutes.');
    touch($cachePath, time() - SANTA_CACHE_SECONDS);
    clearstatcache(true, $cachePath);
    check(cachedSantaAvailability($cachePath, $refresh)['updatedAt'] === 'refresh-3', 'Expired cache was not refreshed.');
    touch($cachePath, time() - SANTA_CACHE_SECONDS);
    clearstatcache(true, $cachePath);
    try {
        cachedSantaAvailability($cachePath, function () { throw new RuntimeException('Upstream error'); });
        throw new RuntimeException('Refresh failure was accepted.');
    } catch (RuntimeException $error) {
        check($error->getMessage() === 'Upstream error', 'Unexpected refresh failure.');
    }
    try {
        cachedSantaAvailability($cachePath, $refresh);
        throw new RuntimeException('Failed refresh was immediately retried.');
    } catch (RuntimeException $error) {
        check(str_contains($error->getMessage(), 'Waiting to retry'), 'Unexpected retry error.');
    }
    check($calls === 3, 'The failed refresh was retried too soon.');
} finally {
    if (file_exists($cachePath)) unlink($cachePath);
    if (file_exists($cachePath . '.failure')) unlink($cachePath . '.failure');
    rmdir($directory);
}
echo "Santa availability tests passed.\n";
