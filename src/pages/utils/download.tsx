import { message } from 'antd';
import axios from 'axios';
import { saveAs } from 'file-saver';

const urlEnum = {
  DOWNLOAD: '/apis/fileManage/download',
  CONTENT: '/apis/fileManage/content',
  ERROR_LOAD: '/apis/fileManage/errorLoad',
  DOWNLOAD_WRONG: '/apis/codeAnalysis/downloadWrongMes',
  CHECK_ERROR: '/apis/studentManage/checkError',
};

const baseUrl = 'http://10.70.244.16:12001';

export const downloadFile = async (id: string, fileName: string, type?: number) => {
  let response: any;
  try {
    // 发起 GET 请求获取文件下载的URL,根据type选择url
    if (type == 4) {
      const codeId = id;
      response = await axios.get(`${baseUrl}${urlEnum.DOWNLOAD_WRONG}`, {
        params: { codeId },
      });
    } else if (type == 3) {
      const studentId = id;
      response = await axios.post(`${baseUrl}${urlEnum.CHECK_ERROR}`, {
        studentId,
      });
    } else {
      const fileId = id;
      const url =
        type === 0
          ? `${baseUrl}${urlEnum.DOWNLOAD}`
          : type === 1
          ? `${baseUrl}${urlEnum.CONTENT}`
          : `${baseUrl}${urlEnum.ERROR_LOAD}`;
      response = await axios.get(url, {
        params: { fileId },
      });
    }

    console.log(response);

    if (response.status === 200) {
      const fileUrl = response.data.result ? response.data.result : response.data.url;
      // 下载文件
      saveAs(fileUrl, fileName);
    } else {
      message.error(response.data.msg || '下载文件失败');
    }
  } catch (error: any) {
    message.error(`下载文件时出错：${error.message || error}`);
  }
};
