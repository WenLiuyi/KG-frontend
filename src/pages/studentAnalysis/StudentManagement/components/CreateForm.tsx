import React from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { StuTableListItem } from '../data';

export type CreateType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<StuTableListItem>;

export type CreateFormProps = {
  onCancel: (visible: boolean) => void; // 修改这里的参数类型
  onSubmit: (values: CreateType) => Promise<void>;
  createModalVisible: boolean;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  return (
    <ModalForm
      title="新增学生"
      width="400px"
      visible={props.createModalVisible}
      onVisibleChange={(visible) => {
        if (!visible) {
          props.onCancel(false);
        }
      }}
      initialValues={{}}
      onFinish={props.onSubmit}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '姓名为必填项',
          },
        ]}
        width="md"
        name="name"
        label="姓名"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '学号为必填项',
          },
        ]}
        width="md"
        name="num"
        label="学号"
      />
    </ModalForm>
  );
};

export default CreateForm;
