// Checks a database connection before running migrations or the seed against it:
//   node scripts/check-db.mjs
// Reads DATABASE_URI from the environment (never from .env, so it can't silently
// test the local database). Prints where it connected, never the password.
/* eslint-disable no-console -- a command-line script reports to the terminal */
import pg from 'pg'

const uri = process.env.DATABASE_URI
if (!uri) {
  console.error('DATABASE_URI is not set in this terminal.')
  process.exit(1)
}

let target
try {
  const url = new URL(uri)
  target = `${url.username}@${url.hostname}:${url.port || 5432}${url.pathname}`
  if (uri.includes('YOUR-PASSWORD')) {
    console.error('The connection string still contains the [YOUR-PASSWORD] placeholder.')
    process.exit(1)
  }
} catch {
  console.error(
    'DATABASE_URI is not a valid URL. If the password has special characters, URL-encode them.',
  )
  process.exit(1)
}
console.log(`Connecting to ${target} ...`)

const client = new pg.Client({ connectionString: uri, connectionTimeoutMillis: 15000 })
try {
  await client.connect()
  const { rows } = await client.query(`
    select current_user,
           split_part(version(), ' ', 2) as postgres,
           exists (select 1 from information_schema.schemata where schema_name = 'payload') as payload_schema`)
  const info = rows[0]
  console.log(`Connected as ${info.current_user}, Postgres ${info.postgres}`)
  // This machine's own link (through the pooler, pg_stat_ssl would describe the pooler's).
  const encrypted = Boolean(client.connection?.stream?.encrypted)
  console.log(`Encrypted (SSL) from this machine: ${encrypted ? 'yes' : 'NO'}`)
  console.log(
    info.payload_schema
      ? 'The payload schema already exists (migrations have run before).'
      : 'Empty database: ready for migrations.',
  )
} catch (error) {
  const message = String(error?.message ?? error)
  console.error(`Connection failed: ${message}`)
  if (/ENOTFOUND|ENETUNREACH|EHOSTUNREACH/.test(message))
    console.error('Hint: the direct connection needs IPv6. Use the Session pooler string instead.')
  if (/password authentication failed/.test(message))
    console.error('Hint: wrong database password. Reset it under Database settings if unsure.')
  if (/Tenant or user not found/.test(message))
    console.error(
      'Hint: pooler user names look like postgres.<project-ref>. Copy the string again.',
    )
  if (/certificate/.test(message))
    console.error('Hint: check the sslrootcert path points at the downloaded Supabase certificate.')
  process.exitCode = 1
} finally {
  await client.end().catch(() => {})
}
