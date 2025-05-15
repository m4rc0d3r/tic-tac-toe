-- @param {Int} $1:userId

SELECT users.*,
       sessions.last_accessed_at AS last_online_at
FROM users
INNER JOIN sessions ON users.id = sessions.user_id
WHERE users.id = $1
  AND sessions.last_accessed_at =
    (SELECT max(last_accessed_at)
     FROM sessions
     WHERE user_id = users.id)
