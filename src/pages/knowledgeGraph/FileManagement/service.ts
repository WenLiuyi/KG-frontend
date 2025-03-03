// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { fileListItem as TableListItem } from './data';
import { message } from 'antd';
import { filter } from '../../utils/filterTable';
import axios from 'axios';
const baseUrl = 'http://10.70.244.16:12001';

// 枚举url
enum urlEnum {
  GET_LIST = '/apis/fileManage/getList',
  ADD_FILE = '/apis/fileManage/addFile',
  DELETE_FILE = '/apis/fileManage/delete',
  DOWNLOAD_FILE = '/apis/fileManage/download',
  EXPLAIN_FILE = '/apis/fileManage/explain',
}

export async function rule(params: any, options?: { [key: string]: any }) {
  const req = await request<{
    result?: TableListItem[];
    /** 列表的内容总数 */
    msg?: string;
    code?: number;
  }>(`${baseUrl}${urlEnum.GET_LIST}`, {
    method: 'GET',
    params: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });

  const tableListDataSource: TableListItem[] = [];
  let data: any = [];

  // 如果请求成功并且有返回数据
  if (req.code === 200 && req.result) {
    data = filter(params, req.result, ['fileName']);
    // 将数据处理成前端需要的格式
    data.forEach((item: any) => {
      tableListDataSource.push({
        key: item.fileId,
        ...item,
      });
    });
  } else {
    message.error(req.msg || '请求失败');
  }

  return {
    data: tableListDataSource,
    success: req.code === 200,
    total: tableListDataSource.length,
  };
}

/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(file: any) {
  try {
    const formData = new FormData();
    formData.append('file', file.originFileObj); // Ensure file is a Blob or File object

    const response = await axios.post(`${baseUrl}${urlEnum.ADD_FILE}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      message.success('文件上传成功');
    } else {
      message.error(response.data.msg || '文件上传失败');
    }
  } catch (error: any) {
    message.error(`文件上传时出错：${error.message || error}`);
  }
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(data: { fileIds: number[] }, options?: { [key: string]: any }) {
  const req = await request<{
    /** 列表的内容总数 */
    msg?: string;
    code?: number;
  }>(`${baseUrl}${urlEnum.DELETE_FILE}`, {
    data,
    method: 'POST',
    ...(options || {}),
  });

  if (req.code !== 200) {
    message.error(req.msg);
  }
}
