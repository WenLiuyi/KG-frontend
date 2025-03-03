import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { UpdateType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import CreateForm from './components/CreateForm';
import Heatmap from './components/HeatMap';
import { rule, addRule, updateRule, removeRule, analysisCode } from './service';
import type { StuTableListItem, StuTableListPagination } from './data';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { downloadFile } from '../../utils/download';
/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: StuTableListItem) => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
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

const handleUpdate = async (fields: UpdateType, currentRow?: StuTableListItem) => {
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

const handleRemove = async (selectedRows: StuTableListItem[]) => {
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

const fetchHeatmapImage = async (student: any) => {
  try {
    await axios
      .post('http://10.70.244.16:12001/apis/studentManage/heatMap', {
        studentId: student.num,
      })
      .then((response) => {
        if (response.data.code === 200) {
          return true;
        } else {
          message.error(response.data.msg);
          return false;
        }
      });
    return false;
  } catch (error) {
    // 如果请求失败，可以在这里处理错误
    message.error(error);
    return false;
  }
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 查看热力图的弹窗 */
  const [heatmapVisible, handleHeatmapVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<StuTableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<StuTableListItem[]>([]);
  /** 国际化配置 */

  const history = useHistory();

  const handleItemClick = (record: any) => {
    history.push(`/studentAnalysis/CodeAnalysis/${record?.num}`);
  };

  const columns: ProColumns<StuTableListItem>[] = [
    {
      title: '学生姓名',
      dataIndex: 'name',
      width: '18%',
      align: 'center',
    },
    {
      title: '学号',
      dataIndex: 'num',
      width: '15%',
      align: 'center',
    },
    {
      title: '代码分析状态',
      dataIndex: 'status',
      hideInForm: true,
      width: '10%',
      valueEnum: {
        0: {
          text: '未分析',
          status: 'Default',
        },
        2: {
          text: '分析完成',
          status: 'Success',
        },
        1: {
          text: '分析失败',
          status: 'Error',
        },
      },
      search: false,
    },
    {
      title: '最后分析时间',
      dataIndex: 'updatedAt',
      width: '15%',
      align: 'center',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return defaultRender(item);
      },
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <div>
          {/* 第一行 */}
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              setCurrentRow(record); // 更新 currentRow 状态为当前行的数据
              handleUpdateModalVisible(true);
            }}
            style={{ width: '25%', marginBottom: '8px', marginRight: '8px' }}
          >
            编辑信息
          </Button>
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              setCurrentRow(record);
              const getImageData = async () => {
                const imageData = await fetchHeatmapImage(record);
                if (imageData == null) {
                  message.error('暂无热力图');
                } else {
                  handleHeatmapVisible(true);
                }
              };
              getImageData();
            }}
            style={{ width: '25%', marginBottom: '8px', marginRight: '8px' }}
          >
            查看学生能力
          </Button>
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              //console.log(record);
              handleItemClick(record);
            }}
            style={{ width: '25%', marginBottom: '8px' }}
          >
            代码管理
          </Button>
          {/* 第二行 */}
          <br /> {/* 在这里插入一个换行 */}
          <Button
            type="primary"
            size="middle"
            onClick={async () => {
              const req = await analysisCode(record);
              if (req.code === 200) {
                message.success('正在分析');
                actionRef.current?.reloadAndRest?.();
              } else {
                message.error(req.msg ? req.msg : '分析失败');
              }
            }}
            style={{ width: '25%', marginBottom: '8px', marginRight: '8px' }}
          >
            代码分析
          </Button>
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              actionRef.current?.reloadAndRest?.();
              console.log(record.status);
              if (record.status == '1') {
                actionRef?.current?.reload();
                downloadFile(record.num, record.name + ': 出错原因.txt', 3);
              } else if (record.status == '2') {
                message.success('未产生错误');
              } else {
                message.info('暂无已完成的分析');
              }
            }}
            style={{ width: '25%', marginBottom: '8px', marginRight: '8px' }}
          >
            查看出错原因
          </Button>
          <Button
            type="primary"
            size="middle"
            onClick={async () => {
              await handleRemove([record]);
              actionRef.current?.reloadAndRest?.();
            }}
            style={{ width: '25%', marginBottom: '8px' }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<StuTableListItem, StuTableListPagination>
        headerTitle=""
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
            <PlusOutlined /> 添加学生
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
      <CreateForm
        createModalVisible={createModalVisible}
        onCancel={handleModalVisible}
        onSubmit={async (value) => {
          const success = await handleAdd(value as StuTableListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      ></CreateForm>

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
        initialValues={currentRow || {}}
      ></UpdateForm>

      <Heatmap
        student={currentRow}
        visible={heatmapVisible}
        onClose={handleHeatmapVisible}
      ></Heatmap>
    </PageContainer>
  );
};

export default TableList;
