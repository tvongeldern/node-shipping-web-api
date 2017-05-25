CREATE TABLE `bids` (
  `bidId` bigint(20) NOT NULL AUTO_INCREMENT,
  `loadId` int(11) NOT NULL,
  `rate` int(6) NOT NULL,
  `weight` int(5) DEFAULT NULL,
  `handling` tinyint(1) DEFAULT NULL,
  `carrier` int(11) NOT NULL,
  `stopsAsIs` tinyint(1) DEFAULT '1',
  `driver` int(11) DEFAULT NULL,
  `counterTo` bigint(20) DEFAULT NULL,
  `bidAgent` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`bidId`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8