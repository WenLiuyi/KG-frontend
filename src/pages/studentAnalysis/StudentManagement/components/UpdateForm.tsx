import React from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { StuTableListItem } from '../data';

export type UpdateType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<StuTableListItem>;

export type UpdateFormProps = {
  onCancel: (visible: boolean) => void; // 修改这里的参数类型
  onSubmit: (values: UpdateType) => Promise<void>;
  updateModalVisible: boolean;
  initialValues: Partial<StuTableListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      title="编辑信息"
      width="400px"
      visible={props.updateModalVisible}
      // 使用 onVisibleChange 替代 onCancel
      onVisibleChange={(visible) => {
        if (!visible) {
          props.onCancel(false);
        }
      }}
      initialValues={props.initialValues}
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
    </ModalForm>
  );
};

export default UpdateForm;
