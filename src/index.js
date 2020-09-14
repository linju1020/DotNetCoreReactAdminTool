#!/usr/bin/env node

const yargs = require('yargs');
var fs = require('fs');
var DB = require('./db');
var PowerShell = require('./powershell');
const {
  getHomeCrossplatform,
  sleep, readinput_str, readinput_int, alertAndQuit, deleteFolderRecursive,
  createFieldsCodes, createFieldsCodesRemoveKey,
  writeFieldsCodes, writeFieldsCodesRemoveKey
} = require('./comm');



let argv = yargs
  .alias('s', 'save')
  .example('--s a.txt', '设置源文件')

  //.usage('Usage: --s <filename>')
  .epilog('copyright')
  .help().argv;
//console.log(argv);

var cmdpath = process.cwd();
var homepath = getHomeCrossplatform();
var dbfilepath = homepath + '/db.json';
//console.log(dbfilepath);

if (fs.existsSync(dbfilepath)) {
} else {
  fs.writeFileSync(dbfilepath, '');
}

if (argv._.length == 0) {
  var data = fs.readFileSync(dbfilepath).toString();
  if (data == null || data.length < 1) {
    alertAndQuit('没有任何数据链接信息！');
  } else {
    (async function () {
      var datas = JSON.parse(data);
      if (datas.length < 1)
        alertAndQuit('没有任何数据链接信息！');
      console.table(datas);
      var connection_index = readinput_int({ tip: 'Choose connection by index', max: datas.length });
      var choose_connection = datas[connection_index];

      var conString = `postgres://${choose_connection['userid']}:${choose_connection['userpwd']}@${choose_connection['ip']}:${choose_connection['port']}/${choose_connection['database']}`;
      var client = new DB();

      var tablenames;
      if (await client.setConnectStr(conString)) {
        tablenames = await client.getRows(
          "select tablename from pg_tables where schemaname='public'",
          []
        );
        if (tablenames != null) {
          console.table(tablenames);
        } else {
          alertAndQuit('read tablenames err');
        }
      }

      var table_index = readinput_int({ tip: 'Choose table by index', max: tablenames.length });
      var choose_tablename = tablenames[table_index].tablename;
      console.log(choose_tablename);

      var tablefields;
      if (await client.setConnectStr(conString)) {
        var tablefildsql =
          'SELECT a.attnum,' +
          ' a.attname AS field,' +
          ' t.typname AS type,' +
          ' a.attlen AS length,' +
          ' a.atttypmod AS lengthvar,' +
          ' a.attnotnull AS notnull,' +
          ' b.description AS comment' +
          ' FROM pg_class c,pg_attribute a' +
          ' LEFT OUTER JOIN pg_description b ON a.attrelid=b.objoid AND a.attnum = b.objsubid,' +
          ' pg_type t' +
          ` WHERE c.relname = '${choose_tablename}'` +
          ' and a.attnum > 0' +
          ' and a.attrelid = c.oid' +
          ' and a.atttypid = t.oid' +
          ' ORDER BY a.attnum;';
        tablefields = await client.getRows(tablefildsql, []);
        if (tablefields != null) {
          console.table(tablefields);
        } else {
          alertAndQuit('read table fields err');
        }
      }

      console.log('Choose the following function:');
      console.log('0. Create React-Admin template code');
      var function_number = readinput_int({ tip: 'Choose function by number' });
      switch (function_number) {
        case 0:
          // Create Template CODE    choose_tablename tablefields

          var Choose_tablename = choose_tablename[0].toUpperCase() + choose_tablename.substring(1, choose_tablename.length);//第一个字母大写
          var Namespace_Prefix = choose_connection['namespace_prefix'];
          var ModelFieldCode = createFieldsCodes(tablefields);
          var ModelFieldCodeRemoveKey = createFieldsCodesRemoveKey(tablefields);
          var WriteFieldCode = writeFieldsCodes(tablefields);
          var WriteFieldCodeRemoveKey = writeFieldsCodesRemoveKey(tablefields);

          var folderpath = await new PowerShell().BrowseForFolder('选择文件夹');
          console.log(`folderpath: ` + folderpath);

          deleteFolderRecursive(folderpath + '/' + choose_tablename);
          await sleep(50);
          // 创建文件夹
          fs.mkdirSync(folderpath + '/' + choose_tablename);
          await sleep(20);
          fs.mkdirSync(folderpath + '/' + choose_tablename + '/React-admin');
          await sleep(20);
          fs.mkdirSync(folderpath + '/' + choose_tablename + '/Domain');
          await sleep(20);
          fs.mkdirSync(folderpath + '/' + choose_tablename + '/CommandsQuerys');
          await sleep(20);
          fs.mkdirSync(folderpath + '/' + choose_tablename + '/CommandsQuerys' + '/' + choose_tablename);
          await sleep(20);

          new PowerShell().SavaFile(
            cmdpath,
            'tablename.js', choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename]
            ],
            folderpath + '/' + choose_tablename + '/React-admin'
          );
          new PowerShell().SavaFile(
            cmdpath,
            'tablename_ResetOrderNum.js', choose_tablename,
            [[/_tablename_/gm, choose_tablename]],
            folderpath + '/' + choose_tablename + '/React-admin'
          );

          //c#
          new PowerShell().SavaFile(
            cmdpath,
            'CMStablenameController.cs', choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, Namespace_Prefix]
            ],
            folderpath + '/' + choose_tablename
          );
          new PowerShell().SavaFile(
            cmdpath,
            'Domain/tablename.cs',
            choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, Namespace_Prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode]
            ],
            folderpath + '/' + choose_tablename
          );

          new PowerShell().SavaFile(
            cmdpath,
            'CommandsQuerys/tablename/Create.cs', choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, Namespace_Prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode], [/_ModelFieldCodeRemoveKey_/gm, ModelFieldCodeRemoveKey],
              [/_WriteFieldCode_/gm, WriteFieldCode], [/_WriteFieldCodeRemoveKey_/gm, WriteFieldCodeRemoveKey]
            ],
            folderpath + '/' + choose_tablename
          );
          new PowerShell().SavaFile(
            cmdpath,
            'CommandsQuerys/tablename/Delete.cs', choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, Namespace_Prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode], [/_ModelFieldCodeRemoveKey_/gm, ModelFieldCodeRemoveKey],
              [/_WriteFieldCode_/gm, WriteFieldCode], [/_WriteFieldCodeRemoveKey_/gm, WriteFieldCodeRemoveKey]
            ],
            folderpath + '/' + choose_tablename
          );
          new PowerShell().SavaFile(
            cmdpath,
            'CommandsQuerys/tablename/DeleteMany.cs', choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, Namespace_Prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode], [/_ModelFieldCodeRemoveKey_/gm, ModelFieldCodeRemoveKey],
              [/_WriteFieldCode_/gm, WriteFieldCode], [/_WriteFieldCodeRemoveKey_/gm, WriteFieldCodeRemoveKey]
            ],
            folderpath + '/' + choose_tablename
          );
          new PowerShell().SavaFile(
            cmdpath,
            'CommandsQuerys/tablename/GetList.cs', choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, Namespace_Prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode], [/_ModelFieldCodeRemoveKey_/gm, ModelFieldCodeRemoveKey],
              [/_WriteFieldCode_/gm, WriteFieldCode], [/_WriteFieldCodeRemoveKey_/gm, WriteFieldCodeRemoveKey]
            ],
            folderpath + '/' + choose_tablename
          );
          new PowerShell().SavaFile(
            cmdpath,
            'CommandsQuerys/tablename/GetMany.cs', choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, Namespace_Prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode], [/_ModelFieldCodeRemoveKey_/gm, ModelFieldCodeRemoveKey],
              [/_WriteFieldCode_/gm, WriteFieldCode], [/_WriteFieldCodeRemoveKey_/gm, WriteFieldCodeRemoveKey]
            ],
            folderpath + '/' + choose_tablename
          );
          new PowerShell().SavaFile(
            cmdpath,
            'CommandsQuerys/tablename/GetOne.cs', choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, Namespace_Prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode], [/_ModelFieldCodeRemoveKey_/gm, ModelFieldCodeRemoveKey],
              [/_WriteFieldCode_/gm, WriteFieldCode], [/_WriteFieldCodeRemoveKey_/gm, WriteFieldCodeRemoveKey]
            ],
            folderpath + '/' + choose_tablename
          );
          new PowerShell().SavaFile(
            cmdpath,
            'CommandsQuerys/tablename/ResetOrderNum.cs', choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, Namespace_Prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode], [/_ModelFieldCodeRemoveKey_/gm, ModelFieldCodeRemoveKey],
              [/_WriteFieldCode_/gm, WriteFieldCode], [/_WriteFieldCodeRemoveKey_/gm, WriteFieldCodeRemoveKey]
            ],
            folderpath + '/' + choose_tablename
          );
          new PowerShell().SavaFile(
            cmdpath,
            'CommandsQuerys/tablename/Update.cs', choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, Namespace_Prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode], [/_ModelFieldCodeRemoveKey_/gm, ModelFieldCodeRemoveKey],
              [/_WriteFieldCode_/gm, WriteFieldCode], [/_WriteFieldCodeRemoveKey_/gm, WriteFieldCodeRemoveKey]
            ],
            folderpath + '/' + choose_tablename
          );

          alertAndQuit('Create Template Success!');

          break;
        default:
          alertAndQuit('number Out of range');
          break;
      }
    })();
  }
}



if (argv._.length == 1) {
  var command1 = argv._[0].toLowerCase().trim();
  switch (command1) {
    case 'adddb':

      var namespace_prefix = readinput_str({ tip: 'Please enter the code namespace prefix', required: true });
      console.log(namespace_prefix);

      var ip = readinput_str({ tip: 'Please enter the database server IP address', defaultValue: '127.0.0.1' });
      console.log(ip);

      var port = readinput_str({ tip: 'Please enter the database server IP port', defaultValue: '5432' });
      console.log(port);

      var database = readinput_str({ tip: 'Please enter the database name', required: true });
      console.log(database);

      var userid = readinput_str({ tip: 'Please enter the database userid', required: true });
      console.log(userid);

      var userpwd = readinput_str({ tip: 'Please enter the database userpwd', required: true });

      console.log('Please confirm the following information:');
      console.log('     Namespace Prefix:' + namespace_prefix);
      console.log('     IP:' + ip);
      console.log('     Port:' + port);
      console.log('     Database:' + database);
      console.log('     UserId:' + userid);
      console.log('     UserPWD:' + userpwd);
      var confirm = readinput_str({ tip: 'y or n', defaultValue: 'y' });
      if (confirm.toLowerCase() != 'y') alertAndQuit('');
      else {
        var new_data = { namespace_prefix, ip, port, database, userid, userpwd };
        var old_data = fs.readFileSync(dbfilepath).toString().trim();
        var datas = old_data.length < 1 ? [] : JSON.parse(old_data);
        datas.push(new_data);
        //console.log(JSON.stringify(datas));
        fs.writeFileSync(dbfilepath, JSON.stringify(datas));
      }

      break;
    case 'cleardb':
      console.log('Please confirm clear all database connections!');
      var confirm = readinput_str({ tip: 'y or n', defaultValue: 'n' });
      if (confirm.toLowerCase() == 'y') {
        fs.writeFileSync(dbfilepath, '');
      }
      break;
    case 'removedb':
      var index = argv['i'];
      if (index == undefined) {
        alertAndQuit('Please confirm index number. Example: removedb 1');
      }
      index = parseInt(index);
      if (isNaN(index)) {
        alertAndQuit('index Must be a number');
      }

      var old_data = fs.readFileSync(dbfilepath).toString().trim();
      var datas = old_data.length < 1 ? [] : JSON.parse(old_data);
      if (index >= datas.length) {
        alertAndQuit('index Out of range');
      }

      console.log('Please confirm remove the following connection:');
      console.table(datas[index]);
      var confirm = readinput_str({ tip: 'y or n', defaultValue: 'n' });
      if (confirm.toLowerCase() == 'y') {
        datas.splice(index, 1); //remove one
        fs.writeFileSync(dbfilepath, JSON.stringify(datas));
      }
      break;
  }
  alertAndQuit();
}
