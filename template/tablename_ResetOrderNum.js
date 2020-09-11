import * as React from 'react';
import { Fragment, useState } from 'react';
import {
    useRefresh,
    useNotify,
    useUnselectAll,
    useUpdateMany,
    Button,
    Confirm,
} from 'react-admin';
import { Info } from '@material-ui/icons';


//功能
const _tablename_ResetOrderNum = (props) => {
    const { label, basePath, selectedIds } = props;
    const basePathName = basePath.replace('/', '');
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();

    const [updateMany, { loading }] = useUpdateMany(
        basePathName,
        selectedIds,
        { payload: 'ResetOrderNum', data: { ordernum: 0 } },
        {
            onSuccess: () => {
                refresh();
                notify('操作成功');
                unselectAll(basePathName);
            },
            onFailure: (error) => notify('执行失败', 'warning'),
        }
    );

    const [open, setOpen] = useState(false);
    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);
    const handleConfirm = () => {
        updateMany();
        handleDialogClose();
    };
    return (
        <Fragment>
            <Button label={label} disabled={loading} onClick={handleClick}>
                <Info />
            </Button>
            <Confirm
                isOpen={open}
                loading={loading}
                title="确认操作"
                content="确定要执行该操作吗？"
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

export default _tablename_ResetOrderNum;