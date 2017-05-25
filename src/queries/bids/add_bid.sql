START TRANSACTION;

INSERT INTO `bids`
(
    `loadId`, `rate`, `carrier`, `bidAgent`,
    [#if weight]`weight`, [/if weight]
    [#if handling]`handling`, [/if handling]
    [#if changes]`stopsAsIs`, [/if changes]
    [#if driver]`driver`, [/if driver]
    [#if counterTo]`counterTo`[/if counterTo]
)
VALUES
(
    {{ load }}, {{ rate }}, {{ carrier }}, {{ bidAgent }},
    [#if weight]"{{ weight }}", [/if weight]
    [#if handling]"{{ handling }}", [/if handling]
    [#if changes] 0, [/if changes]
    [#if driver]"{{ driver }}", [/if driver]
    [#if counterTo]"{{ counterTo }}"[/if counterTo]
);
SET @new_bid_number = LAST_INSERT_ID();
[#for changes]
INSERT INTO `bid_stop_adjustments`
(
    `bidId`, [stopId ? `stopId`,] [newTime ? `new_time`,] [newDate ? `new_date`,] [margin ? `plus_minus_minutes`]
)
VALUES
(
    @new_bid_number, [stopId ? "[stopId]"], [newTime ? "[newTime]"], [newDate ? "[newDate]"], [margin]
);
[/changes]

COMMIT;

SELECT @new_bid_number AS `insertId`;
