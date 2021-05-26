using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MediatR;

namespace @@@
{
    [Route("XXXXX/[Controller]/[Action]")]
    [ApiGroup(ApiGroupNames.XXXXX)]
    public class CMS_Tablename_Controller : BaseController
    {
        private readonly ILogger<CMS_Tablename_Controller> logger;
        private readonly IMediator mediator;

        public CMS_Tablename_Controller(ILogger<CMS_Tablename_Controller> logger, IMediator mediator)
        {
            this.logger = logger;
            this.mediator = mediator;
        }

        /// <summary>
        /// 获取分页列表
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery]_Tablename_GetListQuery query)
        {
            Result_Obj result = new Result_Obj();
            try
            {
                var queryDTO = await this.mediator.Send(query);
                result.Code = 1;
                result.Result = queryDTO;
            }
            catch (MyException mce)
            {
                result.Message = mce.Message;
            }
            catch (Exception ce)
            {
                logger.LogError(ce.Message);
                result.Message = "系统错误，请稍后重新";
            }

            return new JsonResult(result);
        }

        /// <summary>
        ///  获取单个实体
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOne([FromRoute]_Tablename_GetOneQuery query)
        {
            Result_Obj result = new Result_Obj();
            try
            {
                var queryDTO = await this.mediator.Send(query);
                result.Code = 1;
                result.Result = queryDTO;
            }
            catch (MyException mce)
            {
                result.Message = mce.Message;
            }
            catch (Exception ce)
            {
                logger.LogError(ce.Message);
                result.Message = "系统错误，请稍后重新";
            }

            return new JsonResult(result);
        }

        /// <summary>
        ///  获取多个实体
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMany([FromQuery]_Tablename_GetManyQuery query)
        {
            Result_Obj result = new Result_Obj();
            try
            {
                var queryDTOs = await this.mediator.Send(query);
                result.Code = 1;
                result.Result = queryDTOs;
            }
            catch (MyException mce)
            {
                result.Message = mce.Message;
            }
            catch (Exception ce)
            {
                logger.LogError(ce.Message);
                result.Message = "系统错误，请稍后重新";
            }

            return new JsonResult(result);
        }

        /// <summary>
        ///  创建单个实体
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody]_Tablename_CreateQuery query)
        {
            Result_Obj result = new Result_Obj();
            try
            {
                var queryDTO = await this.mediator.Send(query);
                result.Code = 1;
                result.Result = queryDTO;
            }
            catch (MyException mce)
            {
                result.Message = mce.Message;
            }
            catch (Exception ce)
            {
                logger.LogError(ce.Message);
                result.Message = "系统错误，请稍后重新";
            }

            return new JsonResult(result);
        }

        /// <summary>
        ///  修改单个实体
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute]int id, [FromBody]_Tablename_UpdateQuery query)
        {
            Result_Obj result = new Result_Obj();
            try
            {
                var queryDTO = await this.mediator.Send(query);
                result.Code = 1;
                result.Result = queryDTO;
            }
            catch (MyException mce)
            {
                result.Message = mce.Message;
            }
            catch (Exception ce)
            {
                logger.LogError(ce.Message);
                result.Message = "系统错误，请稍后重新";
            }

            return new JsonResult(result);
        }

        /// <summary>
        ///  删除单个实体
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute]_Tablename_DeleteQuery query)
        {
            Result_Obj result = new Result_Obj();
            try
            {
                var queryDTO = await this.mediator.Send(query);
                result.Code = 1;
                result.Result = queryDTO;
            }
            catch (MyException mce)
            {
                result.Message = mce.Message;
            }
            catch (Exception ce)
            {
                logger.LogError(ce.Message);
                result.Message = "系统错误，请稍后重新";
            }

            return new JsonResult(result);
        }

        /// <summary>
        ///  删除多个实体
        /// </summary>
        [HttpDelete]
        public async Task<IActionResult> DeleteMany([FromBody]_Tablename_DeleteManyQuery query)
        {
            Result_Obj result = new Result_Obj();
            try
            {
                var queryDTO = await this.mediator.Send(query);
                result.Code = 1;
                result.Result = queryDTO.ids;
            }
            catch (MyException mce)
            {
                result.Message = mce.Message;
            }
            catch (Exception ce)
            {
                logger.LogError(ce.Message);
                result.Message = "系统错误，请稍后重新";
            }

            return new JsonResult(result);
        }

        /// <summary>
        ///  修改多个实体 - 重置排序 (只是一个例子)
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> ResetOrderNum([FromQuery]int[] ids, [FromBody]_Tablename_ResetOrderNumQuery query)
        {
            Result_Obj result = new Result_Obj();
            try
            {
                query.ids = ids;

                var queryDTO = await this.mediator.Send(query);
                result.Code = 1;
                result.Result = queryDTO.ids;
            }
            catch (MyException mce)
            {
                result.Message = mce.Message;
            }
            catch (Exception ce)
            {
                logger.LogError(ce.Message);
                result.Message = "系统错误，请稍后重新";
            }

            return new JsonResult(result);
        }

    }
}