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

namespace @@@.CMSAPI.Models.CommandsQuerys._tablename_
{
    //输入
    public class _tablename_DeleteManyQuery : IRequest<_tablename_DeleteManyQueryDTO>
    {
        public int[] ids { get; set; }
    }

    //输出
    public class _tablename_DeleteManyQueryDTO
    {
        public int[] ids { get; set; }
    }

    public class _tablename_DeleteManyQueryHandler : IRequestHandler<_tablename_DeleteManyQuery, _tablename_DeleteManyQueryDTO>
    {
        private readonly ILogger<_tablename_DeleteManyQueryHandler> logger;
        private readonly IMapper mapper;

        public _tablename_DeleteManyQueryHandler(ILogger<_tablename_DeleteManyQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_tablename_DeleteManyQueryDTO> Handle(_tablename_DeleteManyQuery request, CancellationToken cancellationToken)
        {
            SqlTranExtensions STE = new SqlTranExtensions();
            foreach (var id in request.ids)
            {
                var item = await _tablename_.GetModel(id);
                await item.Delete(STE);
            }
            if (await STE.ExecuteSqlTran())
            {
                return new _tablename_DeleteManyQueryDTO() { ids = request.ids };
            }
            else
                throw new MyException("删除出错");
        }
    }
}
