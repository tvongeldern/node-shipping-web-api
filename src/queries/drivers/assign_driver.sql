[#if bid]
UPDATE `bids`
SET `driver`={{ driver }}
WHERE `bidId`={{ bid }}
[/if bid]

[#if load]
UPDATE `loads`
SET `driver`={{ driver }}
WHERE `loadId`={{ load }}
[/if load]
