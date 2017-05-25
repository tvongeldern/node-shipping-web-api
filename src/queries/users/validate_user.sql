SELECT EXISTS
(
    SELECT * FROM `users` WHERE `userId`={{ uid }}
    [#if type] AND `user_type`={{ type }}[/if type]
)
AS `exists`;
