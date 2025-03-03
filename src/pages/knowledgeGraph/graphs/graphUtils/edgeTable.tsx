import {Button, Card, Form, Input, Space, Table, message} from 'antd';
import React, { useEffect, useState } from 'react';
import { fixEdge,delEdge } from '../api/api';
import {decompressWeight, decompressMapping, compressWeight} from '../api/transfromData';

const { Search } = Input;

interface RightSidebarContentProps {
  shouldRender: number;
  model: any;
  onSearchNode: (value: string) => void;
  graph: any;
  fileId: any;
}

const RightSidebarContent: React.FC<RightSidebarContentProps> = ({
  shouldRender,
  model,
  onSearchNode,
  graph,
  fileId,
}) => {
  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  const [weight, setWeight] = useState<string>('');

  /*const staticDataRef = [
    {
      key: '1',
      property: '名字',
      value: name,
    },
    {
      key: '2',
      property: '编号',
      value: id,
    },
    {
      key: '3',
      property: '权重',
      value: weight,
    },
    {
      key: '4',
      property: '起点',
      value: source,
    },
    {
      key: '5',
      property: '终点',
      value: target,
    },
  ];*/

  /*const staticColumnsRef = [
    {
      title: '关系属性',
      dataIndex: 'property',
      key: 'property',
    },
    {
      title: '属性值',
      dataIndex: 'value',
      key: 'value',
    },
  ];*/

  useEffect(() => {
    if (model && model.source && model.target) {
      setName(model.label);
      setId(model.id);
      setSource(graph.findById(model['source']).getModel().label);
      setTarget(graph.findById(model['target']).getModel().label);
      setWeight(decompressWeight(model.style.lineWidth));
    } else if (model && !shouldRender) {
      setName(model.label);
      setId(model.id);
      setWeight(decompressMapping(model.size));
      setSource('');
      setTarget('');
    }
  }, [model]);

  /*const handleIdEnter = () => {
    if (graph !== null && id !== '') {
      const item = graph.findById(id);

      if (item != null) {
        graph.updateItem(item, {
          id: id,
        });
      }
    }
  };*/

  const handleNameEnter = async () => {
    if (graph !== null && id !== '') {
      const item = graph.findById(id);
      if (item != null) {
          await fixEdge(fileId, {
          edgeName: item._cfg.model.label==null?"":item._cfg.model.label,
          newEdgeName: name,
          source: source,
          target: target,
        }).then((res: any) => {
            console.log(item._cfg.model.label,name)
            if (!res || res.code == 200) {
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
        });
      }
    }
  };

    const handleWeightEnter = async () => {
        if (graph !== null && id !== '') {
            const item = graph.findById((id));
            console.log(item)
            if (item != null) {
                await fixEdge(fileId, {
                    edgeName: item._cfg.model.label,name,
                    newEdgeName: name,
                    source: source,
                    target: target,
                    edge_weight:weight
                }).then((res: any) => {
                    if (!res || res.code == 200) {
                        message.success(`${res?.msg}`);
                        const ls=graph.updateItem(item, {
                            label: name,
                            style:{lineWidth:compressWeight(parseInt(weight))}
                        });
                    } else {
                        message.error(`${res?.msg}`);

                    }
                });
            }
        }
    };

  const handleDeleteEdge = async () => {
    if (graph !== null && id !== '') {
      const item = graph.findById(id);
      if (item != null) {
        await delEdge(fileId, {
          edgeName: item._cfg.model.label,name,
          source: source,
          target: target,
        }).then((res: any) => {
          if (res.code == 200) {
            message.success(`${res?.msg}`);
            graph.remove(item);
          } else {
            message.error(`${res?.msg}`);
            graph.remove(item);
          }
        });
      }
    }
  };

  const viewColumns = [
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

        if (value === 'weight' || value === 'size') {
            let str='   ';
            if (parseInt(weight) <= 66 && parseInt(weight) >= 34) {
                str='重要知识点';
            } else if (parseInt(weight) <= 100 && parseInt(weight) >= 67) {
                str = '关键知识点';
            } else if (parseInt(weight) <34){
                str = '普通知识点';
            }
            console.log(target)
            if (target!==''){
                str = weight;
            }
          return (
            <span>{str}</span>
          );
        }else if(value==='id'){
            return (
                <span>{id}</span>
            );
        }else if(value==='name'){
            return (
                <span>{name}</span>
            );
        }else if(value==='source'){
            return (
                <span>{source}</span>
            );
        }else if(value==='target'){
            return (
                <span>{target}</span>
            );
        }else {
          return null
        }
      },
    },
  ];
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
                if (value === 'id') {
                    return (
                        <span>{id}</span>
                        /*<Input
                          value={id}
                          onChange={(e) => setId(e.target.value)}
                          onPressEnter={handleIdEnter}
                        />*/
                    );
                }if (value === 'name') {
                    return (
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onPressEnter={handleNameEnter}
                        />
                    );
                }

                if (value === 'source') {
                    return (
                        <span>{source}</span>
                    );
                }
                if (value === 'target') {
                    return (
                        <span>{target}</span>
                    );
                }
                if (value === 'weight') {
                    return (
                        <Input
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            onPressEnter={handleWeightEnter}
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
    {
      key: '4',
      property: '起点',
      value: 'source',
    },
    {
      key: '5',
      property: '终点',
      value: 'target',
    },
  ];

  return shouldRender === 0 ? (
    <div>
      {/*<Form.Item label="搜索框">*/}
      {/*  <Space>*/}
      {/*    <Search placeholder="请输入节点一" onSearch={onSearchNode} />*/}
      {/*    <Search placeholder="请输入节点二" onSearch={onSearchNode} />*/}
      {/*  </Space>*/}
      {/*</Form.Item>*/}
      <Card bordered={false} style={{ marginLeft: '-30px' }}>
        <Form>
          <Form.Item>
            <Table
              dataSource={dataSource}
              columns={viewColumns}
              pagination={false}
              showHeader={true}
              bordered
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  ) : shouldRender === 1 ? (
    <div>
      {/*<Form.Item label="搜索框">*/}
      {/*  <Space>*/}
      {/*    <Search placeholder="请输入节点一" onSearch={onSearchNode} />*/}
      {/*    <Search placeholder="请输入节点二" onSearch={onSearchNode} />*/}
      {/*  </Space>*/}
      {/*</Form.Item>*/}
      <Table columns={columns} dataSource={dataSource} pagination={false} bordered />
      <div style={{ float: 'right' }}>
        <Button type="primary" onClick={handleWeightEnter} style={{ marginTop: '3vh', marginRight: '2vh' }}>
          确认修改
        </Button>
        <Button danger onClick={handleDeleteEdge} style={{ marginTop: '3vh' }}>
          删除该节点
        </Button>
      </div>
    </div>
  ) : null;
};

export default RightSidebarContent;
