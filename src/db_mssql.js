const sql = require('mssql')

function DB_MSSQL() {
  var _ConnectStr;
  this.setConnectStr = function (ConnectStr) {
    _ConnectStr = ConnectStr;
    return true;
  };
  this.getRows = async function (SQL) {
    await sql.connect(_ConnectStr)
    let result = await sql.query(SQL);
    // console.log('DB_MSSQL Result', result);
    let { recordset } = result;
    return recordset;
  };
}
module.exports = DB_MSSQL;
