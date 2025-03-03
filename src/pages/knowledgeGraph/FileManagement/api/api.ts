import axios from 'axios';
import { message } from 'antd';
const baseUrl = 'http://10.70.244.16:12001';

// 枚举url
enum urlEnum {
  GET_LIST = '/apis/fileManage/getList',
  ADD_FILE = '/apis/fileManage/addFile',
  DELETE_FILE = '/apis/fileManage/delete',
  DOWNLOAD_FILE = '/apis/fileManage/download',
  EXPLAIN_FILE = '/apis/fileManage/explain',
}

async function myGet(url: string, field: any) {
  console.log(url);
  try {
    const response = await axios({
      method: 'get',
      url: baseUrl + url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: { ...field }, // 请求参数
    });
    return response.data;
  } catch (error: any) {
    // 错误处理
    message.error(`Error: ${error.message}`);
    throw error;
  }
}

async function myPost(url: string, field: any) {
  try {
    const response = await axios({
      method: 'post',
      url: baseUrl + url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: { ...field }, // 请求参数
    });
    return response.data;
  } catch (error: any) {
    // 错误处理
    message.error(`Error: ${error.message}`);
    throw error; // 继续抛出错误，以便调用者知道发生了错误
  }
}

export function getList(field: any) {
  let data: any = [];
  myGet(urlEnum.GET_LIST, field).then((res: any) => {
    if (res.code !== 200) {
      message.error(`${res.msg}`);
    }
    data = res.result;
    console.log(data);
    return data;
  });
  return data;
}

export function addFile(field: any) {
  return myPost(urlEnum.ADD_FILE, field);
}

export function deleteFile(field: any) {
  return myPost(urlEnum.DELETE_FILE, field);
}

export function downloadFile(field: any) {
  return myPost(urlEnum.DOWNLOAD_FILE, field);
}

export function explainFile(field: any) {
  return myPost(urlEnum.EXPLAIN_FILE, field);
}
