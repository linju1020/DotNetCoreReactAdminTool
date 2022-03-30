public class _Tablename_Controller : BaseController
{
    [AutoMap(typeof(_Tablename_))]
    public class _Tablename_DTO
    {
        _ModelFieldCode_
    }

    [HttpGet]
    public async Task<IActionResult> _Tablename_List([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 20, [FromQuery] string Key = "")
    {
        var result = new Result_Obj();
        try
        {
            //pageindex是从1开始的不是从零开始的
            pageIndex = Math.Max(0, pageIndex);
            RefAsync<int> totalCount = 0;

            using (var db = connectionProvider.GetSqlSugarClient())
            {
                var data = await db.Queryable<_tablename_>()
                                    .Where((p) => p.Key.lb_Like(Key))
                                    .OrderBy((p) => p.id, OrderByType.Desc)
                                    .ToPageListAsync(pageIndex + 1, pageSize, totalCount);

                result.Code = 1;
                result.Result = new { data = this.mapper.Map<List<_Tablename_DTO>>(data), pageIndex, pageSize, totalCount = totalCount.Value };
            }
        }
        catch (MyException mce)
        {
            result.Message = mce.Message;
        }
        catch (Exception ce)
        {
            logger.LogError(ce, ce.Message);
            result.Message = "系统错误，请稍后重试";
        }

        return new JsonResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> _Tablename_One([FromQuery] int id)
    {
        var result = new Result_Obj();
        try
        {
            using (var db = connectionProvider.GetSqlSugarClient())
            {
                var item = await db.Queryable<_tablename_>().Where((p) => p.id == id).FirstAsync();
                if (item.IsNull()) throw new MyException("数据为null");

                result.Code = 1;
                result.Result = this.mapper.Map<_Tablename_DTO>(item);
            }
        }
        catch (MyException mce)
        {
            result.Message = mce.Message;
        }
        catch (Exception ce)
        {
            logger.LogError(ce, ce.Message);
            result.Message = "系统错误，请稍后重试";
        }
        return new JsonResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create_Tablename_([FromBody] _Tablename_DTO request)
    {
        var result = new Result_Obj();
        try
        {
            //Check

            var item = new _tablename_();
            _WriteFieldCodeRemoveKey_
            item.id = (await item.Add()).ToInt32();

            result.Code = 1;
            result.Result = this.mapper.Map<_Tablename_DTO>(item);
        }
        catch (MyException mce)
        {
            result.Message = mce.Message;
        }
        catch (Exception ce)
        {
            logger.LogError(ce, ce.Message);
            result.Message = "系统错误，请稍后重试";
        }
        return new JsonResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> Update_Tablename_([FromQuery] int id, [FromBody] _Tablename_DTO request)
    {
        var result = new Result_Obj();
        try
        {
            using (var db = connectionProvider.GetSqlSugarClient())
            {
                var item = await db.Queryable<_tablename_>().Where((p) => p.id == id).FirstAsync();
                if (item.IsNull()) throw new MyException("数据为null");

                _WriteFieldCodeRemoveKey_

                if (await item.Update())
                {
                    result.Code = 1;
                    result.Result = this.mapper.Map<_Tablename_DTO>(item);
                }
            }
        }
        catch (MyException mce)
        {
            result.Message = mce.Message;
        }
        catch (Exception ce)
        {
            logger.LogError(ce, ce.Message);
            result.Message = "系统错误，请稍后重试";
        }
        return new JsonResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> Delete_Tablename_([FromQuery] int id)
    {
        var result = new Result_Obj();
        try
        {
            using (var db = connectionProvider.GetSqlSugarClient())
            {
                if (await db.Deleteable<_tablename_>().Where((p) => p.id == id).ExecuteCommandAsync())
                    result.Code = 1;
            }
        }
        catch (MyException mce)
        {
            result.Message = mce.Message;
        }
        catch (Exception ce)
        {
            logger.LogError(ce, ce.Message);
            result.Message = "系统错误，请稍后重试";
        }
        return new JsonResult(result);
    }
}