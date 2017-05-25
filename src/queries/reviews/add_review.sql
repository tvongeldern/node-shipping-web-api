INSERT INTO `reviews`
(
    `loadId`,
    [#if review] `review`, [/if review]
    [#if rating] `rating` [/if rating]
)
VALUES
(
    {{ load }},
    [#if review] "{{review}}", [/if review]
    [#if rating] "{{rating}}" [/if rating]
);
