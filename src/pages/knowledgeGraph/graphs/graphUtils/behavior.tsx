import G6 from '@antv/g6';
import { addNode, addEdge } from '../api/api';
import {message} from 'antd';
import {compressWeight} from "@/pages/knowledgeGraph/graphs/api/transfromData";

// 添加节点行为
export function addNodeBehavior(graph: any, addedCount: number, setItem: any, fileId: string) {
    let clickPosition: { x: number; y: number } | null = null;

    G6.registerBehavior('click-add-node', {
        getEvents() {
            return {
                'canvas:click': 'onClick',
            };
        },
        async onClick(ev: any) {
            clickPosition = { x: ev.canvasX, y: ev.canvasY };
            if (graph) {
                message.loading({ content: 'Adding node...', key: 'add-node-loading', duration: 0 }); // 显示加载提示
                    await addNode(fileId,"1").then((res: any) => {
                    console.log(res);
                    if (!res || res?.code == 200) {
                        message.error({ content: `${res?.msg}`, key: 'add-node-loading' }); // 显示加载错误提示
                    } else {
                        const newNode = graph.addItem('node', {
                            x: clickPosition?.x,
                            y: clickPosition?.y,
                            label: `newNode-${addedCount}`,
                        });
                        //addedCount++;

                        // 获取新节点的模型并将其设置到 setItem 中
                        const newNodeModel = newNode.getModel();
                        setItem(newNodeModel);
                        message.success({ content: '添加成功', key: 'add-node-loading' }); // 显示加载成功提示
                    }
                });
            }
        },
    });
}


// 添加边行为
export function addEdgeBehavior(graph: any, setItem: any, fileId: string) {
  G6.registerBehavior('click-add-edge', {
    getEvents() {
      return {
        'node:click': 'onClick',
        mousemove: 'onMousemove',
        'edge:click': 'onEdgeClick',
      };
    },
    async onClick(ev: { item: any; x: number; y: number }) {

      const self: any = this;
      const node = ev.item;
      const model = node.getModel();
      if (graph !== null && graph !== undefined) {
        if (self.addingEdge && self.edge) {

          // graph.updateItem(self.edge, {
          //   target: model.id,
          // });
          const source = self.edge.getSource();
          const target = self.edge.getTarget();

          await addEdge(fileId, "1",source._cfg.model.label, model.label).then((res: any) => {
              console.log(res)
              if (res && res.code === 200) {
                  const preEdge=graph.findById("Adding~");
                  console.log(preEdge)
                  graph.removeItem(preEdge)
                  graph.addItem('edge', {
                      type: source._cfg.model.id === model.id ? 'loop' : 'line',
                      source:source._cfg.model.id,
                      target: model.id,
                      id:""+res.edge_id,
                      label:"1",
                      style:{lineWidth:compressWeight(100),endArrow: true,stroke: '#FFD777',}
                  });
                  console.log(graph.findById("Adding~"))
                // 添加成功，更新边的样式和模型
                const edgeModel = graph.findById(res.edge_id).getModel();
                setItem(edgeModel);
              } else {
                // 添加失败，移除刚刚添加的边
                message.error(`${res?.msg}`);
                graph.removeItem(self.edge);
              }
              // 重置状态
              self.edge = null;
              self.addingEdge = false;
            }).catch((error: any) => {
              // 捕获错误，处理异常情况
              message.error(`Error: ${error.message}`);
              graph.removeItem(self.edge); // 如果发生错误，也要移除刚刚添加的边
              self.edge = null;
              self.addingEdge = false;
            });
        } else {
          // 开始添加新的边
          self.edge = graph.addItem('edge', {
              id:"Adding~",
            source: model.id,
            target: model.id,
            style: {
              endArrow: true,
                stroke: '#FFD777',
            },
          });

          self.addingEdge = true;
        }
      }
    },
    onMousemove(ev: any) {
      // 更新边的目标位置
      const self = this;
      const point = { x: ev.x, y: ev.y };
      if (self.addingEdge && self.edge && graph !== null && graph !== undefined) {
        graph.updateItem(self.edge, {
          target: point,
        });
      }
    },
    onEdgeClick(ev: { item: any }) {
      // 处理边的点击事件
      const self = this;
      const currentEdge = ev.item;
      if (self.addingEdge && self.edge === currentEdge && graph !== null && graph !== undefined) {
        // 如果正在添加边，并且当前点击的边与正在添加的边相同，则取消添加
        graph.removeItem(self.edge);
        self.edge = null;
        self.addingEdge = false;
      } else {
        // 否则，将边的模型设置为当前选中的模型
        setItem(currentEdge.getModel());
      }
    },
  });
}

// 编辑图形行为
export function editGraphBehavior(setVisible: any, setId: any) {
  G6.registerBehavior('dblclick-edit-graph', {
    getEvents() {
      return {
        dblclick: 'onClick',
      };
    },
    onClick(ev: { item: any }) {
      const item = ev.item;
      if (item != null) {
        setVisible(true);
        setId(item.getID());
      }
    },
  });
}

export function customClickBehavior(setItem: any) {
  //console.log('now set custom');
  G6.registerBehavior('custom-click', {
    getEvents() {
      return {
        'node:click': 'onClick',
        'edge:click': 'onClick',
      };
    },
    onClick(ev: { item: any }) {
      if (ev !== null && ev !== undefined && ev.item !== null && ev.item !== undefined) {
        const item = ev.item;
        //console.log(item);
        if (item.getModel() !== null && item.getModel() !== undefined) {
          const model = item.getModel(); // 获取节点或边的数据模型
          setItem(model);
        }
      }
    },
  });
}



