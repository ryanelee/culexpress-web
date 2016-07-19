环境依赖：
git、yo、grunt、bower；

运行方式:
1. 打开当前目录的cmd窗口
2. 安装依赖项:
	npm install
	bower install
3. 安装成功后，仍然在当前cmd窗口中输入grunt serve即可启动项目
4. 框架支持debug和release两种模式
	debug: 即上面说的grunt serve模式
	release: 输入grunt build命令编译，会在当前目录下生成dist文件夹。里面包含所有资源的压缩文件，并解决了浏览器缓存问题。