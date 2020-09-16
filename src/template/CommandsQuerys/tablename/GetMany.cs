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
    public class AutomapperConfig_GetMany : Profile
    {
        public AutomapperConfig_GetMany()
        {
            CreateMap<_tablename_, _tablename_GetManyQueryDTO>();
        }
    }

    //输入
    public class _tablename_GetManyQuery :  IRequest<List<_tablename_GetManyQueryDTO>>
    {
        public int[] ids { get; set; }
    }

    //输出 List
    public class _tablename_GetManyQueryDTO
    {
      _ModelFieldCode_
    }

    public class _tablename_GetManyQueryHandler : IRequestHandler<_tablename_GetManyQuery, List<_tablename_GetManyQueryDTO>>
    {
        private readonly ILogger<_tablename_GetManyQueryHandler> logger;
        private readonly IMapper mapper;

        public _tablename_GetManyQueryHandler(ILogger<_tablename_GetManyQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<List<_tablename_GetManyQueryDTO>> Handle(_tablename_GetManyQuery request, CancellationToken cancellationToken)
        {
            ParamCommAnd paramCommAnd = new ParamCommAnd();
            paramCommAnd.Add("id", request.ids, "in");

            string where; Dictionary<string, object> param;
            paramCommAnd.CreateWhere(out where, out param);

            var items = await _tablename_.GetModelList(where, param).GetList();
            return this.mapper.Map<List<_tablename_GetManyQueryDTO>>(items);
        }
    }
}
