-- @param {String} $1:nicknamePrefix
-- @param {Int} $2:take
-- @param {Int} $3:skip

SELECT users.*,
       sessions.last_accessed_at AS last_online_at
FROM users
INNER JOIN sessions ON users.id = sessions.user_id
WHERE users.nickname LIKE $1
  AND sessions.last_accessed_at =
    (SELECT max(last_accessed_at)
     FROM sessions
     WHERE user_id = users.id)
LIMIT $2
OFFSET $3
