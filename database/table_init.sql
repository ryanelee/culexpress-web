-- C:\Users\zky>mysqldump -h rds1e0wd9yvtmno8zr54public.mysql.rds.aliyuncs.com -uculmaster -pCul2BestDev -t culexpress city province system system_role system_usertype cul_customertype cul_warehouse customer_messagetype cul_shipservice cul_shipservice_fee cul_warehouse cul_item_type> s.sql
use culexpress;

INSERT INTO `city` VALUES (1,1,1,'北京市'),(2,1,2,'天津市'),(3,1,3,'上海市'),(4,1,4,'重庆市'),(5,1,5,'石家庄市'),(6,2,5,'唐山市'),(7,3,5,'秦皇岛市'),(8,4,5,'邯郸市'),(9,5,5,'邢台市'),(10,6,5,'保定市'),(11,7,5,'张家口市'),(12,8,5,'承德市'),(13,9,5,'沧州市'),(14,10,5,'廊坊市'),(15,11,5,'衡水市'),(16,1,6,'太原市'),(17,2,6,'大同市'),(18,3,6,'阳泉市'),(19,4,6,'长治市'),(20,5,6,'晋城市'),(21,6,6,'朔州市'),(22,7,6,'晋中市'),(23,8,6,'运城市'),(24,9,6,'忻州市'),(25,10,6,'临汾市'),(26,11,6,'吕梁市'),(27,1,7,'台北市'),(28,2,7,'高雄市'),(29,3,7,'基隆市'),(30,4,7,'台中市'),(31,5,7,'台南市'),(32,6,7,'新竹市'),(33,7,7,'嘉义市'),(34,8,7,'台北县'),(35,9,7,'宜兰县'),(36,10,7,'桃园县'),(37,11,7,'新竹县'),(38,12,7,'苗栗县'),(39,13,7,'台中县'),(40,14,7,'彰化县'),(41,15,7,'南投县'),(42,16,7,'云林县'),(43,17,7,'嘉义县'),(44,18,7,'台南县'),(45,19,7,'高雄县'),(46,20,7,'屏东县'),(47,21,7,'澎湖县'),(48,22,7,'台东县'),(49,23,7,'花莲县'),(50,1,8,'沈阳市'),(51,2,8,'大连市'),(52,3,8,'鞍山市'),(53,4,8,'抚顺市'),(54,5,8,'本溪市'),(55,6,8,'丹东市'),(56,7,8,'锦州市'),(57,8,8,'营口市'),(58,9,8,'阜新市'),(59,10,8,'辽阳市'),(60,11,8,'盘锦市'),(61,12,8,'铁岭市'),(62,13,8,'朝阳市'),(63,14,8,'葫芦岛市'),(64,1,9,'长春市'),(65,2,9,'吉林市'),(66,3,9,'四平市'),(67,4,9,'辽源市'),(68,5,9,'通化市'),(69,6,9,'白山市'),(70,7,9,'松原市'),(71,8,9,'白城市'),(72,9,9,'延边朝鲜族自治州'),(73,1,10,'哈尔滨市'),(74,2,10,'齐齐哈尔市'),(75,3,10,'鹤岗市'),(76,4,10,'双鸭山市'),(77,5,10,'鸡西市'),(78,6,10,'大庆市'),(79,7,10,'伊春市'),(80,8,10,'牡丹江市'),(81,9,10,'佳木斯市'),(82,10,10,'七台河市'),(83,11,10,'黑河市'),(84,12,10,'绥化市'),(85,13,10,'大兴安岭地区'),(86,1,11,'南京市'),(87,2,11,'无锡市'),(88,3,11,'徐州市'),(89,4,11,'常州市'),(90,5,11,'苏州市'),(91,6,11,'南通市'),(92,7,11,'连云港市'),(93,8,11,'淮安市'),(94,9,11,'盐城市'),(95,10,11,'扬州市'),(96,11,11,'镇江市'),(97,12,11,'泰州市'),(98,13,11,'宿迁市'),(99,1,12,'杭州市'),(100,2,12,'宁波市'),(101,3,12,'温州市'),(102,4,12,'嘉兴市'),(103,5,12,'湖州市'),(104,6,12,'绍兴市'),(105,7,12,'金华市'),(106,8,12,'衢州市'),(107,9,12,'舟山市'),(108,10,12,'台州市'),(109,11,12,'丽水市'),(110,1,13,'合肥市'),(111,2,13,'芜湖市'),(112,3,13,'蚌埠市'),(113,4,13,'淮南市'),(114,5,13,'马鞍山市'),(115,6,13,'淮北市'),(116,7,13,'铜陵市'),(117,8,13,'安庆市'),(118,9,13,'黄山市'),(119,10,13,'滁州市'),(120,11,13,'阜阳市'),(121,12,13,'宿州市'),(122,13,13,'巢湖市'),(123,14,13,'六安市'),(124,15,13,'亳州市'),(125,16,13,'池州市'),(126,17,13,'宣城市'),(127,1,14,'福州市'),(128,2,14,'厦门市'),(129,3,14,'莆田市'),(130,4,14,'三明市'),(131,5,14,'泉州市'),(132,6,14,'漳州市'),(133,7,14,'南平市'),(134,8,14,'龙岩市'),(135,9,14,'宁德市'),(136,1,15,'南昌市'),(137,2,15,'景德镇市'),(138,3,15,'萍乡市'),(139,4,15,'九江市'),(140,5,15,'新余市'),(141,6,15,'鹰潭市'),(142,7,15,'赣州市'),(143,8,15,'吉安市'),(144,9,15,'宜春市'),(145,10,15,'抚州市'),(146,11,15,'上饶市'),(147,1,16,'济南市'),(148,2,16,'青岛市'),(149,3,16,'淄博市'),(150,4,16,'枣庄市'),(151,5,16,'东营市'),(152,6,16,'烟台市'),(153,7,16,'潍坊市'),(154,8,16,'济宁市'),(155,9,16,'泰安市'),(156,10,16,'威海市'),(157,11,16,'日照市'),(158,12,16,'莱芜市'),(159,13,16,'临沂市'),(160,14,16,'德州市'),(161,15,16,'聊城市'),(162,16,16,'滨州市'),(163,17,16,'菏泽市'),(164,1,17,'郑州市'),(165,2,17,'开封市'),(166,3,17,'洛阳市'),(167,4,17,'平顶山市'),(168,5,17,'安阳市'),(169,6,17,'鹤壁市'),(170,7,17,'新乡市'),(171,8,17,'焦作市'),(172,9,17,'濮阳市'),(173,10,17,'许昌市'),(174,11,17,'漯河市'),(175,12,17,'三门峡市'),(176,13,17,'南阳市'),(177,14,17,'商丘市'),(178,15,17,'信阳市'),(179,16,17,'周口市'),(180,17,17,'驻马店市'),(181,18,17,'济源市'),(182,1,18,'武汉市'),(183,2,18,'黄石市'),(184,3,18,'十堰市'),(185,4,18,'荆州市'),(186,5,18,'宜昌市'),(187,6,18,'襄樊市'),(188,7,18,'鄂州市'),(189,8,18,'荆门市'),(190,9,18,'孝感市'),(191,10,18,'黄冈市'),(192,11,18,'咸宁市'),(193,12,18,'随州市'),(194,13,18,'仙桃市'),(195,14,18,'天门市'),(196,15,18,'潜江市'),(197,16,18,'神农架林区'),(198,17,18,'恩施土家族苗族自治州'),(199,1,19,'长沙市'),(200,2,19,'株洲市'),(201,3,19,'湘潭市'),(202,4,19,'衡阳市'),(203,5,19,'邵阳市'),(204,6,19,'岳阳市'),(205,7,19,'常德市'),(206,8,19,'张家界市'),(207,9,19,'益阳市'),(208,10,19,'郴州市'),(209,11,19,'永州市'),(210,12,19,'怀化市'),(211,13,19,'娄底市'),(212,14,19,'湘西土家族苗族自治州'),(213,1,20,'广州市'),(214,2,20,'深圳市'),(215,3,20,'珠海市'),(216,4,20,'汕头市'),(217,5,20,'韶关市'),(218,6,20,'佛山市'),(219,7,20,'江门市'),(220,8,20,'湛江市'),(221,9,20,'茂名市'),(222,10,20,'肇庆市'),(223,11,20,'惠州市'),(224,12,20,'梅州市'),(225,13,20,'汕尾市'),(226,14,20,'河源市'),(227,15,20,'阳江市'),(228,16,20,'清远市'),(229,17,20,'东莞市'),(230,18,20,'中山市'),(231,19,20,'潮州市'),(232,20,20,'揭阳市'),(233,21,20,'云浮市'),(234,1,21,'兰州市'),(235,2,21,'金昌市'),(236,3,21,'白银市'),(237,4,21,'天水市'),(238,5,21,'嘉峪关市'),(239,6,21,'武威市'),(240,7,21,'张掖市'),(241,8,21,'平凉市'),(242,9,21,'酒泉市'),(243,10,21,'庆阳市'),(244,11,21,'定西市'),(245,12,21,'陇南市'),(246,13,21,'临夏回族自治州'),(247,14,21,'甘南藏族自治州'),(248,1,22,'成都市'),(249,2,22,'自贡市'),(250,3,22,'攀枝花市'),(251,4,22,'泸州市'),(252,5,22,'德阳市'),(253,6,22,'绵阳市'),(254,7,22,'广元市'),(255,8,22,'遂宁市'),(256,9,22,'内江市'),(257,10,22,'乐山市'),(258,11,22,'南充市'),(259,12,22,'眉山市'),(260,13,22,'宜宾市'),(261,14,22,'广安市'),(262,15,22,'达州市'),(263,16,22,'雅安市'),(264,17,22,'巴中市'),(265,18,22,'资阳市'),(266,19,22,'阿坝藏族羌族自治州'),(267,20,22,'甘孜藏族自治州'),(268,21,22,'凉山彝族自治州'),(269,1,23,'贵阳市'),(270,2,23,'六盘水市'),(271,3,23,'遵义市'),(272,4,23,'安顺市'),(273,5,23,'铜仁地区'),(274,6,23,'毕节地区'),(275,7,23,'黔西南布依族苗族自治州'),(276,8,23,'黔东南苗族侗族自治州'),(277,9,23,'黔南布依族苗族自治州'),(278,1,24,'海口市'),(279,2,24,'三亚市'),(280,3,24,'五指山市'),(281,4,24,'琼海市'),(282,5,24,'儋州市'),(283,6,24,'文昌市'),(284,7,24,'万宁市'),(285,8,24,'东方市'),(286,9,24,'澄迈县'),(287,10,24,'定安县'),(288,11,24,'屯昌县'),(289,12,24,'临高县'),(290,13,24,'白沙黎族自治县'),(291,14,24,'昌江黎族自治县'),(292,15,24,'乐东黎族自治县'),(293,16,24,'陵水黎族自治县'),(294,17,24,'保亭黎族苗族自治县'),(295,18,24,'琼中黎族苗族自治县'),(296,1,25,'昆明市'),(297,2,25,'曲靖市'),(298,3,25,'玉溪市'),(299,4,25,'保山市'),(300,5,25,'昭通市'),(301,6,25,'丽江市'),(302,7,25,'思茅市'),(303,8,25,'临沧市'),(304,9,25,'文山壮族苗族自治州'),(305,10,25,'红河哈尼族彝族自治州'),(306,11,25,'西双版纳傣族自治州'),(307,12,25,'楚雄彝族自治州'),(308,13,25,'大理白族自治州'),(309,14,25,'德宏傣族景颇族自治州'),(310,15,25,'怒江傈傈族自治州'),(311,16,25,'迪庆藏族自治州'),(312,1,26,'西宁市'),(313,2,26,'海东地区'),(314,3,26,'海北藏族自治州'),(315,4,26,'黄南藏族自治州'),(316,5,26,'海南藏族自治州'),(317,6,26,'果洛藏族自治州'),(318,7,26,'玉树藏族自治州'),(319,8,26,'海西蒙古族藏族自治州'),(320,1,27,'西安市'),(321,2,27,'铜川市'),(322,3,27,'宝鸡市'),(323,4,27,'咸阳市'),(324,5,27,'渭南市'),(325,6,27,'延安市'),(326,7,27,'汉中市'),(327,8,27,'榆林市'),(328,9,27,'安康市'),(329,10,27,'商洛市'),(330,1,28,'南宁市'),(331,2,28,'柳州市'),(332,3,28,'桂林市'),(333,4,28,'梧州市'),(334,5,28,'北海市'),(335,6,28,'防城港市'),(336,7,28,'钦州市'),(337,8,28,'贵港市'),(338,9,28,'玉林市'),(339,10,28,'百色市'),(340,11,28,'贺州市'),(341,12,28,'河池市'),(342,13,28,'来宾市'),(343,14,28,'崇左市'),(344,1,29,'拉萨市'),(345,2,29,'那曲地区'),(346,3,29,'昌都地区'),(347,4,29,'山南地区'),(348,5,29,'日喀则地区'),(349,6,29,'阿里地区'),(350,7,29,'林芝地区'),(351,1,30,'银川市'),(352,2,30,'石嘴山市'),(353,3,30,'吴忠市'),(354,4,30,'固原市'),(355,5,30,'中卫市'),(356,1,31,'乌鲁木齐市'),(357,2,31,'克拉玛依市'),(358,3,31,'石河子市　'),(359,4,31,'阿拉尔市'),(360,5,31,'图木舒克市'),(361,6,31,'五家渠市'),(362,7,31,'吐鲁番市'),(363,8,31,'阿克苏市'),(364,9,31,'喀什市'),(365,10,31,'哈密市'),(366,11,31,'和田市'),(367,12,31,'阿图什市'),(368,13,31,'库尔勒市'),(369,14,31,'昌吉市　'),(370,15,31,'阜康市'),(371,16,31,'米泉市'),(372,17,31,'博乐市'),(373,18,31,'伊宁市'),(374,19,31,'奎屯市'),(375,20,31,'塔城市'),(376,21,31,'乌苏市'),(377,22,31,'阿勒泰市'),(378,1,32,'呼和浩特市'),(379,2,32,'包头市'),(380,3,32,'乌海市'),(381,4,32,'赤峰市'),(382,5,32,'通辽市'),(383,6,32,'鄂尔多斯市'),(384,7,32,'呼伦贝尔市'),(385,8,32,'巴彦淖尔市'),(386,9,32,'乌兰察布市'),(387,10,32,'锡林郭勒盟'),(388,11,32,'兴安盟'),(389,12,32,'阿拉善盟'),(390,1,33,'澳门特别行政区'),(391,1,34,'香港特别行政区');

INSERT INTO `province` VALUES (1,'北京市'),(2,'天津市'),(3,'上海市'),(4,'重庆市'),(5,'河北省'),(6,'山西省'),(7,'台湾省'),(8,'辽宁省'),(9,'吉林省'),(10,'黑龙江省'),(11,'江苏省'),(12,'浙江省'),(13,'安徽省'),(14,'福建省'),(15,'江西省'),(16,'山东省'),(17,'河南省'),(18,'湖北省'),(19,'湖南省'),(20,'广东省'),(21,'甘肃省'),(22,'四川省'),(23,'贵州省'),(24,'海南省'),(25,'云南省'),(26,'青海省'),(27,'陕西省'),(28,'广西壮族自治区'),(29,'西藏自治区'),(30,'宁夏回族自治区'),(31,'新疆维吾尔自治区'),(32,'内蒙古自治区'),(33,'澳门特别行政区'),(34,'香港特别行政区');

INSERT INTO `system` VALUES (1,'culwebapp','2015-10-10 20:41:30','super_admin'),(2,'culadminapp','2015-10-10 20:41:30','super_admin');

INSERT INTO `system_role` VALUES (1,'super_admin',1,'2015-10-10 20:41:30','super_admin'),(2,'culwebapp_admin',2,'2015-10-10 20:41:30','super_admin'),(3,'culadminapp_admin',3,'2015-10-10 20:41:30','super_admin'),(4,'culwebapp_customer',4,'2015-10-10 20:41:30','super_admin'),(5,'culadminapp_CA_user',5,'2015-10-10 20:41:30','super_admin'),(6,'culadminapp_CA_supervisor',6,'2015-10-10 20:41:30','super_admin'),(7,'culadminapp_DE_user',7,'2015-10-10 20:41:30','super_admin'),(8,'culadminapp_DE_supervisor',8,'2015-10-10 20:41:30','super_admin');

INSERT INTO `system_usertype` VALUES (1,'super_admin',1,'2015-10-10 20:41:30','super_admin'),(2,'culwebapp_admin',2,'2015-10-10 20:41:30','super_admin'),(3,'culadminapp_admin',3,'2015-10-10 20:41:30','super_admin'),(4,'normal_customer',4,'2015-10-10 20:41:30','super_admin'),(5,'or_admin',3,'2015-10-10 20:41:30','super_admin'),(6,'or_cs',3,'2015-10-10 20:41:30','super_admin');

INSERT INTO `cul_warehouse` VALUES (1,'美西加州洛杉矶(CA)收货地址','CA',1,'0',NULL,'626 542 3266','712 Nogales St',NULL,'City of industry','91748','CA','USA','发到加州仓库的各种食品,奶粉无美国购物消费税. 请大家在购物网站下单时一定记得写上姓后面的4个字母收件标示和单元号,单元号可以写在第一行地址后面也可以写在地址第二行.'),(2,'美国免税州特拉华(DE)收货地址','DE',1,'1',NULL,'626 542 3266','150 quigley Blvd',NULL,'New Castle','19720','DE','USA','发到DE免税州各种商品均无美国消费税.美东纽约机场直飞中国.包裹时效比加州仓库略多1-2个工作日.请大家在购物网站下单时一定记得写上姓后面的4个字母收件标示和单元号,单元号可以写在第一行地址后面也可以写在地址第二行.'),(3,'美国免税州俄勒冈(OR-CA)收货地址','OR-CA',1,'1',NULL,'626 542 3266','16710 SW 72nd Ave',NULL,'Portland','97224','OR','USA',NULL),(4,'美国俄勒冈仓库','OR',1,'1',NULL,'626 542 3266',NULL,NULL,NULL,NULL,'OR','USA',NULL);

INSERT INTO `customer_messagetype` VALUES (1,'业务咨询',1,NULL,'2015-10-18 21:47:30',NULL),(2,'包裹运费',1,NULL,'2015-10-18 21:47:30',NULL),(3,'包裹重量',1,NULL,'2015-10-18 21:47:30',NULL),(4,'包裹退货',1,NULL,'2015-10-18 21:47:30',NULL),(5,'包裹核对',1,NULL,'2015-10-18 21:47:30',NULL),(6,'包裹入库',1,NULL,'2015-10-18 21:47:30',NULL),(7,'包裹理赔',1,NULL,'2015-10-18 21:47:30',NULL),(8,'删除订单',1,NULL,'2015-10-18 21:47:30',NULL),(9,'包裹破损',1,NULL,'2015-10-18 21:47:30',NULL),(10,'错乱包裹',1,NULL,'2015-10-18 21:47:30',NULL),(11,'少收包裹',1,NULL,'2015-10-18 21:47:30',NULL),(12,'少收物品',1,NULL,'2015-10-18 21:47:30',NULL),(13,'USPS渠道',1,NULL,'2015-10-18 21:47:30',NULL),(14,'其它问题',1,NULL,'2015-10-18 21:47:30',NULL),(15,'系统操作',2,NULL,'2015-10-18 21:47:30',NULL),(16,'异常包裹',2,NULL,'2015-10-18 21:47:30',NULL),(17,'异常运单',2,NULL,'2015-10-18 21:47:30',NULL),(18,'财务问题',2,NULL,'2015-10-18 21:47:30',NULL),(19,'DE仓库少发漏发查询',4,NULL,'2015-10-18 21:47:30',NULL),(20,'DE仓库退货',4,NULL,'2015-10-18 21:47:30',NULL),(21,'CA仓库少发漏发查询',4,NULL,'2015-10-18 21:47:30',NULL),(22,'CA仓库退货',4,NULL,'2015-10-18 21:47:30',NULL),(23,'财务退款索赔',4,NULL,'2015-10-18 21:47:30',NULL),(24,'USPS渠道查件',4,NULL,'2015-10-18 21:47:30',NULL),(25,'客户部查件',4,NULL,'2015-10-18 21:47:30',NULL),(26,'其它疑难问题',4,NULL,'2015-10-18 21:47:30',NULL),(27,'订单留言',8,NULL,'2015-11-07 14:12:45',NULL);

INSERT INTO `cul_shipservice` VALUES (1,'标准包裹服务',4,0,0,'0.03','10-15个工作日',1.00,10.00,'低于最小起运重量，均按照首磅价格计费','除电子类自用物品','标准包裹服务,由我们公司决定转运渠道.每个包裹不超过10磅.','不要身份证，不能发化妆品和电子产品，建议7-10磅','不要身份证，不能发化妆品和电子产品，建议7-10磅',NULL,0.05,2.00,0.10,0.10);

INSERT INTO `cul_shipservice_fee` VALUES (1,'A',1,52,30,NULL),(2,'B',1,52,30,NULL);

INSERT INTO `cul_item_type` VALUES (1,'食品','A',NULL),(2,'衣服','A',NULL),(3,'鞋子','A',NULL),(4,'餐具','A',NULL),(5,'包','A',NULL),(6,'电器','A',NULL),(7,'首饰','A',NULL),(8,'化妆品','B',NULL),(9,'表','A',NULL),(10,'音像文化','A',NULL),(11,'玩具','A',NULL);

INSERT INTO `cul_customertype` VALUES (1,'Normal','2015-10-10 20:41:48','super_admin');

INSERT INTO `culexpress`.`system_user`
(`userName`,
`emailAddress`,
`gender`,
`photo`,
`password`,
`customerNumber`,
`userTypeID`,
`roleID`,
`countryCode`,
`registerDate`
)
SELECT 'admin',	'admin@localhost.com', 'M', null, 
'3a83f7f1290c2e8a8ef5f28007e76a68a7734f7785a0f8a0e88426cee164c37767784c42e717f5950001fe3ea4510c5ccdb797300a53d4f4abff6147c6002f9f', null, 1, 1, 'USA', now();

INSERT INTO `culexpress`.`system_user`
(`userName`,
`emailAddress`,
`gender`,
`photo`,
`password`,
`customerNumber`,
`userTypeID`,
`roleID`,
`countryCode`,
`registerDate`
)
SELECT 'or_cs',	'or_cs@umiex.com', 'M', null, 
'3a83f7f1290c2e8a8ef5f28007e76a68a7734f7785a0f8a0e88426cee164c37767784c42e717f5950001fe3ea4510c5ccdb797300a53d4f4abff6147c6002f9f', null, 6, 3, 'USA', now();

INSERT INTO `culexpress`.`system_user`
(`userName`,
`emailAddress`,
`gender`,
`photo`,
`password`,
`customerNumber`,
`userTypeID`,
`roleID`,
`countryCode`,
`registerDate`
)
SELECT 'or_admin',	'or_admin@umiex.com', 'M', null, 
'3a83f7f1290c2e8a8ef5f28007e76a68a7734f7785a0f8a0e88426cee164c37767784c42e717f5950001fe3ea4510c5ccdb797300a53d4f4abff6147c6002f9f', null, 5, 3, 'USA', now()
