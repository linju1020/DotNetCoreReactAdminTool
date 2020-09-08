 //import pg from 'pg';
var pg = require('pg')

function DB() {
  var _Client;
  var _ConnectStr;
  this.setConnectStr = async function (ConnectStr) {
    _ConnectStr = ConnectStr;
    _Client = new pg.Client(_ConnectStr);
    return await _Client
      .connect()
      .then((_) => {
        return true;
      })
      .catch((err) => {
        console.log(`数据库链接失败：${err}`);
        return false;
      });
  };
  this.getRows = async function (SQL, Param) {
    var result = await _Client
      .query(SQL, Param)
      .then((res) => {
        return res.rows;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
    return result;
  };
}
module.exports = DB;
