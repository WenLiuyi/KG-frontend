// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { CodeListItem } from './data';
import { message } from 'antd';
import { filter } from '../../utils/filterTable';
import axios from 'axios';

const baseUrl = 'http://10.70.244.16:12001';

const urlEnum = {
  CODE2KNOWLEDGE: '/code/code2knowledge',
  ADD_CODE: '/apis/codeAnalysis/addCode',
  DOWNLOAD: '/apis/codeAnalysis/download',
  GET_LIST: '/apis/codeAnalysis/user_codes',
  DELETE: '/apis/codeAnalysis/delete',
  CHANGE_NAME: '/apis/codeAnalysis/changeName',
};

/** 获取规则列表 GET /api/rule */
export async function rule(params: any, options?: { [key: string]: any }) {
  const req = await request<{
    data?: CodeListItem[];
    /** 列表的内容总数 */
    msg?: string;
    code?: number;
  }>(`${baseUrl}${urlEnum.GET_LIST}?userId=${options?.userId}`, {
    method: 'GET',
    params: {
      ...params,
    },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...(options || {}),
  });

  const tableListDataSource: CodeListItem[] = [];
  let data: any = [];

  if (req.code === 200 && req.data) {
    data = filter(params, req.data, ['name', 'num']);

    // 将数据处理成前端需要的格式
    data.forEach((item: any) => {
      tableListDataSource.push({
        key: item.id,
        num: item.id,
        ...item,
      });
    });
  } else {
    message.error(req.msg || '请求失败');
  }

  return {
    data: tableListDataSource,
    success: req.code === 200,
    // success: req.code == 200,
    total: tableListDataSource.length,
    pageSize: 20,
    current: params.current,
  };
}

/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  const req = await request<{ msg?: string; code?: number }>(`${baseUrl}${urlEnum.CHANGE_NAME}`, {
    data: {
      codeId: data.num,
      name: data.name,
    },
    method: 'POST',
    ...(options || {}),
  });

  console.log(req);

  return req.code === 200;
}

/** 新建规则 POST /api/rule */
export async function addRule(file: any, studentId: string) {
  try {
    const formData = new FormData();
    formData.append('file', file.originFileObj);
    formData.append('studentId', studentId);

    const response = await axios.post(`${baseUrl}${urlEnum.ADD_CODE}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      message.success('代码上传成功');
    } else {
      message.error(response.data.msg || '代码上传失败');
    }
  } catch (error: any) {
    message.error(`代码上传时出错：${error.message || error}`);
  }
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(data: any, options?: { [key: string]: any }) {
  const req = await request<{
    /** 列表的内容总数 */
    msg?: string;
    code?: number;
  }>(`${baseUrl}${urlEnum.DELETE}`, {
    data: {
      codeIds: data.key,
    },
    method: 'POST',
    ...(options || {}),
  });

  if (req.code !== 200) {
    message.error(req.msg);
  }
}

export async function downloadRule(codeId: string): Promise<string> {
  try {
    const response = await axios.get(`${baseUrl}${urlEnum.DOWNLOAD}`, {
      params: { codeId },
    });
    if (response.status === 200) {
      const url = response.data.result;
      const response2 = await axios.get(url, { responseType: 'text' });
      let fileContent = response2.data; // 这里将文件内容转换为字符串
      if (typeof fileContent !== 'string') {
        fileContent = JSON.stringify(fileContent, null, 2); // 对非字符串内容进行处理
      }
      return fileContent;
    } else {
      message.error(response.data.msg || '获取代码失败');
      return ''; // 返回空字符串而不是 null
    }
  } catch (error) {
    message.error('获取文件时发生错误');
    return ''; // 返回空字符串而不是 null
  }
}
