import { Input, Modal } from 'antd';
import React from 'react';

export function createDynamicModal(
  inputValue: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  id: string,
  graph: any,
) {
  const handleOk = () => {
    setVisible(false);
    if (graph !== null && id !== '') {
      const item = graph.findById(id);
      if (item != null) {
        graph.updateItem(item, {
          label: inputValue,
        });
      }
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Modal title="Input Dialog" open={visible} onOk={handleOk} onCancel={handleCancel}>
      <Input value={inputValue} onChange={handleInputChange} />
    </Modal>
  );
}
