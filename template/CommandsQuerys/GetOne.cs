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
    //映射Model -> DTO
    public class AutomapperConfig_GetOne : Profile
    {
        public AutomapperConfig_GetOne()
        {
            CreateMap<_tablename_, _tablename_GetOneQueryDTO>();
        }
    }

    //输入
    public class _tablename_GetOneQuery : IRequest<_tablename_GetOneQueryDTO>
    {
        public int id { get; set; }
    }

    //输出
    public class _tablename_GetOneQueryDTO
    {
        _ModelFieldCode_
    }

    public class _tablename_GetOneQueryHandler : IRequestHandler<_tablename_GetOneQuery, _tablename_GetOneQueryDTO>
    {
        private readonly ILogger<_tablename_GetOneQueryHandler> logger;
        private readonly IMapper mapper;

        public _tablename_GetOneQueryHandler(ILogger<_tablename_GetOneQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_tablename_GetOneQueryDTO> Handle(_tablename_GetOneQuery request, CancellationToken cancellationToken)
        {
            var item = await _tablename_.GetModel(request.id);
            return this.mapper.Map<_tablename_GetOneQueryDTO>(item);
        }
    }
}
