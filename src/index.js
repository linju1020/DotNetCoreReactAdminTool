var pg = require('pg');
var fs = require('fs');
var readlineSync = require('readline-sync');

const yargs = require('yargs');
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
      return;
    }
  });
}

// var userName = readlineSync.question('May I have your name? ');
// console.log('Hi ' + userName + '!');

if (argv._.length == 0) {
  var data = fs.readFileSync(dbfilepath).toString();
  if (data == null || data.length < 1) console.log('没有任何数据链接信息！');
  else {
    var datas = JSON.parse(data);
    console.table(datas);
    var connection_index = readlineSync
      .question('Choose connection by index > ')
      .trim();
    connection_index = parseInt(connection_index);
    if (isNaN(connection_index)) {
      console.log('index Must be a number');
      return;
    }
    if (connection_index >= datas.length) {
      console.log('index Out of range');
      return;
    }
    var choose_connection = datas[connection_index];
    //console.log(choose_connection);
    //数据库配置
    //tcp://用户名：密码@localhost/数据库名
    var conString = `postgres://${choose_connection['userid']}:${choose_connection['userpwd']}@${choose_connection['ip']}:${choose_connection['port']}/${choose_connection['database']}`;
    //console.log(`conString:${conString}`);
    var client = new pg.Client(conString);
    client.connect(function (isErr) {
      if (isErr) {
        console.log('connect error:' + isErr.message);
        client.end();
        return;
      }
      client.query(
        "select tablename from pg_tables where schemaname='public'",
        [],
        function (isErr, rst) {
          if (isErr) {
            console.log('query error:' + isErr.message);
          } else {
            var tablenames = rst.rows;
            console.table(tablenames);

            var table_index = readlineSync
              .question('Choose table by index > ')
              .trim();
            table_index = parseInt(table_index);
            if (isNaN(table_index)) {
              console.log('index Must be a number');
              return;
            }
            if (table_index >= tablenames.length) {
              console.log('index Out of range');
              return;
            }

            console.log(tablenames[table_index]);

            var tablefildsql =
              ' SELECT a.attnum,' +
              'a.attname AS field,' +
              't.typname AS type,' +
              'a.attlen AS length,' +
              'a.atttypmod AS lengthvar,' +
              'a.attnotnull AS notnull,' +
              'b.description AS comment' +
              'FROM pg_class c,' +
              'pg_attribute a' +
              'LEFT OUTER JOIN pg_description b ON a.attrelid=b.objoid AND a.attnum = b.objsubid,' +
              'pg_type t' +
              `WHERE c.relname = '${tablenames[table_index].tablename}'` +
              'and a.attnum > 0' +
              'and a.attrelid = c.oid' +
              'and a.atttypid = t.oid' +
              'ORDER BY a.attnum;';

            client.query(tablefildsql, [], function (isErr2, rst2) {
              if (isErr2) {
                console.log('query error:' + isErr2.message);
              } else {
                console.table(rst2.rows);
              }
            });
          }
          client.end();
        }
      );
    });
  }
  return;
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
      if (confirm != 'y') return;
      else {
        var new_data = {ip, port, database, userid, userpwd};
        var old_data = fs.readFileSync(dbfilepath).toString().trim();
        var datas = old_data.length < 1 ? [] : JSON.parse(old_data);
        datas.push(new_data);
        //console.log(JSON.stringify(datas));
        fs.writeFile(dbfilepath, JSON.stringify(datas), (err) => {
          if (err != null) {
            console.log(`保存数据出错:${err}`);
            return;
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
            return;
          } else console.log(`Clear all database connections Success`);
        });
      }
      break;
    case 'removedb':
      var index = argv['i'];
      if (index == undefined) {
        console.log('Please confirm index number. Example: removedb 1');
        return;
      }
      index = parseInt(index);
      if (isNaN(index)) {
        console.log('index Must be a number');
        return;
      }

      var old_data = fs.readFileSync(dbfilepath).toString().trim();
      var datas = old_data.length < 1 ? [] : JSON.parse(old_data);
      if (index >= datas.length) {
        console.log('index Out of range');
        return;
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
            return;
          } else console.log(`Remove BD Connection Success`);
        });
      }
      break;
  }
  return;
}
