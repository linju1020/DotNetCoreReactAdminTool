import * as React from 'react';
import { Fragment } from 'react';
import {
  useRedirect,
  List,
  Datagrid,
  TextField,
  Filter,
  TextInput,
  NumberField,
  EditButton,
  Edit,
  Create,
  SimpleForm,
  NumberInput,
  BulkDeleteWithConfirmButton,
  Button,
  SaveButton,
  Toolbar,
  TopToolbar,
  ReferenceField,
  ReferenceInput, 
  SelectInput
} from 'react-admin';
import { ArrowBack } from '@material-ui/icons';
import ResetOrderNum from './_tablename__ResetOrderNum';

{/* 
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
        <ResetOrderNum label="重置排序" {...props} />
        <BulkDeleteWithConfirmButton
          {...props}
          confirmTitle="删除确认"
          confirmContent="确认要删除所选记录吗？"
        />
      </Fragment>
    );
  };

  return (
    <List
      {...props}
      title="XX列表"
      sort={{ field: 'id', order: 'DESC' }}
      filters={<Filters />}
      bulkActionButtons={<AssetBulkActionButtons />}
    >
      <Datagrid style={{ tableLayout: 'fixed' }}>
        <TextField source="id" />
        {/* <TextField label="名称" source="name" />
        <TextField label="排序" source="ordernum" /> */}
        <EditButton />
      </Datagrid>
    </List>
  );
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//编辑页面
export const _Tablename_Edit = (props) => {
  const PostEditActions = (props) => {
    const { basePath } = props;
    const redirect = useRedirect();
    return (
      <TopToolbar {...props}>
        <Button
          label="返回列表"
          onClick={() => redirect(basePath)}
          variant="text"
        >
          <ArrowBack />
        </Button>
      </TopToolbar>
    );
  };
  const PostEditToolbar = (props) => {
    const { basePath } = props;
    return (
      <Toolbar {...props}>
        <SaveButton />
      </Toolbar>
    );
  };
  return (
    <Edit {...props} actions={<PostEditActions />}>
      <SimpleForm toolbar={<PostEditToolbar />}>
        {/* <TextInput source="id" /> */}
        {/* <TextInput source="name" />
        <NumberInput source="ordernum" /> */}
      </SimpleForm>
    </Edit>
  );
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//创建页面
export const _Tablename_Create = (props) => {
  const PostCreateActions = (props) => {
    const { basePath } = props;
    const redirect = useRedirect();
    return (
      <TopToolbar {...props}>
        <Button
          label="返回列表"
          onClick={() => redirect(basePath)}
          variant="text"
        >
          <ArrowBack />
        </Button>
      </TopToolbar>
    );
  };
  const PostCreateToolbar = (props) => {
    const { basePath } = props;
    return (
      <Toolbar {...props}>
        <SaveButton
          label="保存&列表"
          redirect={basePath}
          submitOnEnter={true}
        />
        <SaveButton
          label="保存&继续"
          redirect={false}
          submitOnEnter={false}
          variant="text"
        />
      </Toolbar>
    );
  };

  return (
    <Create {...props} actions={<PostCreateActions />}>
      <SimpleForm toolbar={<PostCreateToolbar />}>
        {/* <TextInput source="id" /> */}
        <TextInput source="name" />
        <NumberInput source="ordernum" />
      </SimpleForm>
    </Create>
  );
};
