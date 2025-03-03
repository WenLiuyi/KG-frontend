import React, { useEffect, useState } from 'react';
import type { StuTableListItem } from '../data';
import { Modal, Spin, Image, message } from 'antd';
import axios from 'axios';

interface HeatmapProps {
  student: StuTableListItem | undefined;
  visible: boolean;
  onClose: (vis: boolean) => void;
}

const Heatmap: React.FC<HeatmapProps> = ({ student, visible, onClose }) => {
  if (student == undefined) {
    if (visible) message.error('无法获取学生信息');
    return null;
  }
  const [heatmapImage, setHeatmapImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHeatmapImage = async () => {
    try {
      await axios
        .post('http://10.70.244.16:12001/apis/studentManage/heatMap', {
          studentId: student.num,
        })
        .then((response) => {
          if (response.data.code === 200) {
            console.log(response.data);
            setHeatmapImage(response.data.url);
            return response.data.url;
          } else {
            message.error(response.data.msg);
          }
        });

      return null;
    } catch (error) {
      // 如果请求失败，可以在这里处理错误
      message.error(error);
      return null;
    }
  };

  useEffect(() => {
    // 在组件加载时获取图片数据
    const getImageData = async () => {
      await fetchHeatmapImage();
      setLoading(false);
    };

    getImageData();
  }, [student]); // 仅在组件加载时执行一次

  return (
    <Modal
      title={`学生代码能力热力图-${student.name}-${student.num}`}
      open={visible}
      onCancel={() => {
        onClose(false), setHeatmapImage(null);
      }}
      footer={null}
      width={'100%'}
    >
      {heatmapImage ? (
        <Image src={heatmapImage} alt="热力图" style={{ width: '100%' }} />
      ) : loading ? (
        <Spin spinning={true} size="large" />
      ) : (
        <div>暂无热力图</div>
      )}
    </Modal>
  );
};

export default Heatmap;
