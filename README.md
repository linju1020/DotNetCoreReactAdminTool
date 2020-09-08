# DotNetCoreReactAdminTool
DotNetCoreReactAdminTool



``` javascript
    //console.log(choose_connection);
    //数据库配置
    //tcp://用户名：密码@localhost/数据库名
    var conString = `postgres://${choose_connection['userid']}:${choose_connection['userpwd']}@${choose_connection['ip']}:${choose_connection['port']}/${choose_connection['database']}`;
    //console.log(`conString:${conString}`);

    

    return;
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
```