import * as React from 'react';
import { Fragment } from 'react';
import {required,minLength,maxLength,minValue,maxValue,number,regex,email,choices } from 'react-admin';
import {useRedirect,List,Datagrid,TextField,Filter,TextInput,EditButton,Edit,Create,SimpleForm,NumberInput,BulkDeleteWithConfirmButton,Button,SaveButton,Toolbar,TopToolbar,DeleteWithConfirmButton} from 'react-admin';
import { ArrowBack } from '@material-ui/icons';
//import ResetOrderNum from './_tablename__ResetOrderNum';

{/* 
  import { _Tablename_List, _Tablename_Create, _Tablename_Edit } from './components/_Tablename_';

  <Resource name="CMS_Tablename_" list={_Tablename_List} create={_Tablename_Create} edit={_Tablename_Edit} />
  <Resource name="CMS_Tablename_" list={ListGuesser} create={EditGuesser} edit={EditGuesser} /> 
*/}

//分页列表页面
export const _Tablename_List = (props) => {
  //筛选器模块
  const Filters = (props) => {
    return (
      <Filter {...props}>
        <TextInput label="ID" source="id" alwaysOn resettable />
        {/* <TextInput label="XX" source="name" alwaysOn resettable /> */}
      </Filter>
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
        <EditButton {...props} />
        <DeleteWithConfirmButton {...props} confirmTitle="删除确认" confirmContent="确认要删除该记录吗？" />
      </div>
    );
  }

  return (
    <List {...props} title="XX列表" sort={{ field: 'id', order: 'DESC' }} filters={<Filters />} bulkActionButtons={<AssetBulkActionButtons />} >
      <Datagrid style={{ tableLayout: 'fixed' }}>
        <TextField source="id" />
        {/* <TextField label="名称" source="Name" /> */}
        {/* <TextField label="排序" source="OrderNum" />  */}
        <RowAction />
      </Datagrid>
    </List>
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
    <Edit undoable={false} {...props} actions={<PostEditActions />}>
      <MyForm toolbar={<PostEditToolbar />} />
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
    <Create undoable={false} {...props} actions={<PostCreateActions />}>
       <MyForm toolbar={<PostCreateToolbar />} />
    </Create>
  );
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//Create和Edit公用表单
const MyForm = (props) => {
  return (
    <SimpleForm {...props} >
        {/* <TextInput source="Name" /> */}
        {/* <NumberInput source="OrderNum" /> */} 
    </SimpleForm>
  );
}