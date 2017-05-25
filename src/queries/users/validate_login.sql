SELECT EXISTS
(
    SELECT `userId` FROM `users` WHERE
    [#if username] `username`="{{username}}" [/if username]
    [#if userId] `userId`={{userId}} [/if userId]
    AND `password`="{{password}}"
)
AS `exists`
