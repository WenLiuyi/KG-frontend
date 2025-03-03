// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { StuTableListItem } from './data';
import { message } from 'antd';
import { filter } from '../../utils/filterTable';

const baseUrl = 'http://10.70.244.16:12001';

const urlEnum = {
  GET_LIST: '/apis/studentManage/getList',
  ADD_STU: '/apis/studentManage/addStu',
  EDIT_INFO: '/apis/studentManage/editInfo',
  HEAT_MAP: '/apis/studentManage/heatMap',
  EXPLAIN: '/apis/studentManage/explain',
  CHECK_ERROR: '/apis/studentManage/checkError',
  DELETE_STU: '/apis/studentManage/delete',
};

/** 获取规则列表 GET /api/rule */
export async function rule(params: {}, options?: { [key: string]: any }) {
  const req = await request<{
    data?: StuTableListItem[];
    /** 列表的内容总数 */
    msg?: string;
    code?: number;
  }>(`${baseUrl}${urlEnum.GET_LIST}`, {
    method: 'GET',
    params: {
      ...params,
    },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...(options || {}),
  });

  const tableListDataSource: StuTableListItem[] = [];
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
  };
}

/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  const req = await request<{ msg?: string; code?: number }>(`${baseUrl}${urlEnum.EDIT_INFO}`, {
    data: {
      originId: data.num,
      studentName: data.name,
    },
    method: 'POST',
    ...(options || {}),
  });

  return req.code === 200;
}

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  const { name: studentName, num: studentId, ...rest } = data;
  const req = await request<{ msg?: string; code?: number }>(`${baseUrl}${urlEnum.ADD_STU}`, {
    data: {
      studentName,
      studentId,
      ...rest,
    },
    method: 'POST',
    ...(options || {}),
  });

  if (req.code != 200) {
    message.error(req.msg || '添加失败');
    return false;
  } else {
    return true;
  }
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(data: any, options?: { [key: string]: any }) {
  const req = await request<{
    /** 列表的内容总数 */
    msg?: string;
    code?: number;
  }>(`${baseUrl}${urlEnum.DELETE_STU}`, {
    data: {
      studentIds: data.key,
    },
    method: 'POST',
    ...(options || {}),
  });

  if (req.code !== 200) {
    message.error(req.msg);
  }
}

export async function analysisCode(data: any, options?: { [key: string]: any }) {
  const req = await request<{ msg?: string; code?: number }>(`${baseUrl}${urlEnum.EXPLAIN}`, {
    data: {
      studentId: data.num,
    },
    method: 'POST',
    ...(options || {}),
  });
  return req;
}

export async function checkError(data: any, options?: { [key: string]: any }) {
  const req = await request<{ msg?: string; code?: number }>(`${baseUrl}${urlEnum.CHECK_ERROR}`, {
    data: {
      studentId: data.num,
    },
    method: 'POST',
    ...(options || {}),
  });

  // console.log(req);

  if (req.code === 200) {
    message.error(req.msg);
  }
}
