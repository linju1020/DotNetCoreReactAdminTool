# DotNetCoreReactAdminTool （模板代码生成工具 .NetCore + React-Admin）

## 安装或升级
该工具是Nodejs命令行工具，安装方式如下（需全局安装）
```shell
npm install -g dotnetcorereactadmintool
```
## 查看版本
```shell
netcoretmt --version
```
## 查看帮助
```shell
netcoretmt --help
```
## 卸载
```shell
npm uninstall -g dotnetcorereactadmintool
```

## 怎样配置数据库链接信息

- 添加数据库链接信息
```shell
netcoretmt adddb
```

- 移除数据库链接信息
```shell
netcoretmt removedb -i <index>
```

- 清除所有数据库链接信息
```shell
netcoretmt cleardb
```

## 怎样使用

- 查看和生成模板代码
```shell
netcoretmt
```
