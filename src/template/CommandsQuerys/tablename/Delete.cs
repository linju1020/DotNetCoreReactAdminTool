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
    public class AutomapperConfig_Delete : Profile
    {
        public AutomapperConfig_Delete()
        {
            CreateMap<_tablename_, _tablename_DeleteQueryDTO>();
        }
    }

    //输入
    public class _tablename_DeleteQuery : IRequest<_tablename_DeleteQueryDTO>
    {
        public int id { get; set; }
    }

    //输出
    public class _tablename_DeleteQueryDTO
    {
        _ModelFieldCode_
    }

    public class _tablename_DeleteQueryHandler : IRequestHandler<_tablename_DeleteQuery, _tablename_DeleteQueryDTO>
    {
        private readonly ILogger<_tablename_DeleteQueryHandler> logger;
        private readonly IMapper mapper;

        public _tablename_DeleteQueryHandler(ILogger<_tablename_DeleteQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_tablename_DeleteQueryDTO> Handle(_tablename_DeleteQuery request, CancellationToken cancellationToken)
        {
            var item = await _tablename_.GetModel(request.id);
            if (await item.Delete())
            {
                return this.mapper.Map<_tablename_DeleteQueryDTO>(item);
            }
            else
                throw new MyException("删除出错");
        }
    }
}
