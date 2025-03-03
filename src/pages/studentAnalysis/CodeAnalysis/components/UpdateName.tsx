import React from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { FormValueType } from './UpdateForm';
import type { TableListItem } from '../data';

export type UpdateNameProps ={
    onSubmit: (values: FormValueType) => Promise<void>;
    onCancel: (flag?: boolean, formVals?: FormValueType) => void;
    updateModalVisible: boolean;
    values: Partial<TableListItem>;
}

const UpdateName: React.FC<UpdateNameProps> = (props) => {
    return (
        <ModalForm
            title="编辑文件名称"
            width="400px"

            visible={props.updateModalVisible}
            onFinish={async (value) => {
                await props.onSubmit(value);
            }}
            initialValues={props.values}
            //onVisibleChange={props.onCancel}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => props.onCancel(),
            }}


        >
            <ProFormText
                name="name"
                label="文件名称"
                rules={[{ required: true, message: '请输入文件名称' }]}
            />
        </ModalForm>
    );
};

export default UpdateName;
