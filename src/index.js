var fs = require('fs');
var readlineSync = require('readline-sync');

const yargs = require('yargs');
let argv = yargs
  .alias('s', 'save')
  .example('--s a.txt', '设置源文件')

  .usage('Usage: --s <filename>')
  .epilog('copyright')
  .help().argv;

var path = process.cwd();
var dbfilepath = path + '/db.json';
//console.log(argv);

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
  else console.log(data);
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
      var confirm = readlineSync.question('y or n (Default: y) > ').trim();
      if (confirm != 'y') return;
      else {
        var data1 = {ip, prot, database, userid, userpwd};
        
      }

      break;
    case 'cleardb':
      break;
  }
  return;
}
