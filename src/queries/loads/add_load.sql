START TRANSACTION;

INSERT INTO `loads`
(
    [#if weight]`weight`, [/if weight]
    [#if handling]`handling`, [/if handling]
    [#if hazmat]`hazmat`, `unNumber`, [/if hazmat]
    [#if commodity]`commodity`, [/if commodity]
    [#if value]`value`, [/if value]
    `customer`
)
VALUES
(
    [#if weight]{{ weight }}, [/if weight]
    [#if handling]{{ handling }}, [/if handling]
    [#if hazmat]{{ hazmat }}, {{ unNumber }}, [/if hazmat]
    [#if commodity]{{ commodity }}, [/if commodity]
    [#if value]{{ value }}, [/if value]
    {{ customer }}
);
SET @new_load_number = LAST_INSERT_ID();
[#for stops]
INSERT INTO `stops` (
    `loadId`, `action`, `whsId`, `earlyTime`, `earlyDate`, `lateTime`, `lateDate`
)
VALUES(
    @new_load_number, [action], [whsId], "[earlyTime]", "[earlyDate]", "[lateTime]", "[lateDate]"
);
[/stops]

COMMIT;
