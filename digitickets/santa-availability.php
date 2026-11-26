<?php

const SANTA_EVENT_IDS = [42858, 80632, 43043];
const SANTA_START = '2026-12-01';
const SANTA_END = '2026-12-31';
const SANTA_GOOD_ABOVE_PERCENT = 50;
const SANTA_LIMITED_ABOVE_PERCENT = 20;
const SANTA_CACHE_SECONDS = 3600;
const SANTA_RETRY_SECONDS = 60;

function santaNextPage(array $headers, int $page): ?int
{
    foreach ($headers as $header) {
        if (stripos($header, 'Link:') !== 0) continue;
        if (preg_match('/<([^>]+)>;\s*rel="?next"?/i', $header, $match)) {
            $query = parse_url($match[1], PHP_URL_QUERY);
            if (!is_string($query)) throw new RuntimeException('Invalid DigiTickets pagination link.');
            parse_str($query, $params);
            $nextPage = filter_var($params['page'] ?? null, FILTER_VALIDATE_INT);
            if ($nextPage === false || $nextPage <= $page) {
                throw new RuntimeException('Invalid DigiTickets pagination link.');
            }
            return $nextPage;
        }
    }
    return null;
}

function fetchSantaSessions(int $eventId, string $key): array
{
    $sessions = [];
    $page = 1;
    do {
        $query = http_build_query([
            'eventCatID' => $eventId,
            'dateStart' => SANTA_START,
            'dateEnd' => SANTA_END,
            'status' => 'Active',
            'limit' => 100,
            'page' => $page,
        ]);
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => "Authorization: Bearer $key\r\nAccept: application/json\r\n",
                'timeout' => 15,
                'ignore_errors' => true,
                'follow_location' => 0,
            ],
        ]);
        $body = file_get_contents("https://api.digitickets.co.uk/v2/sessions?$query", false, $context);
        if ($body === false) {
            throw new RuntimeException("Unable to retrieve sessions for event $eventId.");
        }
        $headers = $http_response_header ?? [];
        if (!preg_match('/^HTTP\/\S+ 200\b/', $headers[0] ?? '')) {
            throw new RuntimeException("DigiTickets returned an error for event $eventId.");
        }
        $items = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($items) || !array_is_list($items)) {
            throw new RuntimeException("Invalid sessions response for event $eventId.");
        }
        array_push($sessions, ...$items);

        $page = santaNextPage($headers, $page);
    } while ($page !== null);
    return $sessions;
}

function buildSantaAvailability(array $sessionsByEvent, string $updatedAt): array
{
    $departures = [];
    $times = [];
    foreach ($sessionsByEvent as $eventId => $sessions) {
        foreach ($sessions as $session) {
            if (!is_array($session) || ($session['eventCatID'] ?? null) !== $eventId ||
                !is_string($session['date'] ?? null) || !preg_match('/^2026-12-\d{2}$/', $session['date']) ||
                !is_string($session['time'] ?? null) || !preg_match('/^\d{2}:\d{2}:\d{2}$/', $session['time'])) {
                throw new RuntimeException("Invalid session data for event $eventId.");
            }
            if (!is_string($session['status'] ?? null)) {
                throw new RuntimeException("Invalid session status for event $eventId.");
            }
            if ($session['status'] !== 'Active') continue;
            $date = $session['date'];
            $time = substr($session['time'], 0, 5);
            $times[$time] = true;
            $departure = &$departures[$date][$time];
            if (!isset($departure)) $departure = ['capacity' => 0, 'available' => 0, 'events' => [], 'valid' => true];
            $capacity = $session['capacity'] ?? null;
            $available = $session['spacesAvailable'] ?? null;
            if (isset($departure['events'][$eventId]) || !is_int($capacity) || $capacity <= 0 ||
                !is_int($available) || $available < 0 || $available > $capacity) {
                $departure['valid'] = false;
            } else {
                $departure['capacity'] += $capacity;
                $departure['available'] += $available;
            }
            $departure['events'][$eventId] = true;
            unset($departure);
        }
    }

    ksort($times);
    ksort($departures);
    $dates = [];
    foreach ($departures as $date => $day) {
        $levels = [];
        foreach ($day as $time => $departure) {
            if (!$departure['valid']) {
                $levels[$time] = 'unknown';
            } elseif ($departure['available'] === 0) {
                $levels[$time] = 'sold-out';
            } else {
                $percentage = $departure['available'] * 100 / $departure['capacity'];
                $levels[$time] = $percentage > SANTA_GOOD_ABOVE_PERCENT ? 'good' :
                    ($percentage > SANTA_LIMITED_ABOVE_PERCENT ? 'limited' : 'very-low');
            }
        }
        $dates[] = ['date' => $date, 'levels' => $levels];
    }
    return ['updatedAt' => $updatedAt, 'times' => array_keys($times), 'dates' => $dates];
}

function cachedSantaAvailability(string $cachePath, callable $refresh): array
{
    if (is_file($cachePath) && time() - filemtime($cachePath) < SANTA_CACHE_SECONDS) {
        return json_decode(file_get_contents($cachePath), true, 512, JSON_THROW_ON_ERROR);
    }
    $failurePath = $cachePath . '.failure';
    if (is_file($failurePath) && time() - filemtime($failurePath) < SANTA_RETRY_SECONDS) {
        throw new RuntimeException('Waiting to retry after an availability refresh failed.');
    }
    try {
        $result = $refresh();
        if (file_put_contents($cachePath, json_encode($result, JSON_THROW_ON_ERROR), LOCK_EX) === false) {
            throw new RuntimeException('Unable to write the availability cache.');
        }
    } catch (Throwable $error) {
        if (file_put_contents($failurePath, '', LOCK_EX) === false) {
            error_log('Santa availability: unable to write retry marker.');
        }
        throw $error;
    }
    return $result;
}

function santaAvailability(): array
{
    return cachedSantaAvailability(sys_get_temp_dir() . '/santa-availability.json', function () {
        $key = file_get_contents('/var/lib/digitickets/api-key');
        if ($key === false || trim($key) === '') throw new RuntimeException('DigiTickets API key is missing.');
        $sessions = [];
        foreach (SANTA_EVENT_IDS as $eventId) {
            $sessions[$eventId] = fetchSantaSessions($eventId, trim($key));
        }
        return buildSantaAvailability($sessions, gmdate('c'));
    });
}
