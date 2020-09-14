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
    public class AutomapperConfig_Create : Profile
    {
        public AutomapperConfig_Create()
        {
            CreateMap<_tablename_, _tablename_CreateQueryDTO>();
        }
    }

    //输入
    public class _tablename_CreateQuery : IRequest<_tablename_CreateQueryDTO>
    {
        _ModelFieldCodeRemoveKey_
    }

    //输出
    public class _tablename_CreateQueryDTO
    {
        _ModelFieldCode_
    }

    public class _tablename_CreateQueryHandler : IRequestHandler<_tablename_CreateQuery, _tablename_CreateQueryDTO>
    {
        private readonly ILogger<_tablename_CreateQueryHandler> logger;
        private readonly IMapper mapper;

        public _tablename_CreateQueryHandler(ILogger<_tablename_CreateQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_tablename_CreateQueryDTO> Handle(_tablename_CreateQuery request, CancellationToken cancellationToken)
        {
            var item = new _tablename_();
            _WriteFieldCodeRemoveKey_
            item.id = (await item.Add()).ToInt32();
            if (item.id > 0)
                return this.mapper.Map<_tablename_CreateQueryDTO>(item);
            else
                throw new MyException("创建出错");
        }
    }
}
