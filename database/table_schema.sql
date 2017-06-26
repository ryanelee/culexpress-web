-- mysqldump -h rds1e0wd9yvtmno8zr54public.mysql.rds.aliyuncs.com -uculmaster -pCul2BestDev -d culexpress > s1.sql
-- mysqldump -h localhost -uroot -pCul2BestDev -d culexpress > s2.sql

use culexpress;

CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city_index` int(11) NOT NULL,
  `province_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=gbk;


CREATE TABLE `cul_customer` (
  `transactionNumber` int(8) NOT NULL AUTO_INCREMENT,
  `customerNumber` varchar(10) DEFAULT NULL,
  `customerType` int(4) NOT NULL DEFAULT '1',
  `receiveIdentity` varchar(10) DEFAULT NULL,
  `referenceUserEmailAddress` varchar(100) DEFAULT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `cellphoneNumber` varchar(50) DEFAULT NULL,
  `telephoneNumber` varchar(50) DEFAULT NULL,
  `QQ` varchar(100) DEFAULT NULL,
  `MSN` varchar(100) DEFAULT NULL,
  `taobaoWangwang` varchar(100) DEFAULT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zipcode` varchar(50) DEFAULT NULL,
  `stateOrProvince` varchar(100) DEFAULT NULL,
  `countrycode` varchar(5) DEFAULT 'CHN',
  `accountBalance` decimal(12,2) DEFAULT '0.00',
  `accountCurrencyCode` char(3) DEFAULT 'RMB',
  `myPoint` int(8) DEFAULT '0',
  `myPointStatus` char(1) DEFAULT 'A',
  `note` varchar(500) DEFAULT NULL,
  `registerDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `verifyMark` char(1) DEFAULT '0',
  `idCard` varchar(18) DEFAULT NULL,
  `totalPoint` int(11) DEFAULT '0',
  `totalCost` decimal(12,2) DEFAULT '0.00',
  `lastEditDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastEditUserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8;


CREATE TABLE `cul_customertype` (
  `customerTypeID` int(4) NOT NULL AUTO_INCREMENT,
  `customerTypeName` varchar(100) DEFAULT NULL,
  `lasteEditDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastEditUserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`customerTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `cul_inbound_package` (
  `transactionNumber` int(8) NOT NULL AUTO_INCREMENT,
  `customerNumber` varchar(10) NOT NULL,
  `status` varchar(45) DEFAULT 'Intransit' COMMENT 'Intransit - 在途;  Inbound - 入库;Onshelf - 上架;Offshelf - 下架;',
  `carrierName` varchar(45) DEFAULT NULL,
  `trackingNumber` varchar(45) DEFAULT NULL,
  `warehouseNumber` int(11) DEFAULT NULL,
  `packageDescription` varchar(200) DEFAULT NULL,
  `packageNote` varchar(200) DEFAULT NULL,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isTransfer` tinyint(1) DEFAULT '0',
  `packageWeight` decimal(12,2) DEFAULT '0.00',
  `warehouseNote` varchar(200) DEFAULT NULL,
  `inboundDate` datetime DEFAULT NULL,
  `inboundUserName` varchar(45) DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  `OnshelfDate` datetime DEFAULT NULL,
  `OnshelfUserName` varchar(45) DEFAULT NULL,
  `OffshelfDate` datetime DEFAULT NULL,
  `OffshelfUserName` varchar(45) DEFAULT NULL,
  `lastEditDate` datetime DEFAULT NULL,
  `lastEditUserName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`),
  UNIQUE KEY `customerNumber_trackingNumber_UNIQUE` (`customerNumber`,`trackingNumber`),
  UNIQUE KEY `trackingNumber_UNIQUE` (`trackingNumber`),
  KEY `customerNumber_trackingNumber_INDEX` (`customerNumber`,`trackingNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `cul_item_type` (
  `typeId` int(10) NOT NULL AUTO_INCREMENT,
  `typeName` varchar(50) DEFAULT NULL COMMENT '货物类型',
  `goodsCategory` varchar(45) DEFAULT NULL,
  `lastEditDate` datetime DEFAULT NULL,
  PRIMARY KEY (`typeId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `cul_order` (
  `transactionNumber` int(11) NOT NULL AUTO_INCREMENT,
  `customerNumber` varchar(10) NOT NULL,
  `orderNumber` varchar(20) NOT NULL COMMENT 'customerNumber + receiveIdentity + transactionNumber',
  `orderStatus` varchar(20) DEFAULT 'Unpaid' COMMENT 'Canceled - 取消, Unpaid - 未支付, Paid - 已支付, Processing - 处理中, WaybillUpdated - 运单更新,Arrears - 运费不足, Shipped - 已出库, Arrived - 已送达',
  `orderDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `payDate` datetime DEFAULT NULL,
  `shipServiceId` int(11) NOT NULL COMMENT '对应表cul_shipchannel的shipchannelId字段',
  `goodsCategory` varchar(20) NOT NULL,
  `declareGoodsValue` decimal(12,2) DEFAULT NULL,
  `declareGoodsName` varchar(500) DEFAULT NULL,
  `goodsCount` int(11) DEFAULT '0',
  `cartonCount` int(11) NOT NULL DEFAULT '0' COMMENT '发出箱子数',
  `pack_takeoutInvoice` tinyint(4) DEFAULT NULL,
  `pack_urgentProcess` tinyint(4) DEFAULT NULL,
  `pack_steadyInner` tinyint(4) DEFAULT NULL,
  `pack_replaceCarton` tinyint(4) DEFAULT NULL,
  `pack_removeInner` tinyint(4) DEFAULT NULL,
  `insuranceMark` tinyint(4) DEFAULT NULL,
  `insuranceFee` decimal(12,2) DEFAULT '0.00',
  `pointMark` tinyint(4) DEFAULT NULL,
  `usedPoint` int(11) DEFAULT '0',
  `pointCash` decimal(12,2) DEFAULT '0.00' COMMENT '积分抵扣',
  `tip` tinyint(4) DEFAULT '0',
  `shippingFee` decimal(12,2) DEFAULT '0.00',
  `stockingFee` decimal(12,2) DEFAULT '0.00',
  `transferringFee` decimal(12,2) DEFAULT '0.00',
  `goodsFee` decimal(12,2) DEFAULT '0.00',
  `exGoodsFee` decimal(12,2) DEFAULT '0.00',
  `totalCount` decimal(12,2) DEFAULT '0.00',
  `valueAddFee` decimal(12,2) DEFAULT '0.00',
  `couponNo` varchar(45) DEFAULT NULL,
  `priceAdjustMemo` varchar(45) DEFAULT NULL,
  `orderMessageNumber` varchar(45) NOT NULL,
  `orderType` int(11) DEFAULT '1' COMMENT '1 - 线上订单， 0 - 线下订单',
  `warehouseNumber` int(11) DEFAULT NULL,
  `inuserName` varchar(45) DEFAULT NULL,
  `printStatus` varchar(20) NOT NULL DEFAULT 'UnPrinted' COMMENT 'Printed - 已打印; UnPrinted - 未打印',
  `paied` decimal(12,2) DEFAULT '0.00',
  `lastEditDate` datetime DEFAULT NULL,
  `payType` int(11) DEFAULT NULL COMMENT '1 - 线上支付; 2 - 现金; 3 - 支票',
  `referenceOrderNumber` varchar(45) DEFAULT NULL,
  `batchNumber` varchar(45) DEFAULT NULL,
  `reference1` varchar(45) DEFAULT NULL,
  `reference2` varchar(45) DEFAULT NULL,
  `reference3` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=10000000 DEFAULT CHARSET=utf8;


CREATE TABLE `cul_order_inbound_package` (
  `transactionNumber` int(11) NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(45) NOT NULL,
  `receiveTrackingNumber` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `cul_order_item` (
  `transactionNumber` int(11) NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(20) NOT NULL,
  `itemBrand` varchar(200) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `unitprice` decimal(12,2) DEFAULT NULL,
  `upcCode` varchar(45) DEFAULT NULL,
  `category` varchar(45) NOT NULL DEFAULT 'A',
  `XTProductType` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `cul_order_outbound_package` (
  `transactionNumber` int(11) NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(20) NOT NULL,
  `trackingNumber` varchar(45) DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  `shippingFee` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` varchar(45) DEFAULT NULL,
  `actualWeight` decimal(12,2) DEFAULT NULL,
  `indate` datetime DEFAULT CURRENT_TIMESTAMP,
  `inuserName` varchar(45) DEFAULT NULL,
  `lastEditDate` datetime DEFAULT NULL,
  `lastEditUserName` varchar(45) DEFAULT NULL,
  `customerNumber` varchar(10) DEFAULT NULL,
  `cnExpressName` varchar(45) DEFAULT NULL,
  `cnTrackingNumber` varchar(45) DEFAULT NULL,
  `boxNumber` varchar(45) DEFAULT NULL,
  `palletNumber` varchar(45) DEFAULT NULL,
  `containerNumber` varchar(45) DEFAULT NULL,
  `xtTrackingNumber` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=100000000 DEFAULT CHARSET=utf8;


CREATE TABLE `cul_order_shiptoaddress` (
  `transactionNumber` int(11) NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(20) NOT NULL,
  `addressNumber` varchar(50) NOT NULL,
  `packageNumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `cul_order_track` (
  `transactionNumber` int(11) NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(20) NOT NULL,
  `operationUser` varchar(45) NOT NULL,
  `operationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `eventCode` int(11) NOT NULL,
  `note` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`,`operationDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `cul_outbound_package_track` (
  `transactionNumber` int(11) NOT NULL AUTO_INCREMENT,
  `trackingNumber` varchar(45) DEFAULT NULL,
  `orderNumber` varchar(20) NOT NULL,
  `operationUser` varchar(45) NOT NULL,
  `operationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `eventCode` int(11) NOT NULL,
  `note` varchar(500) DEFAULT NULL,
  `lastEditDate` datetime DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`,`operationDate`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `cul_package_container` (
  `transactionNumber` int(11) NOT NULL AUTO_INCREMENT,
  `containerNumber` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `type` int(11) DEFAULT NULL COMMENT '1 - 总单, 2 - pallet, 3 - box, 4 - bag, 5 - package',
  `indate` datetime DEFAULT NULL,
  `inuserName` varchar(45) DEFAULT NULL,
  `parentNumber` int(11) DEFAULT NULL,
  `lastEditDate` datetime DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `cul_shipservice` (
  `shipServiceId` int(11) NOT NULL AUTO_INCREMENT,
  `shipServiceName` varchar(30) NOT NULL COMMENT '服务名称服务名称',
  `warehouseNumber` int(4) DEFAULT NULL COMMENT '所在仓库',
  `needIDCard` tinyint(1) DEFAULT NULL COMMENT '是否提供身份证',
  `goodsCategoryAssociation` int(2) DEFAULT NULL COMMENT '关联转运商品类别',
  `preTariff` varchar(20) DEFAULT NULL COMMENT '预收关税比率(商品价值>$500)',
  `estimatedTime` varchar(80) DEFAULT NULL COMMENT '转运时效（工作日）',
  `minWeight` decimal(12,2) DEFAULT NULL COMMENT '最小起运重量（磅）',
  `maxWeight` decimal(12,2) DEFAULT NULL COMMENT '最大起运重量（磅）',
  `rules` varchar(120) DEFAULT NULL COMMENT '特殊计费规则',
  `recommend` varchar(100) DEFAULT NULL COMMENT '推荐转运商品类型',
  `serviceSummary` varchar(300) DEFAULT NULL COMMENT '服务简介',
  `serviceDetail` varchar(300) DEFAULT NULL COMMENT '服务详细描述',
  `attention` varchar(300) DEFAULT NULL COMMENT '注意事项',
  `lastEditDate` datetime DEFAULT NULL,
  `insuranceFeeRate` decimal(12,2) DEFAULT NULL COMMENT '自购保险计费比率',
  `incr_weight_per_split` decimal(12,2) DEFAULT NULL COMMENT '分箱每次增加重量(磅)',
  `split_roundup` decimal(12,2) DEFAULT NULL COMMENT '分箱小数点进位标准(>=x)',
  `merge_roundup` decimal(12,2) DEFAULT NULL COMMENT '合箱小数点进位标准(>=x)',
  PRIMARY KEY (`shipServiceId`),
  UNIQUE KEY `shipChannelName_UNIQUE` (`shipServiceName`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;


CREATE TABLE `cul_shipservice_fee` (
  `transactionNumber` int(10) NOT NULL AUTO_INCREMENT,
  `goodsCategory` varchar(50) DEFAULT NULL COMMENT '指转运商品类别:A,B,C类',
  `shipServiceId` int(6) DEFAULT NULL,
  `firstWeight` int(4) DEFAULT NULL,
  `continuedWeight` int(4) DEFAULT NULL,
  `lastEditDate` datetime DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;


CREATE TABLE `cul_warehouse` (
  `warehouseNumber` int(4) NOT NULL AUTO_INCREMENT,
  `warehouseName` varchar(100) DEFAULT NULL,
  `warehouseShortName` varchar(10) DEFAULT NULL,
  `warehouseType` int(4) DEFAULT '1',
  `isTaxFree` char(1) DEFAULT '0',
  `contactName` varchar(100) DEFAULT NULL,
  `contactPhoneNumber` varchar(50) DEFAULT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zipcode` varchar(50) DEFAULT NULL,
  `stateOrProvince` varchar(100) DEFAULT NULL,
  `countrycode` char(3) DEFAULT NULL,
  `note` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`warehouseNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `customer_finance_operationlog` (
  `transactionNumber` int(8) NOT NULL AUTO_INCREMENT,
  `customerNumber` varchar(10) DEFAULT NULL,
  `operationType` char(1) DEFAULT 'D',
  `orderNumber` varchar(20) DEFAULT NULL,
  `orderEmail` varchar(50) DEFAULT NULL,
  `orderChannel` int(4) DEFAULT NULL,
  `orderAmount` decimal(12,2) DEFAULT '0.00',
  `indate` datetime DEFAULT CURRENT_TIMESTAMP,
  `inuserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `customer_message` (
  `transactionNumber` int(8) NOT NULL AUTO_INCREMENT,
  `messageNumber` varchar(30) NOT NULL,
  `customerNumber` varchar(10) NOT NULL,
  `messageType` int(4) DEFAULT NULL,
  `status` char(1) DEFAULT NULL,
  `receivedWarehouseNumber` int(4) DEFAULT NULL,
  `receiveTrackingNumber` varchar(100) DEFAULT NULL,
  `SONumber` varchar(45) DEFAULT NULL,
  `deliveryTrackingNumber` varchar(100) DEFAULT NULL,
  `images` varchar(45) DEFAULT NULL,
  `message` varchar(5000) NOT NULL,
  `indate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `inuserName` varchar(200) DEFAULT NULL,
  `lastEditDate` datetime DEFAULT NULL,
  `lastEditUserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`),
  UNIQUE KEY `messageNumber_UNIQUE` (`messageNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `customer_message_operationlog` (
  `transactionNumber` int(8) NOT NULL AUTO_INCREMENT,
  `messageNumber` varchar(30) NOT NULL,
  `status` char(1) DEFAULT '1',
  `message` varchar(5000) NOT NULL,
  `operationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `operationUserName` varchar(200) DEFAULT NULL,
  `lastEditDate` datetime DEFAULT NULL,
  `lastEditUserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `customer_messagetype` (
  `typeID` int(4) NOT NULL AUTO_INCREMENT,
  `typeName` varchar(200) DEFAULT NULL,
  `typeIndex` int(4) DEFAULT NULL,
  `note` varchar(200) DEFAULT NULL,
  `indate` datetime DEFAULT CURRENT_TIMESTAMP,
  `inuserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`typeID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `customer_mypoint_operationlog` (
  `transactionNumber` int(8) NOT NULL AUTO_INCREMENT,
  `customerNumber` varchar(10) NOT NULL,
  `operationType` char(1) DEFAULT 'N',
  `point` int(8) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `indate` datetime DEFAULT CURRENT_TIMESTAMP,
  `inuserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `customer_receiveaddress` (
  `transactionNumber` int(8) NOT NULL AUTO_INCREMENT,
  `customerNumber` varchar(10) NOT NULL,
  `receiveCompanyName` varchar(100) DEFAULT NULL,
  `receivePersonName` varchar(100) NOT NULL,
  `cellphoneNumber` varchar(50) DEFAULT NULL,
  `telephoneNumber` varchar(50) DEFAULT NULL,
  `note` varchar(200) DEFAULT NULL,
  `addressType` int(4) DEFAULT '1',
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zipcode` varchar(50) DEFAULT NULL,
  `stateOrProvince` varchar(100) DEFAULT NULL,
  `countryCode` char(3) DEFAULT 'CHN',
  `verifyMark` int(4) DEFAULT '0',
  `emailAddress` varchar(100) DEFAULT NULL,
  `idCard` varchar(18) DEFAULT NULL,
  `idCardFront` varchar(200) DEFAULT NULL,
  `idCardBack` varchar(200) DEFAULT NULL,
  `lastEditDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastEditUserName` varchar(200) DEFAULT NULL,
  `zone` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`transactionNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `province` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=gbk;


CREATE TABLE `system` (
  `systemID` int(11) NOT NULL AUTO_INCREMENT,
  `systemName` varchar(100) NOT NULL,
  `lastEditdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastEidtUserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`systemID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `system_function` (
  `functionID` int(11) NOT NULL AUTO_INCREMENT,
  `functionName` varchar(200) NOT NULL,
  `parentFunctionID` int(11) DEFAULT NULL,
  `systemID` int(11) NOT NULL DEFAULT '1',
  `lastEditdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastEditUserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`functionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `system_functiongroup` (
  `functionGroupID` int(11) NOT NULL AUTO_INCREMENT,
  `roleID` int(11) NOT NULL,
  `functionID` int(11) NOT NULL,
  `lastEditdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastEditUserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`functionGroupID`),
  KEY `Index_RoleID_FunctionID` (`functionID`,`roleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `system_role` (
  `roleID` int(11) NOT NULL AUTO_INCREMENT,
  `roleName` varchar(100) NOT NULL,
  `functionGroupID` int(11) NOT NULL,
  `LastEditdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `LastEditUserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`roleID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `system_user` (
  `userID` int(8) NOT NULL AUTO_INCREMENT,
  `userName` varchar(200) NOT NULL,
  `emailAddress` varchar(100) NOT NULL,
  `gender` char(1) DEFAULT 'F',
  `photo` varchar(200) DEFAULT NULL,
  `password` varchar(128) NOT NULL,
  `customerNumber` varchar(10) DEFAULT NULL,
  `userTypeID` int(4) DEFAULT '4',
  `roleID` int(8) NOT NULL DEFAULT '4',
  `countryCode` char(3) DEFAULT 'USA',
  `registerDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastEditdate` datetime DEFAULT NULL,
  `lastEditUserName` varchar(200) DEFAULT NULL,
  `active` int(4) DEFAULT '1',
  PRIMARY KEY (`userID`),
  UNIQUE KEY `emailAddress_UNIQUE` (`emailAddress`),
  UNIQUE KEY `userName_UNIQUE` (`userName`),
  KEY `index_userid_roleid` (`userID`,`roleID`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8;


CREATE TABLE `system_usertype` (
  `userTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `userTypeName` varchar(200) DEFAULT NULL,
  `defaultRoleID` int(11) DEFAULT '1',
  `lastEditdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastEditUserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`userTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


