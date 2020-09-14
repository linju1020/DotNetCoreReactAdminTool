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
    public class AutomapperConfig_Update : Profile
    {
        public AutomapperConfig_Update()
        {
            CreateMap<_tablename_, _tablename_UpdateQueryDTO>();
        }
    }

    //输入
    public class _tablename_UpdateQuery : IRequest<_tablename_UpdateQueryDTO>
    {
        _ModelFieldCode_
    }

    //输出
    public class _tablename_UpdateQueryDTO
    {
        _ModelFieldCode_
    }

    public class _tablename_UpdateQueryHandler : IRequestHandler<_tablename_UpdateQuery, _tablename_UpdateQueryDTO>
    {
        private readonly ILogger<_tablename_UpdateQueryHandler> logger;
        private readonly IMapper mapper;

        public _tablename_UpdateQueryHandler(ILogger<_tablename_UpdateQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_tablename_UpdateQueryDTO> Handle(_tablename_UpdateQuery request, CancellationToken cancellationToken)
        {
            var item = await _tablename_.GetModel(request.id);
            _WriteFieldCodeRemoveKey_
            if (await item.Update())
                return this.mapper.Map<_tablename_UpdateQueryDTO>(item);
            else
                throw new MyException("保存出错");
        }
    }
}
