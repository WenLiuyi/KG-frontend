import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from './service';
import type {
  fileListItem as TableListItem,
  fileListPagination as TableListPagination,
} from './data';
import { downloadFile } from '../../utils/download';
import { ProFormUploadDragger } from '@ant-design/pro-form';
import { useHistory } from 'react-router-dom';

import AnalyzeModeModal from './components/analyzeModeModal';

/**
 * 上传文件
 *
 * @param fields
 */

const handleUploadFiles = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  const fieldKeys: any = Object.keys(fields);

  try {
    // 使用 Promise.all 来并行上传多个文件
    await Promise.all(
      fieldKeys.map(async (key: keyof TableListItem) => {
        let field: any = fields[key];
        await addRule({ ...field });
      }),
    );

    hide();
    message.success('添加成功');
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

const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
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

const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      fileIds: selectedRows.map((row) => row.key),
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
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [fileId, setFileId] = useState<string>('');
  /** 国际化配置 */

  // 管理选择解析模式窗口
  const [selectAnalyzeMode, setSelectAnalyzeMode] = useState<boolean>(false);
  const history = useHistory();
  const [fileList, setFileList] = useState([]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      width: '20%',
      align: 'center',
    },
    {
      title: '上传时间',
      dataIndex: 'updateAt',
      width: '15%',
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
      title: '文件状态',
      dataIndex: 'status',
      hideInForm: true,
      width: '15%',
      valueEnum: {
        0: {
          text: '未进行操作',
          status: 'Default',
        },
        1: {
          text: '文件提取中',
          status: 'Processing',
        },
        2: {
          text: '知识图谱提取中',
          status: 'Processing',
        },
        3: {
          text: '文件提取失败',
          status: 'Error',
        },
        4: {
          text: '知识图谱提取失败',
          status: 'Error',
        },
        5: {
          text: '知识图谱提取成功',
          status: 'Success',
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
        <div>
          <Button
            type="primary"
            key="primary"
            size="middle"
            onClick={() => {
              downloadFile(record.fileId, record.fileName, 0);
            }}
            style={{ width: '30%', marginBottom: '8px', marginRight: '8px' }}
          >
            下载源文件
          </Button>

          <Button
            type="primary"
            key="primary"
            size="middle"
            onClick={() => {
              setSelectAnalyzeMode(true);
              setFileId(record.fileId);
            }}
            style={{ width: '32%', marginBottom: '8px', marginRight: '8px' }}
          >
            解析知识图谱
          </Button>

          <Button
            type="primary"
            key="primary"
            size="middle"
            onClick={() => {
              const status = record['status'];
              if (status == '5') {
                history.push(`/knowledgeGraph/Graphs/${record?.fileId}`);
              } else if (status == '4') {
                message.error('知识图谱解析失败');
              } else {
                message.info('暂无知识图谱');
              }
            }}
            style={{ width: '32%', marginBottom: '8px' }}
          >
            查看知识图谱
          </Button>
          <br />
          <Button
            type="primary"
            key="primary"
            size="middle"
            onClick={() => {
              actionRef?.current?.reload();
              const status = record['status'];
              if (status == '0' || status == '1' || status == '3') {
                message.info('文本还未提取完成');
              } else {
                downloadFile(record.fileId, record.fileName + ': 提取内容.txt', 1);
              }
            }}
            style={{ width: '50%', marginBottom: '8px', marginRight: '8px' }}
          >
            查看文本提取内容
          </Button>
          <Button
            type="primary"
            key="primary"
            size="middle"
            onClick={() => {
              actionRef?.current?.reload();
              const status = record['status'];
              if (status == '3' || status == '4') {
                downloadFile(record.fileId, record.fileName + ': 出错原因.txt', 2);
              } else {
                message.info('未产生错误');
              }
            }}
            style={{ width: '40%', marginBottom: '8px' }}
          >
            查看出错原因
          </Button>
        </div>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="fileId"
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
            <PlusOutlined /> 上传文件
          </Button>,
        ]}
        request={rule}
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
          //console.log(values)
          const { files } = values;
          // 处理多个文件的上传
          await handleUploadFiles(files);
          handleModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
          setFileList([]);
        }}
        destory-on-close
      >
        <div key={Math.random()}>
          <ProFormUploadDragger
            fieldProps={{
              multiple: true,
              onChange(info: any) {
                console.log(info);
                setFileList(info.fileList);
              },
              fileList: fileList,
            }}
            name="files"
            label="上传文件"
            rules={[{ required: true, message: '请上传文件' }]}
            destory-on-close
          />
        </div>
      </ModalForm>

      {/* 选择解析模式窗口 */}
      <AnalyzeModeModal
        selectAnalyzeMode={selectAnalyzeMode}
        setSelectAnalyzeMode={setSelectAnalyzeMode}
        fileId={fileId}
        actionRef={actionRef}
      ></AnalyzeModeModal>

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

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.fileName && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.fileName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.fileName,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
