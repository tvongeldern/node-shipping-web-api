INSERT INTO `users`
(
    `user_type`,
    [#if username]`username`, [/if username]
    [#if password]`password`, [/if password]
    [#if firstName]`first_name`, [/if firstName]
    [#if lastName]`last_name`, [/if lastName]
)
VALUES
(
    {{ type }},
    [#if username]"{{ username }}", [/if username]
    [#if password]"{{ password }}", [/if password]
    [#if firstName]"{{ firstName }}", [/if firstName]
    [#if lastName]"{{ lastName }}", [/if lastName]
);
