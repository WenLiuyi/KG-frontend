import React, { useRef } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { StuTableListItem } from '../data';
import type { ActionType } from '@ant-design/pro-table';
import { message } from 'antd';

interface updataInfoFormProps {
  updataInfoVisible: any;
  setUpdataInfoVisible: any;
}

const UpdataInfoForm: React.FC<updataInfoFormProps> = ({
  updataInfoVisible,
  setUpdataInfoVisible,
}) => {
  const actionRef = useRef<ActionType>();

  const handleUpdate = async (fields: StuTableListItem) => {
    const hide = message.loading('正在添加');

    try {
      // await addRule({ ...fields });
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }
  };

  return (
    <ModalForm
      title="编辑信息"
      width="400px"
      visible={updataInfoVisible}
      onVisibleChange={setUpdataInfoVisible}
      initialValues={{ name: '张三', num: '2021001' }}
      onFinish={async (value) => {
        const success = await handleUpdate(value as StuTableListItem);
        if (success) {
          setUpdataInfoVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      }}
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

export default UpdataInfoForm;
