var fs = require('fs');
var readlineSync = require('readline-sync');
var DB = require('./db');
var PowerShell = require('./powershell');

const yargs = require('yargs');
const {exit} = require('process');
let argv = yargs
  .alias('s', 'save')
  .example('--s a.txt', '设置源文件')

  .usage('Usage: --s <filename>')
  .epilog('copyright')
  .help().argv;
//console.log(argv);

var path = process.cwd();
var dbfilepath = path + '/db.json';

if (fs.existsSync(dbfilepath)) {
  //console.log('存在');
} else {
  //console.log('不存在');
  //创建一个空的文件
  fs.writeFile(dbfilepath, '', (err) => {
    if (err != null) {
      console.log(`初始化文件出错:${err}`);
      exit();
    }
  });
}

// var userName = readlineSync.question('May I have your name? ');
// console.log('Hi ' + userName + '!');

if (argv._.length == 0) {
  var data = fs.readFileSync(dbfilepath).toString();
  if (data == null || data.length < 1) {
    console.log('没有任何数据链接信息！');
  } else {
    (async function () {
      var datas = JSON.parse(data);
      console.table(datas);
      var connection_index = readlineSync
        .question('Choose connection by index > ')
        .trim();
      connection_index = parseInt(connection_index);
      if (isNaN(connection_index)) {
        console.log('index Must be a number');
        exit();
      }
      if (connection_index >= datas.length) {
        console.log('index Out of range');
        exit();
      }
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
          exit();
        }
      }

      var table_index = readlineSync
        .question('Choose table by index > ')
        .trim();
      table_index = parseInt(table_index);
      if (isNaN(table_index)) {
        console.log('index Must be a number');
        exit();
      }
      if (table_index >= tablenames.length) {
        console.log('index Out of range');
        exit();
      }

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
          exit();
        }
      }

      console.log('Choose the following function:');
      console.log('0. Create React-Admin template code');
      var function_number = readlineSync
        .question('Choose function by number (Default 0) > ')
        .trim();
      if (function_number == '') function_number = 0;
      function_number = parseInt(function_number);
      if (isNaN(function_number)) {
        console.log('Must be a number');
        exit();
      }
      switch (function_number) {
        case 0:
          // Create Template CODE    choose_tablename tablefields

          var folderpath = await new PowerShell().BrowseForFolder('选择文件夹');
          console.log(`folderpath: ` + folderpath);

          // 创建文件夹
          fs.mkdir(folderpath + '/' + choose_tablename, function (err) {
            // 如果有错 抛出错误
            if (err) {
              console.log('创建文件夹失败');
              exit();
            }
          });

          new PowerShell().SavaFile(
            path,
            'index.cs',
            [[/_tablename_/gim, choose_tablename]],
            folderpath + '/' + choose_tablename
          );

          break;
        default:
          console.log('number Out of range');
          break;
      }
    })();
  }
}

if (argv._.length == 1) {
  var command1 = argv._[0].toLowerCase().trim();
  switch (command1) {
    case 'adddb':
      var ip = readlineSync
        .question(
          'Please enter the database server IP address (Default: 127.0.0.1) > '
        )
        .trim();
      if (ip == '') ip = '127.0.0.1';
      console.log(ip);

      var port = readlineSync
        .question('Please enter the database server IP port (Default: 5432) > ')
        .trim();
      if (port == '') port = '5432';
      console.log(port);

      var database = '';
      while (true) {
        database = readlineSync
          .question('Please enter the database name > ')
          .trim();
        if (database.trim() == '') console.log('database name is required');
        else break;
      }
      console.log(database);

      var userid = '';
      while (true) {
        userid = readlineSync
          .question('Please enter the database userid > ')
          .trim();
        if (userid.trim() == '') console.log('database userid is required');
        else break;
      }
      console.log(userid);

      var userpwd = '';
      while (true) {
        userpwd = readlineSync
          .question('Please enter the database userpwd > ')
          .trim();
        if (userpwd.trim() == '') console.log('database userpwd is required');
        else break;
      }
      console.log('Please confirm the following information:');
      console.log('     IP:' + ip);
      console.log('     Port:' + port);
      console.log('     Database:' + database);
      console.log('     UserId:' + userid);
      console.log('     UserPWD:' + userpwd);
      var confirm = readlineSync
        .question('y or n (Default: y) > ')
        .trim()
        .toLowerCase();
      if (confirm == '') confirm = 'y';
      if (confirm != 'y') exit();
      else {
        var new_data = {ip, port, database, userid, userpwd};
        var old_data = fs.readFileSync(dbfilepath).toString().trim();
        var datas = old_data.length < 1 ? [] : JSON.parse(old_data);
        datas.push(new_data);
        //console.log(JSON.stringify(datas));
        fs.writeFile(dbfilepath, JSON.stringify(datas), (err) => {
          if (err != null) {
            console.log(`保存数据出错:${err}`);
            exit();
          } else console.log(`Add BD Connection Success`);
        });
      }

      break;
    case 'cleardb':
      console.log('Please confirm clear all database connections!');
      var confirm = readlineSync
        .question('y or n (Default: n) > ')
        .trim()
        .toLowerCase();
      if (confirm == '') confirm = 'n';
      if (confirm == 'y') {
        fs.writeFile(dbfilepath, '', (err) => {
          if (err != null) {
            console.log(`清空数据出错:${err}`);
            exit();
          } else console.log(`Clear all database connections Success`);
        });
      }
      break;
    case 'removedb':
      var index = argv['i'];
      if (index == undefined) {
        console.log('Please confirm index number. Example: removedb 1');
        exit();
      }
      index = parseInt(index);
      if (isNaN(index)) {
        console.log('index Must be a number');
        exit();
      }

      var old_data = fs.readFileSync(dbfilepath).toString().trim();
      var datas = old_data.length < 1 ? [] : JSON.parse(old_data);
      if (index >= datas.length) {
        console.log('index Out of range');
        exit();
      }

      console.log('Please confirm remove the following connection:');
      console.table(datas[index]);
      var confirm = readlineSync
        .question('y or n (Default: n) > ')
        .trim()
        .toLowerCase();
      if (confirm == '') confirm = 'n';
      if (confirm == 'y') {
        datas.splice(index, 1); //remove one
        fs.writeFile(dbfilepath, JSON.stringify(datas), (err) => {
          if (err != null) {
            console.log(`保存数据出错:${err}`);
            exit();
          } else console.log(`Remove BD Connection Success`);
        });
      }
      break;
  }
  exit();
}
