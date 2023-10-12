#!/usr/bin/env node

const yargs = require('yargs');
var fs = require('fs-extra');
var DB = require('./db');
var DB_MSSQL = require('./db_mssql');
var PowerShell = require('./powershell');
const {
  getHomeCrossplatform,
  sleep,
  readinput_str,
  readinput_int,
  alertAndQuit,
  createFieldsCodes,
  createFieldsCodesRemoveKey,
  writeFieldsCodes,
  writeFieldsCodesRemoveKey,
  createWebListCodes,
  createWebFormCodes,
  createJsClassFiledCodes,
} = require('./comm');



let argv = yargs
  //.alias('s', 'save')
  .example('Example Url ->', 'https://www.npmjs.com/package/dotnetcorereactadmintool')

  //.usage('Usage: --s <filename>')
  .epilog('copyright @ linju1020@sina.com')
  .help().argv;
//console.log(argv);

var dirpath = __dirname; //process.cwd();
var homepath = getHomeCrossplatform();
var dbfilepath = homepath + '/db.json';
//console.log(dbfilepath);

if (fs.existsSync(dbfilepath)) { } else {
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
      var connection_index = readinput_int({
        tip: 'Choose connection by index',
        max: datas.length
      });
      var choose_connection = datas[connection_index];
      // console.log('choose_connection', choose_connection)

      var choose_tablename = '';
      var conString = ''; var client;
      if (choose_connection.IsMsSQL == true) {
        conString = {
          user: choose_connection['userid'],
          password: choose_connection['userpwd'],
          database: choose_connection['database'],
          server: choose_connection['ip'],
          pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
          },
          options: {
            encrypt: false//必须加上
          }
        }
        client = new DB_MSSQL();
        var tablenames;
        if (client.setConnectStr(conString)) {
          tablenames = await client.getRows(
            "Select Name FROM SysObjects Where XType='U' orDER BY Name",
            []
          );
          if (tablenames != null) {
            console.table(tablenames);
          } else {
            alertAndQuit('read tablenames err');
          }
        }

        var table_index = readinput_int({
          tip: 'Choose table by index',
          max: tablenames.length
        });
        choose_tablename = tablenames[table_index].Name;
        console.log(choose_tablename);

        var tablefields;
        var tablefildsql = `
                  SELECT      
                      SC.name field, 
                      SC.colid [index], 
                      ST.name [type] 
                  FROM        
                      sysobjects   SO, -- 对象表 
                      syscolumns   SC, -- 列名表 
                      systypes     ST  -- 数据类型表  
                  WHERE         
                      SO.id = SC.id  
                      AND   SC.xtype = ST.xusertype 
                      AND   SO.name = '${choose_tablename}' 
                  ORDER BY   SC.colorder       `;
        tablefields = await client.getRows(tablefildsql);
        if (tablefields != null) {
          console.table(tablefields);
        } else {
          alertAndQuit('read table fields err');
        }

      }
      else {
        conString = `postgres://${choose_connection['userid']}:${choose_connection['userpwd']}@${choose_connection['ip']}:${choose_connection['port']}/${choose_connection['database']}`;
        client = new DB();


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

        var table_index = readinput_int({
          tip: 'Choose table by index',
          max: tablenames.length
        });
        choose_tablename = tablenames[table_index].tablename;
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
      }

      console.log('Choose the following function:');
      console.log('0. Create Standard React-Admin template code (SqlSugar)');
      console.log('1. Create Concise React-Admin template code (SqlSugar)');
      console.log('2. Create Table SqlSugar CRUD template code');
      console.log('3. Create Standard React-Admin(V4) template code (SqlSugar)');
      var function_number = readinput_int({
        tip: 'Choose function by number'
      });

      // Create Template CODE    choose_tablename tablefields
      var Choose_tablename = choose_tablename[0].toUpperCase() + choose_tablename.substring(1, choose_tablename.length); //第一个字母大写
      var controller_namespace_prefix = choose_connection['controller_namespace_prefix'];
      var commandsquerys_namespace_prefix = choose_connection['commandsquerys_namespace_prefix'];
      var model_namespace_prefix = choose_connection['model_namespace_prefix'];

      var ModelFieldCode = createFieldsCodes(tablefields);
      var ModelFieldCodeRemoveKey = createFieldsCodesRemoveKey(tablefields);
      var WriteFieldCode = writeFieldsCodes(tablefields);
      var WriteFieldCodeRemoveKey = writeFieldsCodesRemoveKey(tablefields);

      var _createWebListCodes = createWebListCodes(tablefields);
      var _createWebFormCodes = createWebFormCodes(tablefields);
      var _createJsClassFiledCodes = createJsClassFiledCodes(tablefields);

      switch (function_number) {
        case 0:
        case 1:
        case 3:

          var folderpath = await new PowerShell().BrowseForFolder('选择文件夹');
          console.log(`folderpath: ` + folderpath);
          console.log(`dirpath: ` + dirpath);

          //deleteFolderRecursive(folderpath + '/' + choose_tablename);
          fs.removeSync(folderpath + '/' + choose_tablename);

          await sleep(50);
          // 创建文件夹
          //fs.mkdirSync(folderpath + '/' + choose_tablename);
          //await sleep(20);
          fs.ensureDirSync(folderpath + '/' + Choose_tablename + '/React-admin');
          await sleep(20);
          fs.ensureDirSync(folderpath + '/' + Choose_tablename + '/Domain');
          await sleep(20);
          //fs.mkdirSync(folderpath + '/' + Choose_tablename + '/CommandsQuerys');
          //await sleep(20);
          fs.ensureDirSync(folderpath + '/' + Choose_tablename + '/CommandsQuerys' + '/' + Choose_tablename);
          await sleep(20);

          //js
          new PowerShell().SavaFile(
            dirpath,
            function_number == 1 ? 'tablename2.js' : (function_number == 3 ? 'tablename_v4.tsx' : 'tablename.js'),
            choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/_createWebListCodes_/gm, _createWebListCodes],
              [/_createWebFormCodes_/gm, _createWebFormCodes],
              [/_createJsClassFiledCodes_/gm, _createJsClassFiledCodes]
            ],
            folderpath + '/' + choose_tablename + '/React-admin'
          );
          new PowerShell().SavaFile(
            dirpath,
            'tablename_ResetOrderNum.js', choose_tablename,
            [
              [/_tablename_/gm, choose_tablename]
            ],
            folderpath + '/' + choose_tablename + '/React-admin'
          );

          //c#
          new PowerShell().SavaFile(
            dirpath,
            'CMStablenameController.cs', Choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, controller_namespace_prefix]
            ],
            folderpath + '/' + choose_tablename
          );
          new PowerShell().SavaFile(
            dirpath,
            'Domain/tablename.cs',
            Choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@/gm, model_namespace_prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode]
            ],
            folderpath + '/' + choose_tablename
          );

          //合并成一个文件
          new PowerShell().SavaFile(
            dirpath,
            'CommandsQuerys/tablenameBLL.cs', Choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@@/gm, model_namespace_prefix],
              [/@@@/gm, commandsquerys_namespace_prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode],
              [/_ModelFieldCodeRemoveKey_/gm, ModelFieldCodeRemoveKey],
              [/_WriteFieldCode_/gm, WriteFieldCode],
              [/_WriteFieldCodeRemoveKey_/gm, WriteFieldCodeRemoveKey]
            ],
            folderpath + '/' + choose_tablename
          );

          alertAndQuit('Create Template Success!');

          break;
        case 2:
          new PowerShell().CreateFile(
            dirpath,
            'SqlSugar/CRUD.cs', Choose_tablename,
            [
              [/_tablename_/gm, choose_tablename],
              [/_Tablename_/gm, Choose_tablename],
              [/@@@@/gm, model_namespace_prefix],
              [/@@@/gm, commandsquerys_namespace_prefix],
              [/_ModelFieldCode_/gm, ModelFieldCode],
              [/_ModelFieldCodeRemoveKey_/gm, ModelFieldCodeRemoveKey],
              [/_WriteFieldCode_/gm, WriteFieldCode],
              [/_WriteFieldCodeRemoveKey_/gm, WriteFieldCodeRemoveKey]
            ]
          );

          alertAndQuit('Create Success!');
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

      var controller_namespace_prefix = readinput_str({
        tip: 'Please enter the code [Controller] namespace prefix',
        required: true
      });
      console.log(controller_namespace_prefix);
      var commandsquerys_namespace_prefix = readinput_str({
        tip: 'Please enter the code [CommandsQuerys] namespace prefix',
        required: true
      });
      console.log(commandsquerys_namespace_prefix);
      var model_namespace_prefix = readinput_str({
        tip: 'Please enter the code [Model] namespace prefix',
        required: true
      });
      console.log(model_namespace_prefix);

      var ip = readinput_str({
        tip: 'Please enter the database server IP address',
        defaultValue: '127.0.0.1'
      });
      console.log(ip);

      var port = readinput_str({
        tip: 'Please enter the database server IP port',
        defaultValue: '5432'
      });
      console.log(port);

      var database = readinput_str({
        tip: 'Please enter the database name',
        required: true
      });
      console.log(database);

      var userid = readinput_str({
        tip: 'Please enter the database userid',
        required: true
      });
      console.log(userid);

      var userpwd = readinput_str({
        tip: 'Please enter the database userpwd',
        required: true
      });

      var isMsSQL = readinput_str({
        tip: 'Is MSSQL? y or n',
        defaultValue: 'n'
      });
      if (isMsSQL.toLowerCase() != 'y') isMsSQL = 'n';

      console.log('Please confirm the following information:');
      console.log('     [Controller] Namespace Prefix:' + controller_namespace_prefix);
      console.log('     [CommandsQuerys] Namespace Prefix:' + commandsquerys_namespace_prefix);
      console.log('     [Model] Namespace Prefix:' + model_namespace_prefix);
      console.log('     IP:' + ip);
      console.log('     Port:' + port);
      console.log('     Database:' + database);
      console.log('     UserId:' + userid);
      console.log('     UserPWD:' + userpwd);
      var confirm = readinput_str({
        tip: 'y or n',
        defaultValue: 'y'
      });
      if (confirm.toLowerCase() != 'y') alertAndQuit('');
      else {
        var new_data = {
          controller_namespace_prefix,
          commandsquerys_namespace_prefix,
          model_namespace_prefix,
          ip,
          port,
          database,
          userid,
          userpwd
        };
        if (isMsSQL.toLowerCase() === 'y')
          new_data = { ...new_data, IsMsSQL: true };
        var old_data = fs.readFileSync(dbfilepath).toString().trim();
        var datas = old_data.length < 1 ? [] : JSON.parse(old_data);
        datas.push(new_data);
        //console.log(JSON.stringify(datas));
        fs.writeFileSync(dbfilepath, JSON.stringify(datas));
      }

      break;
    case 'cleardb':
      console.log('Please confirm clear all database connections!');
      var confirm = readinput_str({
        tip: 'y or n',
        defaultValue: 'n'
      });
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
      var confirm = readinput_str({
        tip: 'y or n',
        defaultValue: 'n'
      });
      if (confirm.toLowerCase() == 'y') {
        datas.splice(index, 1); //remove one
        fs.writeFileSync(dbfilepath, JSON.stringify(datas));
      }
      break;
  }
  alertAndQuit();
}