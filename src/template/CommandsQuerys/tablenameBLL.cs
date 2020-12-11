using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Comm.ReactAdmin;
using @@@@;

namespace @@@._Tablename_BLL
{
    #region GetList
    
    //映射Model -> DTO
    public class AutomapperConfig_GetList : Profile
    {
        public AutomapperConfig_GetList()
        {
            CreateMap<_Tablename_, _Tablename_DTO>();
        }
    }

    //输入
    public class _Tablename_GetListQuery : ReactAdmin_RangeAndSort, IRequest<_Tablename_GetListQueryDTO>
    {
        //以下是搜索字段
        public int? id { get; set; }
    }

    //输出
    public class _Tablename_GetListQueryDTO
    {
        public List<_Tablename_DTO> data { get; set; }
        public int total { get; set; }
    }
    public class _Tablename_DTO
    {
       _ModelFieldCode_
    }

    public class _Tablename_GetListQueryHandler : IRequestHandler<_Tablename_GetListQuery, _Tablename_GetListQueryDTO>
    {
        private readonly ILogger<_Tablename_GetListQueryHandler> logger;
        private readonly IMapper mapper;

        public _Tablename_GetListQueryHandler(ILogger<_Tablename_GetListQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_Tablename_GetListQueryDTO> Handle(_Tablename_GetListQuery request, CancellationToken cancellationToken)
        {
            ParamCommAnd paramCommAnd = new ParamCommAnd();
            if (request.id != null)
                paramCommAnd.Add("id", request.id);

            string where; Dictionary<string, object> param;
            paramCommAnd.CreateWhere(out where, out param);

            PagerEx<_Tablename_> pager = _Tablename_.Pager(where, param, request._page, request._pagesize, request._sort, request._order);
            var list = await pager.GetDataList();
             
            return new _Tablename_GetListQueryDTO() { data = this.mapper.Map<List<_Tablename_DTO>>(list), total = pager.RecordCount };
        }
    }

    #endregion

    #region GetOne

    //映射Model -> DTO
    public class AutomapperConfig_GetOne : Profile
    {
        public AutomapperConfig_GetOne()
        {
            CreateMap<_Tablename_, _Tablename_GetOneQueryDTO>();
        }
    }

    //输入
    public class _Tablename_GetOneQuery : IRequest<_Tablename_GetOneQueryDTO>
    {
        public int id { get; set; }
    }

    //输出
    public class _Tablename_GetOneQueryDTO
    {
        _ModelFieldCode_
    }

    public class _Tablename_GetOneQueryHandler : IRequestHandler<_Tablename_GetOneQuery, _Tablename_GetOneQueryDTO>
    {
        private readonly ILogger<_Tablename_GetOneQueryHandler> logger;
        private readonly IMapper mapper;

        public _Tablename_GetOneQueryHandler(ILogger<_Tablename_GetOneQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_Tablename_GetOneQueryDTO> Handle(_Tablename_GetOneQuery request, CancellationToken cancellationToken)
        {
            var item = await _Tablename_.GetModel(request.id);
            return this.mapper.Map<_Tablename_GetOneQueryDTO>(item);
        }
    }

    #endregion

    #region GetMany

    //映射Model -> DTO
    public class AutomapperConfig_GetMany : Profile
    {
        public AutomapperConfig_GetMany()
        {
            CreateMap<_Tablename_, _Tablename_GetManyQueryDTO>();
        }
    }

    //输入
    public class _Tablename_GetManyQuery :  IRequest<List<_Tablename_GetManyQueryDTO>>
    {
        public int[] ids { get; set; }
    }

    //输出 List
    public class _Tablename_GetManyQueryDTO
    {
      _ModelFieldCode_
    }

    public class _Tablename_GetManyQueryHandler : IRequestHandler<_Tablename_GetManyQuery, List<_Tablename_GetManyQueryDTO>>
    {
        private readonly ILogger<_Tablename_GetManyQueryHandler> logger;
        private readonly IMapper mapper;

        public _Tablename_GetManyQueryHandler(ILogger<_Tablename_GetManyQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<List<_Tablename_GetManyQueryDTO>> Handle(_Tablename_GetManyQuery request, CancellationToken cancellationToken)
        {
            ParamCommAnd paramCommAnd = new ParamCommAnd();
            paramCommAnd.Add("id", request.ids, "in");

            string where; Dictionary<string, object> param;
            paramCommAnd.CreateWhere(out where, out param);

            var items = await _Tablename_.GetModelList(where, param).GetList();
            return this.mapper.Map<List<_Tablename_GetManyQueryDTO>>(items);
        }
    }

    #endregion

    #region Create

    //映射Model -> DTO
    public class AutomapperConfig_Create : Profile
    {
        public AutomapperConfig_Create()
        {
            CreateMap<_Tablename_, _Tablename_CreateQueryDTO>();
        }
    }

    //输入
    public class _Tablename_CreateQuery : IRequest<_Tablename_CreateQueryDTO>
    {
        _ModelFieldCodeRemoveKey_
    }

    //输出
    public class _Tablename_CreateQueryDTO
    {
        _ModelFieldCode_
    }

    public class _Tablename_CreateQueryHandler : IRequestHandler<_Tablename_CreateQuery, _Tablename_CreateQueryDTO>
    {
        private readonly ILogger<_Tablename_CreateQueryHandler> logger;
        private readonly IMapper mapper;

        public _Tablename_CreateQueryHandler(ILogger<_Tablename_CreateQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_Tablename_CreateQueryDTO> Handle(_Tablename_CreateQuery request, CancellationToken cancellationToken)
        {
            // if (!(await _Tablename_.GetModelWhere(t => 
            //     t.XXX == request.XXX &&  t.XXXX == request.XXXX
            // )).IsNull())
            //     throw new MyException("已经存在相同记录，不能重复添加");

            var item = new _Tablename_();
            _WriteFieldCodeRemoveKey_
            item.id = (await item.Add()).ToInt32();
            if (item.id > 0)
                return this.mapper.Map<_Tablename_CreateQueryDTO>(item);
            else
                throw new MyException("创建出错");
        }
    }

    #endregion

    #region Update

    //映射Model -> DTO
    public class AutomapperConfig_Update : Profile
    {
        public AutomapperConfig_Update()
        {
            CreateMap<_Tablename_, _Tablename_UpdateQueryDTO>();
        }
    }

    //输入
    public class _Tablename_UpdateQuery : IRequest<_Tablename_UpdateQueryDTO>
    {
        _ModelFieldCode_
    }

    //输出
    public class _Tablename_UpdateQueryDTO
    {
        _ModelFieldCode_
    }

    public class _Tablename_UpdateQueryHandler : IRequestHandler<_Tablename_UpdateQuery, _Tablename_UpdateQueryDTO>
    {
        private readonly ILogger<_Tablename_UpdateQueryHandler> logger;
        private readonly IMapper mapper;

        public _Tablename_UpdateQueryHandler(ILogger<_Tablename_UpdateQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_Tablename_UpdateQueryDTO> Handle(_Tablename_UpdateQuery request, CancellationToken cancellationToken)
        {
            // if (!(await _Tablename_.GetModelWhere(t => t.id != request.id && 
            //     ( t.XXX == request.XXX &&  t.XXXX == request.XXXX )
            // )).IsNull())
            //     throw new MyException("已经存在相同记录，请检查");

            var item = await _Tablename_.GetModel(request.id);
            _WriteFieldCodeRemoveKey_
            if (await item.Update())
                return this.mapper.Map<_Tablename_UpdateQueryDTO>(item);
            else
                throw new MyException("保存出错");
        }
    }

    #endregion

    #region Delete

    //映射Model -> DTO
    public class AutomapperConfig_Delete : Profile
    {
        public AutomapperConfig_Delete()
        {
            CreateMap<_Tablename_, _Tablename_DeleteQueryDTO>();
        }
    }

    //输入
    public class _Tablename_DeleteQuery : IRequest<_Tablename_DeleteQueryDTO>
    {
        public int id { get; set; }
    }

    //输出
    public class _Tablename_DeleteQueryDTO
    {
        _ModelFieldCode_
    }

    public class _Tablename_DeleteQueryHandler : IRequestHandler<_Tablename_DeleteQuery, _Tablename_DeleteQueryDTO>
    {
        private readonly ILogger<_Tablename_DeleteQueryHandler> logger;
        private readonly IMapper mapper;

        public _Tablename_DeleteQueryHandler(ILogger<_Tablename_DeleteQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_Tablename_DeleteQueryDTO> Handle(_Tablename_DeleteQuery request, CancellationToken cancellationToken)
        {
            var item = await _Tablename_.GetModel(request.id);
            if (await item.Delete())
            {
                return this.mapper.Map<_Tablename_DeleteQueryDTO>(item);
            }
            else
                throw new MyException("删除出错");
        }
    }

    #endregion

    #region DeleteMany

    //输入
    public class _Tablename_DeleteManyQuery : IRequest<_Tablename_DeleteManyQueryDTO>
    {
        public int[] ids { get; set; }
    }

    //输出
    public class _Tablename_DeleteManyQueryDTO
    {
        public int[] ids { get; set; }
    }

    public class _Tablename_DeleteManyQueryHandler : IRequestHandler<_Tablename_DeleteManyQuery, _Tablename_DeleteManyQueryDTO>
    {
        private readonly ILogger<_Tablename_DeleteManyQueryHandler> logger;
        private readonly IMapper mapper;

        public _Tablename_DeleteManyQueryHandler(ILogger<_Tablename_DeleteManyQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_Tablename_DeleteManyQueryDTO> Handle(_Tablename_DeleteManyQuery request, CancellationToken cancellationToken)
        {
            SqlTranExtensions STE = new SqlTranExtensions();
            foreach (var id in request.ids)
            {
                var item = await _Tablename_.GetModel(id);
                await item.Delete(STE);
            }
            if (await STE.ExecuteSqlTran())
            {
                return new _Tablename_DeleteManyQueryDTO() { ids = request.ids };
            }
            else
                throw new MyException("删除出错");
        }
    }

    #endregion

    #region ResetOrderNum

    //输入
    public class _Tablename_ResetOrderNumQuery : IRequest<_Tablename_ResetOrderNumQueryDTO>
    {
        public int[] ids { get; set; }

        public int OrderNum { get; set; }
    }

    //输出
    public class _Tablename_ResetOrderNumQueryDTO
    {
        public int[] ids { get; set; }
    }

    public class _Tablename_ResetOrderNumQueryHandler : IRequestHandler<_Tablename_ResetOrderNumQuery, _Tablename_ResetOrderNumQueryDTO>
    {
        private readonly ILogger<_Tablename_ResetOrderNumQueryHandler> logger;
        private readonly IMapper mapper;

        public _Tablename_ResetOrderNumQueryHandler(ILogger<_Tablename_ResetOrderNumQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<_Tablename_ResetOrderNumQueryDTO> Handle(_Tablename_ResetOrderNumQuery request, CancellationToken cancellationToken)
        {
            SqlTranExtensions STE = new SqlTranExtensions();
            foreach (var id in request.ids)
            {
                var item = await _Tablename_.GetModel(id);
                //item.OrderNum = request.OrderNum;
                await item.Update(STE);
            }
            if (await STE.ExecuteSqlTran())
            {
                return new _Tablename_ResetOrderNumQueryDTO() { ids = request.ids };
            }
            else
                throw new MyException("保存出错");
        }
    }

    #endregion
}
