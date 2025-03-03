import { Select } from 'antd';
import React from 'react';

const { Option } = Select;

interface CreateSelectorProps {
  graph: any;
  setShouldEdge: React.Dispatch<React.SetStateAction<number>>;
  setShouldNode: React.Dispatch<React.SetStateAction<number>>;
}

const CreateSelector: React.FC<CreateSelectorProps> = ({ graph, setShouldEdge, setShouldNode }) => {
  const handleSelectChange = (value: string) => {
    if (graph !== null) {
      graph.setMode(value);
      if (value === 'addNode') {
        setShouldEdge(-1);
      } else if (value === 'addEdge') {
        setShouldEdge(1);
      } else {
        setShouldEdge(0);
      }

      if (value === 'addNode') {
        setShouldNode(1);
      } else if (value === 'addEdge') {
        setShouldNode(-1);
      } else {
        setShouldNode(0);
      }
    }
    //console.log(change);
  };
  return (
    <div>
      <Select defaultValue="default" style={{ width: 300 }} onChange={handleSelectChange}>
        <Option value="default">视图</Option>
        <Option value="addNode">编辑节点</Option>
        <Option value="addEdge">编辑边</Option>
        {/* <Option value="editGraph">编辑图谱（双击节点或边）</Option> */}
      </Select>
    </div>
  );
};

export default CreateSelector;
