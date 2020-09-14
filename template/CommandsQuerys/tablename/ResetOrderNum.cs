using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using @@@.CMSAPI.Models.Common;
using @@@.CMSAPI.Models.Domain;
using @@@.CMSAPI.Models.ORM;

namespace @@@.CMSAPI.Models.CommandsQuerys._Tablename_
{
    //输入
    public class _tablename_ResetOrderNumQuery : IRequest<_tablename_ResetOrderNumQueryDTO>
    {
        public int[] ids { get; set; }

        public int ordernum { get; set; }
    }

    //输出
    public class _tablename_ResetOrderNumQueryDTO
    {
        public int[] ids { get; set; }
    }

    public class _tablename_ResetOrderNumQueryHandler : IRequestHandler<_tablename_ResetOrderNumQuery, _tablename_ResetOrderNumQueryDTO>
    {
        private readonly ILogger<_tablename_ResetOrderNumQueryHandler> logger;
        private readonly IMapper mapper;

        public _tablename_ResetOrderNumQueryHandler(ILogger<_tablename_ResetOrderNumQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_tablename_ResetOrderNumQueryDTO> Handle(_tablename_ResetOrderNumQuery request, CancellationToken cancellationToken)
        {
            SqlTranExtensions STE = new SqlTranExtensions();
            foreach (var id in request.ids)
            {
                var item = await _tablename_.GetModel(id);
                item.ordernum = request.ordernum;
                await item.Update(STE);
            }
            if (await STE.ExecuteSqlTran())
            {
                return new _tablename_ResetOrderNumQueryDTO() { ids = request.ids };
            }
            else
                throw new MyException("保存出错");
        }
    }
}
