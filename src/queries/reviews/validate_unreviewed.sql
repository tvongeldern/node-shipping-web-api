SELECT EXISTS
(
    SELECT `reviewId`
    FROM `reviews`
    [#if vendor] WHERE `vendor`={{ vendor }} [/if vendor]
    [#if warehouse] WHERE `warehouse`={{ warehouse }} [/if warehouse]
    AND `reviewer`={{ reviewer }}
)
AS `exists`;
