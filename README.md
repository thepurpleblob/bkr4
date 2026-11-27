# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
# bkr4

Social sharing previews are generated during `npm run build` from published CMS
pages, events and specials. The build requires `VITE_CMS_ENDPOINT` and access to
the CMS. Rebuild and deploy after changing CMS content to update previews;
social platforms may also cache older previews. Pages without a carousel or
matching event image use the default railway image. The Nginx configuration
serves the generated metadata for page URLs.

For optional page-specific previews, add these nullable fields to the Directus
`Page` collection and allow the public role to read them:

- `og_title`: text; the complete social preview title.
- `og_description`: plain text; the social preview description.
- `og_image`: a single Directus file/image field; the selected image must be
  publicly accessible.

These fields also control the Twitter card. Blank or missing fields fall back
independently to the existing title, description and carousel/event/default
image choices. The fields are optional and need not exist in Directus. Rebuild
and deploy after adding them or changing their values.

## DigiTickets: initial authentication

Documentation link: https://api-doc.digitickets.co.uk/v2

The PHP container provides a read-only Santa availability demo. Docker Compose
starts it with the web service and restarts it automatically; authentication
still requires the one-time command below.

### Configure credentials

Create `.env.digitickets` in the project root, and restrict its permissions:

```sh
touch .env.digitickets
chmod 600 .env.digitickets
```

Edit it locally, replacing the placeholders with your credentials:

```dotenv
DIGITICKETS_USERNAME='your username'
DIGITICKETS_PASSWORD='your password'
```

Compose supports single-quoted literal values; escape a single quote inside a
value as `\'`. Do not put credentials in the tracked `.env`, commit them, or
share the file. `.env.digitickets` is excluded from Git and Docker build
contexts. Container environment variables remain accessible to Docker
administrators on the host.

### Start and authenticate

```sh
docker compose up -d digitickets
docker compose exec digitickets php -r "echo file_get_contents('http://127.0.0.1:8080/health'), PHP_EOL;"
docker compose exec digitickets php authenticate.php
```

The health check should return `{"status":"ok"}`. It checks only the PHP
service, not the credentials or DigiTickets. Port 8080 in the container is
bound to `127.0.0.1:18080` on the host for the Vite development proxy. Nginx
routes the public availability endpoint to the container over the Docker network.

The authentication command sends the username and password to DigiTickets over
HTTPS. On success it stores the returned key in the `digitickets_key` Docker
volume, readable only by the file owner. It does not print the key. The command
will not make another authentication request while that file exists, because
DigiTickets documents authentication as a one-time request. If you have already
generated a key elsewhere, check with DigiTickets whether generating another
key affects it before running the command.

If credentials change, recreate the container to load them:

```sh
docker compose up -d --force-recreate digitickets
```

Recreating or stopping the container preserves the key volume. Do not remove
that volume or run `docker compose down -v` unless you intend to discard its
contents. Key expiration and renewal have not yet been implemented.

### Testing and troubleshooting

Run `php digitickets/auth.test.php` to test key storage and error handling
without contacting DigiTickets or using real credentials. PHP is required on
the host for this command.

Authentication errors are printed without the response body or key. Check that
the credentials file exists, has the correct names and has been loaded by a
recreated container. A network/DNS error or non-200 DigiTickets response is
reported as a failure; the command does not save a key in that case. Do not
paste credentials, API keys or unredacted responses into logs or issue reports.

### Santa availability demo

DigiTickets' `GET /v2/sessions` endpoint accepts an `eventCatID` filter, as
well as `dateStart` and `dateEnd`. It requires the API key as a Bearer token.
For example, event `42858` returned sessions named "Santa Steam Trains: Standard
Seating" when queried for 2026–2027. Each session included `sessionID`, `date`,
`time`, `capacity`, `spacesSold`, `spacesReserved` and `spacesAvailable`.

The unlinked `/santa-availability-demo` route displays December 2026 sessions.
It is a public URL, not access-controlled; Nginx asks search engines not to
index it. The current Santa information page is unchanged. The demo reads the
same-origin `GET /api/santa-availability` endpoint, which returns only dates,
times, availability labels and the last successful refresh time.

The endpoint combines standard seating (42858), quiet coach (80632) and private
compartments (43043) by date and departure time. The quiet coach only runs on
some departures. The percentage remaining is the sum of `spacesAvailable`
divided by the sum of `capacity`, multiplied by 100. A departure with missing
or invalid data in a returned session is shown as Unavailable; a missing
departure is shown as N/A.
Confirm that the session-level figures represent the intended ticket availability
before adding the table to the Santa page.

The temporary thresholds are configured in `digitickets/santa-availability.php`:
above 50% is Good, above 20% through 50% is Limited, and above zero through 20%
is Very Low. Zero available is Sold Out. The threshold constants can be changed
once the actual criteria are agreed.

Successful results are cached in the container for one hour; a restart clears
the cache. A failed refresh returns an error rather than showing expired data,
and subsequent refresh attempts wait one minute before retrying.
The API key is never sent to the browser. The demo handles API pagination and
displays an error if DigiTickets cannot be reached.

Run `php digitickets/santa-availability.test.php` for the availability and
pagination tests. For local Vite development, recreate the DigiTickets service
to apply the port mapping, then start Vite:

```sh
docker compose up -d --force-recreate digitickets
npm run dev
```

Open `/santa-availability-demo` on the Vite server; Vite proxies the API
request to port 18080. To deploy the demo with the web container, rebuild the
site and recreate the services:

```sh
docker compose up -d --build bkrailway digitickets
```
