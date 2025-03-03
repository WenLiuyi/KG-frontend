import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Modal } from 'antd';
import React, { useState, useRef, useCallback } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from './service';
import type { CodeListItem, CodeListPagination } from './data';
import UpdateName from './components/UpdateName';
import { ProFormUploadDragger } from '@ant-design/pro-form';
import CodeDisplay from '@/pages/studentAnalysis/CodeAnalysis/components/CodeDispaly';

import { useParams } from 'react-router-dom';
import { downloadFile } from '@/pages/utils/download';

/**
 * 上传文件
 *
 * @param fields
 */

const handleUploadFiles = async (fields: any, studentNum: string) => {
  const hide = message.loading('正在添加');
  const fieldKeys: any = Object.keys(fields);
  try {
    // 使用 Promise.all 来并行上传多个文件
    await Promise.all(
      fieldKeys.map(async (key: keyof CodeListItem) => {
        let field: any = fields[key];
        await addRule({ ...field }, studentNum);
      }),
    );

    hide();
    //message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: CodeListItem) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: CodeListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const { studentNum } = useParams<any>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [errorModalVisible, handleErrorVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [codeModalVisible, handleCodeModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CodeListItem>();
  const [selectedRowsState, setSelectedRows] = useState<CodeListItem[]>([]);
  /** 国际化配置 */
  const [updateNameVisible, handleUpdateNameVisible] = useState<boolean>(false);

  const tableRequest = useCallback(
    async (params: any) => {
      while (studentNum === undefined) {
        // 等待直到num不再是undefined
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return rule({ ...params }, { userId: studentNum });
    },
    [studentNum],
  );

  const columns: ProColumns<CodeListItem>[] = [
    {
      title: '文件名称',
      dataIndex: 'name',
      width: 300,
      align: 'center',
    },
    {
      title: '上传时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      width: 250,
      align: 'center',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }
        return defaultRender(item);
      },
      search: false,
    },
    {
      title: '代码知识点提取状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '未提取',
          status: 'Default',
        },
        2: {
          text: '提取完成',
          status: 'Success',
        },
        1: {
          text: '提取出错',
          status: 'Error',
        },
      },
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => [
        <Button
          type="primary"
          size="middle"
          onClick={() => {
            setCurrentRow(record);
            handleCodeModalVisible(true);
          }}
        >
          查看代码
        </Button>,
        <Button
          type="primary"
          size="middle"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateNameVisible(true);
          }}
        >
          编辑文件名称
        </Button>,
        <Button
          type="primary"
          size="middle"
          onClick={() => {
            if (record.status == '1') {
              downloadFile(record.id, record.name + ': 出错原因.txt', 4);
            } else if (record.status == '0') {
              message.info('尚未提取');
            } else {
              message.success('提取成功，未产生错误');
            }
          }}
        >
          查看出错原因
        </Button>,
        <Button
          type="primary"
          key="primary"
          size="middle"
          onClick={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<CodeListItem, CodeListPagination>
        headerTitle="文件信息"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 70,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 上传代码
          </Button>,
        ]}
        request={(params) => tableRequest(params)}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            type="primary"
            danger
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <ModalForm
        title="上传文件"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (values) => {
          const { files } = values;
          // 处理多个文件的上传
          await handleUploadFiles(files, studentNum);
          handleModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
      >
        <ProFormUploadDragger
          fieldProps={{
            multiple: true,
          }}
          name="files"
          label="上传文件"
          rules={[{ required: true, message: '请上传文件' }]}
        />
      </ModalForm>
      <CodeDisplay
        codeObject={currentRow}
        visible={codeModalVisible}
        onClose={handleCodeModalVisible}
      ></CodeDisplay>
      <Modal
        title="查看错误信息"
        open={errorModalVisible}
        onCancel={() => {
          handleErrorVisible(false);
        }}
        footer={null}
      >
        暂无错误信息
      </Modal>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <UpdateName
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);

          if (success) {
            handleUpdateNameVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateNameVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateNameVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<CodeListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<CodeListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
