import axios from 'axios';
import { message } from 'antd';
import { getGraphData } from './transfromData';
const baseUrl = 'http://10.70.244.16:12001';

// 枚举url
enum urlEnum {
  GET_DATA = '/apis/graph/getGraph',
  GET_TEST = '/file/test',
  ADD_NODE = '/apis/graph/addNode',
  ADD_EDGE = '/apis/graph/addEdge',
  FIX_NODE = '/apis/graph/fixNode',
  FIX_EDGE = '/apis/graph/fixEdge',
  DEL_NODE = '/apis/graph/deleteNode',
  DEL_EDGE = '/apis/graph/deleteEdge',
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
  }
}

export async function getGraph(graph: any, fileId: string) {
  try {
    await axios.get(`${baseUrl}${urlEnum.GET_DATA}?fileId=${fileId}`).then((res: any) => {
      if (res.data.code !== 200) {
        message.error(`${res.data.msg}`);
      } else {
        let data = res.data;
        console.log(data);
        return getGraphData(graph, data);
      }
    });
  } catch (error: any) {
    // 错误处理
    message.error(`Error: ${error.message}`);
  }
}

export async function addNode(fileId: string, nodeName: string) {
   return myPost(urlEnum.ADD_NODE, { fileId: fileId, nodeName: nodeName });
}



export async function addEdge(fileId: string, edgeName: string,source: string, target: string) {
  return myPost(urlEnum.ADD_EDGE, {
    fileId: fileId,
    edgeName: edgeName,
    source: source,
    target: target,
  });
}

export async function fixNode(fileId: string, field: any) {
  return myPost(urlEnum.FIX_NODE, {
    fileId: fileId,
    ...field,
  });
}

export async function delNode(fileId: string, field: any) {
  return myPost(urlEnum.DEL_NODE, {
    fileId: fileId,
    ...field,
  });
}

export async function fixEdge(fileId: number, field: any) {
  return myPost(urlEnum.FIX_EDGE, {
    fileId: fileId,
    ...field,
  });
}
export async function delEdge(fileId: number, field: any) {
  return myPost(urlEnum.DEL_EDGE, {
    fileId: fileId,
    ...field,
  });
}
