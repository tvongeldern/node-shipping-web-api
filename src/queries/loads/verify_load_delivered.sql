SELECT EXISTS

(
    SELECT `loadId`
    FROM `loads`
    WHERE `loadId`={{ load }}
    AND `status` >= <<load_statuses.delivered>>

    [#if vendor]
        AND ( `carrier`={{ vendor }} OR `customer`={{ vendor }} )
    [/if vendor]

    [#if reviewer]
        AND ( `carrier`={{ reviewer }} OR `customer`={{ reviewer }} )
    [/if reviewer]

)
AS `exists`;
