SELECT EXISTS
(
    SELECT * FROM `users` WHERE username="{{ username }}"
)
AS `exists`;
