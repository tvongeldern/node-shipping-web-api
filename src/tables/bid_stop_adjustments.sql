CREATE TABLE `bid_stop_adjustments` (
  `adjustmentId` int(11) NOT NULL AUTO_INCREMENT,
  `bidId` int(20) NOT NULL,
  `stopId` int(11) NOT NULL,
  `new_time` time DEFAULT NULL,
  `new_date` date DEFAULT NULL,
  `plus_minus_minutes` int(4) DEFAULT '0',
  PRIMARY KEY (`adjustmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8