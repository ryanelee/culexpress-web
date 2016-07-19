'use strict'
//需要修改参数
/* 
	type:   1、翔通
			2、EMS
			3、顺丰	
	expressName: 快递名称
	trackingNumberRegion: 快递号段
 */
let type = 2,
    expressName = 'EMS',
    trackingNumberRegion = [100010, 100090];

//固定参数
let fs = require('fs'),
    filePath = 'd:\\trackingnumber_' + new Date().getTime() + '.txt',
    txt = 'insert cul_package_trackingnumber(type, expressName, trackingNumber) values',
    s = ',\r\n';

for (var i = trackingNumberRegion[0]; i <= trackingNumberRegion[1]; i++) {
    if (i === trackingNumberRegion[1])
        s = ';';
    txt += `(${type}, '${expressName}', ${i})${s}`;
}

fs.writeFile(filePath, txt, (err) => {
    if (err)
        console.error(filePath + "生成失败!");
    else
        console.error(filePath + "生成成功!");
});