-- @param {Int} $1:userId
-- @param {Int} $2:take
-- @param {Int} $3:skip
SELECT
  *
FROM
  sessions
WHERE
  user_id = $1
  AND created_at + cast(maximum_age || ' second' AS INTERVAL) >= current_timestamp at TIME ZONE 'UTC'
LIMIT
  $2
OFFSET
  $3
