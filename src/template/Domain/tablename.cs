using System;
using System.ComponentModel.DataAnnotations;
using SqlSugar;

namespace @@@
{
    public class _Tablename_ : ModelBase<_Tablename_>
    {
        [Key]
        [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
        _ModelFieldCode_
    }
}