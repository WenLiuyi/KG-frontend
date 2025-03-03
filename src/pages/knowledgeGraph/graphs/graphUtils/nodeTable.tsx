import React, { useState, useEffect } from 'react';
import {Input, Table, Space, Form, message, Button, Select, Modal} from 'antd';
import {fixNode, delNode, addNode} from '../api/api';
import { decompressMapping , compressMapping} from '../api/transfromData';

const { Search } = Input;

interface NodeTableProps {
  shouldRender: number;
  model: any;
  onSearchNode: (value: string) => void;
  graph: any;
  fileId: string;
}

const NodeTable: React.FC<NodeTableProps> = ({
  graph,
  shouldRender,
  model,
  onSearchNode,
  fileId,
}) => {
  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [addModalOpen, setaddModalOpen] = useState(false);
    //const [addNode, setaddNode] = useState(false);
    const [newName, setNewName] = useState<string>('');
  useEffect(() => {
    if (model) {
      setName(model.label);
      setId(model.id);
      setWeight(decompressMapping(model.size));
    }
  }, [model]);


    const handleModalOk = async () => {
        if (graph !== null && newName !== '') {
                await addNode(fileId, newName).then(
                    (res: any) => {
                        console.log(res)
                        if (res.code == 200) {
                            message.success(`${res?.msg}`);

                            setaddModalOpen(false)
                        } else {
                            message.error(`${res?.msg}`);
                        }
                    },
                );

        }
    }
  const handleNameEnter = async () => {
    if (graph !== null && id !== '') {
      const item = graph.findById(id);
      if (item != null) {
        console.log(item._cfg.model.label,name)
        await fixNode(fileId, { nodeName: item._cfg.model.label, newNodeName: name }).then(
          (res: any) => {
            console.log(res)
            if (res.code == 200) {
              message.success(`${res?.msg}`);
              graph.updateItem(item, {
                label: name,
              });
            } else {
              message.error(`${res?.msg}`);
              graph.updateItem(item, {
                label: name,
              });
            }
          },
        );
      }
    }
  };

  const handleWeightEnter = async (value: number) => {
    if (graph !== null && id !== '') {
      const item = graph.findById(id);
        if (item != null) {
            console.log(value)
            await fixNode(fileId, { nodeName: item._cfg.model.label,newNodeName: item._cfg.model.label, entityImportance:value }).then(
                (res: any) => {
                    console.log(res)
                    if (res.code == 200) {
                        let color='';
                        message.success(`${res?.msg}`);
                        if (value <= 66 && value >= 34) {
                            color = '#00EE00';
                        } else if (value <= 100 && value >= 67) {
                            color = '#FFB90F';
                        } else {
                            color = '#fff';
                        }
                        console.log(222222)
                        //weight=value
                        graph.updateItem(item, {
                            label: name,
                            size: compressMapping(value),
                            style:{fill:color}
                        });
                        setWeight(""+value);
                    } else {
                        message.error(`${res?.msg}`);
                        graph.updateItem(item, {
                            label: name,
                        });
                    }
                },
            );
        }
    }
  };

  const handleDeleteNode = async () => {
    if (graph !== null && id !== '') {
      const item = graph.findById(id);
      if (item != null) {
        console.log(item._cfg.model.label,name)
        await delNode(fileId, { nodeName: item._cfg.model.label}).then(
            (res: any) => {
              console.log(res)
              if (res.code == 200) {
                message.success(`${res?.msg}`);
                graph.remove(item);
              } else {
                message.error(`${res?.msg}`);
                graph.remove(item);
              }
            },
        );
      }
    }
  };
  const columns = [
    {
      title: '节点属性',
      dataIndex: 'property',
      key: 'property',
    },
    {
      title: '属性值',
      dataIndex: 'value',
      key: 'value',
      render: (value: string) => {
        if (value === 'name') {
          return (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onPressEnter={handleNameEnter}
            />
          );
        }
        if (value === 'id') {
          return (
            <span>{id}</span>
            /*<Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              onPressEnter={handleIdEnter}
            />*/
          );
        }
        if (value === 'weight') {
          return (
            /*<Input
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onPressEnter={handleWeightEnter}
            />*/
            <Select
                value={parseInt(weight)}
                style={{width:120}}
                onChange={handleWeightEnter}
                options={[
                    { value: 33, label: '普通知识点' },
                    { value: 66, label: '重要知识点' },
                    { value: 100, label: '关键知识点' },
                ]}
            />

          );
        }
        return null;
      },
    },
  ];

  const dataSource = [
    {
      key: '1',
      property: '名字',
      value: 'name',
    },
    {
      key: '2',
      property: '编号',
      value: 'id',
    },
    {
      key: '3',
      property: '权重',
      value: 'weight',
    },
  ];

  return shouldRender === 1 ? (
    <div>
        <div style={{display:"block"}}>
            <div style={{display:"flex",justifyContent:"center"}}>
                <Button type="primary" onClick={() => {
                    setaddModalOpen(true);
                }}>
                    新增节点
                </Button>
            </div>

            {/*<Form.Item label="搜索框">*/}
            {/*    <Space>*/}
            {/*        <Search placeholder="请输入元素名称" onSearch={onSearchNode} />*/}
            {/*    </Space>*/}
            {/*</Form.Item>*/}

        </div>


      <Table columns={columns} dataSource={dataSource} pagination={false} bordered />
      <div style={{ float: 'right' }}>
        <Button type="primary" onClick={handleNameEnter} style={{ marginTop: '3vh', marginRight: '2vh' }}>
          确认修改
        </Button>
        <Button danger onClick={handleDeleteNode} style={{ marginTop: '3vh' }}>
          删除该节点
        </Button>
      </div>
        <Modal title="新增节点" open={addModalOpen} onCancel={() => {
            setaddModalOpen(false);
        }}
        onOk={handleModalOk}>
            <span style={{fontSize:'16px'}}>输入新节点名称:</span>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} style={{marginTop:'12px',width:"50%",marginLeft:'12px'}}/>
        </Modal>
    </div>
  ) : null;
};

export default NodeTable;
