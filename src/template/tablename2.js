import * as React from 'react';
import { Fragment } from 'react';
import { Route } from 'react-router';
import { Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Form } from 'react-final-form';
import { required, minLength, maxLength, minValue, maxValue, number, regex, email, choices } from 'react-admin';
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
  CreateButton
} from 'react-admin';
import { Button as CButton, Box } from '@material-ui/core';
import { PreviewImage, UpLoadFile } from './custom/UpLoadFile';
import { ArrowBack, Search } from '@material-ui/icons';
//import ResetOrderNum from './_tablename__ResetOrderNum';

{/* 
  import { _Tablename_List, _Tablename_Create, _Tablename_Edit } from './components/_Tablename_';

  <Resource name="CMS_Tablename_" list={_Tablename_List} />
  <Resource name="CMS_Tablename_" list={ListGuesser} create={EditGuesser} edit={EditGuesser} show={ShowGuesser} /> 
*/}

const useStyles = makeStyles({
  imageField: {
    '& img': { width: 60 }
  },
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
export const _Tablename_List = (props) => {
  const { basePath } = props;
  const redirect = useRedirect();

  //筛选器模块
  // const Filters = (props) => {
  //   return (
  //     <Filter {...props}>
  //       <TextInput label="ID" source="id" alwaysOn resettable />
  //       {/* <TextInput label="XX" source="name" alwaysOn resettable /> */}
  //     </Filter>
  //   );
  // };
  const Filters = (props) => {
    const { displayedFilters, filterValues, setFilters, hideFilter, } = useListContext();
    if (props.context === "button") return null;
    const onSubmit = values => { if (Object.keys(values).length > 0) { setFilters(values); } else { setFilters({}, []); } };
    const resetFilter = () => { setFilters({}, []); };
    return (
      <div>
        <Form onSubmit={onSubmit} initialValues={filterValues}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box display='flex' alignItems='center'>
                <Box component="span" mr={2}>
                  <TextInput label="ID" source="id" alwaysOn resettable />
                </Box>
                <Box component="span" mr={2} mb={2.5}>
                  <CButton variant="contained" color="primary" type="submit" startIcon={<Search />}>搜索</CButton>
                </Box>
                <Box component="span" mr={2} mb={2.5}>
                  <CButton variant="outlined" onClick={resetFilter}>重置</CButton>
                </Box>
              </Box>
            </form>
          )}
        </Form>
      </div>
    );
  };

  //批量操作模块
  const AssetBulkActionButtons = (props) => {
    return (
      <Fragment>
        {/* <ResetOrderNum label="重置排序" {...props} /> */}
        <BulkDeleteWithConfirmButton {...props} confirmTitle="删除确认" confirmContent="确认要删除所选记录吗？" />
      </Fragment>
    );
  };
  //行右侧功能按钮
  const RowAction = (props) => {
    return (
      <div style={{ textAlign: 'right' }}>
        <EditButton {...props} /><br />
        <DeleteWithConfirmButton {...props} confirmTitle="删除确认" confirmContent="确认要删除该记录吗？" />
      </div>
    );
  }
  //表格右上角功能按钮
  const ListActions = ({ basePath }) => {
    return (
      <TopToolbar>
        <CreateButton basePath={basePath} />
      </TopToolbar>
    );
  }
  //返回到列表
  const handleClose = () => {
    redirect(basePath);
  };

  const classes = useStyles();
  return (
    <React.Fragment>
      <List {...props} title={useTxtData.page.tableName + '列表'} sort={{ field: 'id', order: 'DESC' }} filters={<Filters />} bulkActionButtons={<AssetBulkActionButtons />} actions={<ListActions />} empty={false}>
        <Datagrid>
          {/* <TextField source="id" /> */}
          {/* <TextField label="名称" source="Name" /> */}
          {/* <TextField label="排序" source="OrderNum" />  */}
          _createWebListCodes_
          <RowAction />
        </Datagrid>
      </List>
      <Route path={`${basePath}/create`} >
        {({ match }) => (
          <Drawer
            open={!!match}
            anchor="right"
            onClose={handleClose}
          >
            <_Tablename_Create {...props}
              onCancel={handleClose}
            />
          </Drawer>
        )}
      </Route>
      <Route path={`${basePath}/:id`}>
        {({ match }) => {
          const isMatch =
            match &&
            match.params &&
            match.params.id !== 'create';
          return (<Drawer
            open={isMatch}
            anchor="right"
            onClose={handleClose}
          >
            {isMatch ? (
              <_Tablename_Edit {...props}
                id={isMatch ? match.params.id : null}
                onCancel={handleClose}
              />
            ) : null}
          </Drawer>)
        }}
      </Route>
    </React.Fragment>
  );
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//编辑页面
export const _Tablename_Edit = (props) => {
  const PostEditActions = (props) => {
    const { basePath } = props; const redirect = useRedirect();
    return (
      <TopToolbar {...props}>
        <Button label="返回列表" onClick={() => redirect(basePath)} variant="text">
          <ArrowBack />
        </Button>
      </TopToolbar>
    );
  };
  const PostEditToolbar = (props) => {
    return (
      <Toolbar {...props}>
        <SaveButton />
      </Toolbar>
    );
  };
  return (
    <Edit title={'编辑' + useTxtData.page.tableName} undoable={false} {...props} actions={<PostEditActions />}>
      <MyForm Edit={true} toolbar={<PostEditToolbar />} />
    </Edit>
  );
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//创建页面
export const _Tablename_Create = (props) => {
  const PostCreateActions = (props) => {
    const { basePath } = props; const redirect = useRedirect();
    return (
      <TopToolbar {...props}>
        <Button label="返回列表" onClick={() => redirect(basePath)} variant="text" >
          <ArrowBack />
        </Button>
      </TopToolbar>
    );
  };
  const PostCreateToolbar = (props) => {
    const { basePath } = props;
    return (
      <Toolbar {...props}>
        <SaveButton label="保存&列表" redirect={basePath} submitOnEnter={true} />
        <SaveButton label="保存&继续" redirect={false} submitOnEnter={false} variant="text" />
      </Toolbar>
    );
  };

  return (
    <Create title={'新增' + useTxtData.page.tableName} undoable={false} {...props} actions={<PostCreateActions />}>
      <MyForm Create={true} toolbar={<PostCreateToolbar />} />
    </Create>
  );
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//Create和Edit公用表单
const MyForm = (props) => {
  let { Edit, Create } = props;
  return (
    <SimpleForm {...props} >
      {/* <TextInput source="Name" /> */}
      {/* <NumberInput source="OrderNum" /> */}
      _createWebFormCodes_
    </SimpleForm>
  );
}