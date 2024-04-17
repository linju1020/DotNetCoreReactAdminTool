import * as React from 'react';
import { Fragment } from 'react';
import { makeStyles } from 'tss-react/mui';
import { required, minLength, maxLength, minValue, maxValue, number, regex, email, choices, Form, useResourceContext, useNotify } from 'react-admin';
import {
    useListContext,
    useRedirect,
    List,
    Datagrid,
    Filter,
    Edit,
    Create,

    Toolbar,
    TopToolbar,
    DeleteWithConfirmButton,
    BulkDeleteWithConfirmButton,
    Show,
    SimpleShowLayout,

    ReferenceField,
    TextField,
    ImageField,
    BooleanField,

    SimpleForm,
    ReferenceInput,
    SelectInput,
    TextInput,
    NumberInput,
    BooleanInput,
    NullableBooleanInput,

    Button,
    EditButton,
    ShowButton,
    SaveButton,
} from 'react-admin';
import { useForm, useFormContext } from 'react-hook-form';
import { Button as MButton, Box, useMediaQuery, Stack } from '@mui/material';
import { PreviewImage, UpLoadFile } from './custom/UpLoadFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';
//import ResetOrderNum from './_tablename__ResetOrderNum';

{/* 
  import { _Tablename_List, _Tablename_Create, _Tablename_Edit, _Tablename_Show } from './components/_Tablename_';

  <Resource name="CMS_Tablename_" list={_Tablename_List} create={_Tablename_Create} edit={_Tablename_Edit} show={_Tablename_Show} />
  <Resource name="CMS_Tablename_" list={ListGuesser} create={EditGuesser} edit={EditGuesser} edit={ShowGuesser} /> 
*/}

const useStyles = makeStyles()((theme) => {
  return {
    imageField: {
      '& img.RaImageField-image': { width: 60 }
    },
  };
});


const useTxtData = {
  page: {
    tableName: '_Tablename_',
  },
  table: {
    _createJsClassFiledCodes_
  }
};

//分页列表页面
export const _Tablename_List = () => {
    const redirect = useRedirect();//奇怪问题：这句必须保留，去掉后下面Filters里的setFilters({}, displayedFilters);会失效
    const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    // 筛选器模块
    // const Filters = () => {
    //   return (
    //     <Filter>
    //       <TextInput label="ID" source="id" alwaysOn />
    //     </Filter>
    //   );
    // };
    const MobileFilters = [
        <TextInput label="关键词" source="Key" alwaysOn resettable />
    ];
    const Filters = (props: any) => {
        const { displayedFilters, filterValues, setFilters, hideFilter, refetch } = useListContext();
        if (isSmall) return null;
        if (props.context === "button") return null;
        const onSubmit = (values: any) => { if (Object.keys(values).length > 0) { setFilters(values, displayedFilters); } else { setFilters({}, displayedFilters); } };
        const resetFilter = () => { setFilters({}, displayedFilters); };
        return (
            <div>
                <Form onSubmit={onSubmit} defaultValues={filterValues}>
                    <Stack direction={'row'} alignItems={'baseline'} spacing={1.5}>
                        <TextInput label="关键词" source="Key" alwaysOn resettable />
                        <MButton variant="contained" color="primary" type="submit" startIcon={<SearchIcon />}>搜索</MButton>
                        <MButton variant="outlined" onClick={resetFilter} startIcon={<ClearAllIcon />}>重置</MButton>
                    </Stack>
                </Form>
            </div>
        );
    };

    //批量操作模块
    const PostBulkActionButtons = () => {
      return (
          <Fragment>
              {/* <ResetOrderNum label="重置排序"  /> */}
              {/* <BulkDeleteWithConfirmButton confirmTitle="删除确认" confirmContent="确认要删除所选记录吗？" mutationMode='undoable' /> */}
          </Fragment>
      );
  };
  //行右侧功能按钮
  const RowAction = () => {
      return (
          <div style={{ textAlign: 'right' }}>
              <EditButton /><br />
              <ShowButton /><br />
              <DeleteWithConfirmButton confirmTitle="删除确认" confirmContent="确认要删除该记录吗？" />
          </div>
      );
  }

  const {classes} = useStyles();
  return (
    <List 
    title={useTxtData.page.tableName + '列表'}
     sort={{ field: 'id', order: 'DESC' }} 
     filters={<Filters />} 
     exporter={false}
     sx={{ "& .MuiToolbar-root .MuiToolbar-root": { height: 0, minHeight: 0 } }}
      >
      <Datagrid
        // bulkActionButtons={<PostBulkActionButtons />}
        bulkActionButtons={false}
      >
        {/* <TextField source="id" /> */}
        {/* <TextField label="名称" source="Name" /> */}
        {/* <TextField label="排序" source="OrderNum" />  */}
        _createWebListCodes_
        <RowAction />
      </Datagrid>
    </List>
  );
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//SHOW页面
export const _Tablename_Show = () => {
  const ShowActions = () => {
    const resource = useResourceContext();
    const redirect = useRedirect();
    return (
        <TopToolbar>
            <Button label="返回列表" onClick={() => redirect(`/${resource}`)} variant="text">
                <ArrowBackIcon />
            </Button>
            <EditButton />
        </TopToolbar>
    );
};

  const {classes} = useStyles();
  return (
    <Show title={'查看' + useTxtData.page.tableName} actions={<ShowActions />}>
      <SimpleShowLayout>
        {/* <TextField source="id" /> */}
        {/* <TextField label="名称" source="Name" /> */}
        {/* <TextField label="排序" source="OrderNum" />  */}
        _createWebListCodes_
      </SimpleShowLayout>
    </Show>
  );
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//编辑页面
export const _Tablename_Edit = () => {
  const resource = useResourceContext();
  const redirect = useRedirect();

    const PostEditActions = () => {
        return (
            <TopToolbar >
                <Button label="返回列表" onClick={() => redirect(`/${resource}`)} variant="text">
                    <ArrowBackIcon />
                </Button>
            </TopToolbar>
        );
    };
    const PostEditToolbar = () => {
        return (
            <Toolbar >
                <SaveButton />
            </Toolbar>
        );
    };
    return (
        <Edit redirect={`/${resource}`} title={'编辑' + useTxtData.page.tableName} actions={<PostEditActions />}>
            <MyForm Edit={true} toolbar={<PostEditToolbar />} />
        </Edit>
    );
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//创建页面
export const _Tablename_Create = () => {
  const resource = useResourceContext();
    const redirect = useRedirect();
    const notify = useNotify();

    const PostCreateActions = () => {
        return (
            <TopToolbar>
                <Button label="返回列表" onClick={() => redirect(`/${resource}`)} variant="text" >
                    <ArrowBackIcon />
                </Button>
            </TopToolbar>
        );
    };
    const PostCreateToolbar = () => {
        const { reset, resetField, handleSubmit, setValue, getValues, } = useFormContext();
        return (
            <Toolbar>
                <SaveButton alwaysEnable label="保存&列表" />
                <SaveButton alwaysEnable type='button' label="保存&继续" variant="text" mutationOptions={{
                  onSuccess: () => {
                    notify('创建成功', { type: 'success' });
                    reset();
                  }
                }} />
            </Toolbar>
        );
    };

    return (
        <Create redirect={`/${resource}`} title={'新增' + useTxtData.page.tableName} actions={<PostCreateActions />}>
            <MyForm Create={true} toolbar={<PostCreateToolbar />} />
        </Create>
    );
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//Create和Edit公用表单
const MyForm = (props: any) => {
  let { Edit, Create } = props;
  return (
    <SimpleForm {...props} >
      {/* <TextInput source="Name" /> */}
      {/* <NumberInput source="OrderNum" /> */}
      _createWebFormCodes_
    </SimpleForm>
  );
}