import { Card, Form } from 'antd';
import React, { useState } from 'react';
import { createDynamicModal } from './editInput';
import EdgeTable from './edgeTable';
import CreateSelector from './selector';
import NodeTable from './nodeTable';

interface RightSidebarProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  graph: any;
  model: any;
  fileId: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  inputValue,
  setInputValue,
  visible,
  setVisible,
  id,
  graph,
  model,
  fileId,
}) => {
  const [shouldEdge, setShouldEdge] = useState(0);
  const [shouldNode, setShouldNode] = useState(0);
  // 模拟表格数据

  const handleSearchNode = (value: string) => {
    console.log(value);
  };

  return (
    <Card bordered={false} style={{ marginBottom: '20px' }}>
      <CreateSelector graph={graph} setShouldEdge={setShouldEdge} setShouldNode={setShouldNode} />
      <Form layout="vertical">
        <div
          style={{
            marginTop: '30px', // 添加顶部间隔
          }}
        >
          {createDynamicModal(inputValue, setInputValue, visible, setVisible, id, graph)}
        </div>
        <NodeTable
          graph={graph}
          shouldRender={shouldNode}
          model={model}
          onSearchNode={handleSearchNode}
          fileId={fileId}
        />
        <div
          style={{
            marginTop: '20px', // 添加顶部间隔
          }}
        ></div>
        <EdgeTable
          shouldRender={shouldEdge}
          model={model}
          onSearchNode={handleSearchNode}
          graph={graph}
          fileId={fileId}
        />
      </Form>
    </Card>
  );
};

export default RightSidebar;
