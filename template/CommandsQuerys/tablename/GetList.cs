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
    //映射Model -> DTO
    public class AutomapperConfig_GetList : Profile
    {
        public AutomapperConfig_GetList()
        {
            CreateMap<_tablename_, _tablename_DTO>();
        }
    }

    //输入
    public class _tablename_GetListQuery : ReactAdmin_RangeAndSort, IRequest<_tablename_GetListQueryDTO>
    {
        //以下是搜索字段
        public int? id { get; set; }
    }

    //输出
    public class _tablename_GetListQueryDTO
    {
        public List<_tablename_DTO> data { get; set; }
        public int total { get; set; }
    }
    public class _tablename_DTO
    {
       _ModelFieldCode_
    }

    public class _tablename_GetListQueryHandler : IRequestHandler<_tablename_GetListQuery, _tablename_GetListQueryDTO>
    {
        private readonly ILogger<_tablename_GetListQueryHandler> logger;
        private readonly IMapper mapper;

        public _tablename_GetListQueryHandler(ILogger<_tablename_GetListQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_tablename_GetListQueryDTO> Handle(_tablename_GetListQuery request, CancellationToken cancellationToken)
        {
            ParamCommAnd paramCommAnd = new ParamCommAnd();
            if (request.id != null)
                paramCommAnd.Add("id", request.id);

            string where; Dictionary<string, object> param;
            paramCommAnd.CreateWhere(out where, out param);

            PagerEx<_tablename_> pager = _tablename_.Pager(where, param, request._page, request._pagesize, request._sort, request._order);
            var list = await pager.GetDataList();
             
            return new _tablename_GetListQueryDTO() { data = this.mapper.Map<List<_tablename_DTO>>(list), total = pager.RecordCount };
        }
    }
}
