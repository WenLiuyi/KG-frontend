import G6, { Graph } from '@antv/g6';
import { useEffect, useRef, useState } from 'react';
import { addEdgeBehavior, customClickBehavior, editGraphBehavior } from './graphUtils/behavior';
import RightSidebar from './graphUtils/rightSide';
import { addNode, getGraph } from './api/api';
import { useParams } from 'react-router-dom';
import { Input, message, Modal } from 'antd';
import { compressMapping } from '@/pages/knowledgeGraph/graphs/api/transfromData';
const MyGraph = () => {
  const { fileId } = useParams<any>();
  const graphContainer = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [graph, setGraph] = useState<Graph | null>(null);
  const [id, setId] = useState<string>('');
  const [item, setItem] = useState<any>(null);
  const [addModalOpen, setaddModalOpen] = useState(false);
  const [newName, setNewName] = useState<string>('');
  const [clickPosition, setClickPosition] = useState<any>(null);
  //初始化图
  useEffect(() => {
    const initMyGraph = async () => {
      const graphInstance = new G6.Graph({
        container: graphContainer.current!,
        width: graphContainer.current!.clientWidth,
        height: graphContainer.current!.clientHeight,
        fitView: true,
        fitViewPadding: [20, 40, 50, 20],

        defaultNode: {
          size: 45, // 节点大小
          style: {
            //fill: 'steelblue', // 节点填充色
            stroke: '#666', // 节点描边色
            lineWidth: 1, // 节点描边粗细
          },
          stateStyles: {
            focus: {
              fill: '#2B384E',
            },
          },
        },
        defaultEdge: {
          type: 'line',
          size: 1, // 边线粗细
          color: '#888', // 边线颜色黑色
          //给文字添加立体效果
          labelCfg: {
            style: {
              fontSize: 8,
              shadowColor: '#fff',
              shadowBlur: 5,
            },
          },
        },
        layout: {
          type: 'fruchterman',
          gravity: 2,
          speed: 5,
          // for rendering after each iteration
          tick: () => {
            graphInstance.refreshPositions();
          },
          workerEnabled: true,
        },
        animate: true,
        modes: {
          // Defualt mode
          default: ['drag-canvas', 'drag-node', 'click-select', 'custom-click'],
          // Adding node mode
          addNode: [
            'drag-canvas',
            'click-add-node',
            'click-select',
            'custom-click',
            'click-add-node1',
          ],
          // Adding edge mode
          addEdge: ['drag-canvas', 'click-add-edge', 'click-select'],
          editGraph: ['drag-canvas', 'dblclick-edit-graph', 'click-select', 'custom-click'],
        },
        // The node styles in different states
        nodeStateStyles: {
          // The node styles in selected state
          selected: {
            stroke: '#444',
            lineWidth: 2,
            fill: 'steelblue',
          },
        },
      });

      setGraph(graphInstance);

      graphInstance.render();

      if (graphInstance.getCurrentMode() == 'editGraph') {
        graphInstance.on('dblclick', (evt) => {
          const item = evt.item;
          if (item != null) {
            setVisible(true);
            setId(item.getID());
          }
        });
      }
    };

    initMyGraph();
    const resizeObserver = new ResizeObserver(() => {
      if (graph !== null && graphContainer.current !== null) {
        graph.changeSize(graphContainer.current.clientWidth, graphContainer.current.clientHeight);
      }
    });

    if (graphContainer.current !== null) {
      resizeObserver.observe(graphContainer.current);
    }

    return () => {
      if (graph !== null) {
        graph.destroy();
      }
    };
  }, [setVisible, setId, setItem]);
  const handleAddNodeModalOk = async () => {
    if (graph !== null && newName !== '') {
      await addNode(fileId, newName).then((res: any) => {
        console.log(res);
        if (res.code == 200) {
          message.success(`${res?.msg}`);
          if (res.code == 200) {
            const color = '#FFB90F';
            graph.addItem('node', {
              x: clickPosition?.x,
              y: clickPosition?.y,
              label: newName,
              id: '' + res.entity_id,
              size: compressMapping(100),
              style: { fill: color },
            });
            console.log(clickPosition);
          }

          setaddModalOpen(false);
        } else {
          message.error(`${res?.msg}`);
        }
      });
    }
  };
  const addNodeBehavior = async () => {
    G6.registerBehavior('click-add-node1', {
      getEvents() {
        return {
          'canvas:click': 'onClick',
        };
      },
      async onClick(ev: any) {
        setClickPosition({ x: ev.canvasX, y: ev.canvasY });
        console.log(clickPosition);
        if (graph) {
          setaddModalOpen(true);
        }
      },
    });
  };
  //添加行为&添加选择器
  useEffect(() => {
    if (!graph) return;
    //graph.setMode('default');

    getGraph(graph, fileId).then(() => {
      // 在成功获取数据后进行布局
      graph.layout();
      const toolbar = new G6.ToolBar({
        position: { x: 10, y: 10 },
      });
      graph.addPlugin(toolbar);
      graph.set('enabledStack', true);
      customClickBehavior(setItem);
      graph.addBehaviors('custom-click', 'default');
      addNodeBehavior();
      addEdgeBehavior(graph, setItem, fileId);
      editGraphBehavior(setVisible, setId);
    });
    //console.log(graph.getCurrentMode());

    //graph.render();
  }, [graph, fileId]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* {createDynamicModal(inputValue, setInputValue, visible, setVisible, id, graph)} */}
      <div id="graphContainer" ref={graphContainer} style={{ width: '75%', height: '100%' }}></div>
      <div
        style={{
          right: 0,
          width: '30%',
          height: '100%',
          overflow: 'auto',
          padding: '1%',
          backgroundColor: '#fff',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <RightSidebar
          inputValue={inputValue}
          setInputValue={setInputValue}
          visible={visible}
          setVisible={setVisible}
          id={id}
          graph={graph}
          model={item}
          fileId={fileId}
        />
      </div>
      <Modal
        title="新增节点"
        open={addModalOpen}
        onCancel={() => {
          setaddModalOpen(false);
        }}
        onOk={handleAddNodeModalOk}
      >
        <span style={{ fontSize: '16px' }}>输入新节点名称:</span>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ marginTop: '12px', width: '50%', marginLeft: '12px' }}
        />
      </Modal>
    </div>
  );
};

export default MyGraph;
