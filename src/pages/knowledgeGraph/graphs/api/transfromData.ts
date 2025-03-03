import { message } from 'antd';

export function getGraphData(graph: any, data: any) {
  const kg_data = data['kg-data'];
  const entity_data = data['entity_data'];
  let map: Map<string, any> = new Map();

  // 添加节点，并根据重要性设置节点的特化
  for (let i = 0; i < entity_data.length; i++) {
    const node_id = String(entity_data[i].entityId);
    const label = entity_data[i].entity;
    const size = compressMapping(entity_data[i].importance);
    const style = {
      fill: '#fff',
      stroke: '#000',
      opacity: 0.8,
    };
    //如果entity_data[i].importance<=66显示明绿色的点，<=100显示亮橙色的点
    if (entity_data[i].importance <= 66 && entity_data[i].importance >= 34) {
      style.fill = '#00EE00';
    } else if (entity_data[i].importance <= 100 && entity_data[i].importance >= 67) {
      style.fill = '#FFB90F';
    }

    if (map.has(label)) {
      continue;
    }
    map.set(label, node_id);

    graph.addItem('node', {
      id: node_id,
      label: label,
      size: size,
      style: style,
    });
  }

  // 添加边，并根据权重设置边的特化
  for (let i = 0; i < kg_data.length; i++) {
    const kg = kg_data[i];
    const node1_name = kg['node1'],
      edge_id = String(kg['kgId']),
      node2_name = kg['node2'],
      edge_name = kg['relation'],
      weight = kg['weight'];

    // 查询图中是否存在这两个节点
    if (map.has(node1_name) && map.has(node2_name)) {
      if (edge_name !== '无关') {
        graph.addItem('edge', {
          id: edge_id,
          label: edge_name,
          source: map.get(node1_name),
          target: map.get(node2_name),
          type: map.get(node1_name) === map.get(node2_name) ? 'loop' : 'line',
          style: {
            endArrow: true,
            lineWidth: compressWeight(weight),
            stroke: '#FFD777',
          },
        });
      }
    } else {
      message.error(`节点 ${node1_name} 或节点 ${node2_name} 不存在于图谱中`);
    }
  }

  return data;
}

export function compressMapping(input: number): number {
  const inputMin = 0;
  const inputMax = 100;
  const outputMin = 35;
  const outputMax = 55;

  return (input - inputMin) * ((outputMax - outputMin) / (inputMax - inputMin)) + outputMin;
}

export function compressWeight(weight: number): number {
  const weightMin = 0;
  const weightMax = 100;
  const lineWidthMin = 1;
  const lineWidthMax = 2.5;

  return (
    (weight - weightMin) * ((lineWidthMax - lineWidthMin) / (weightMax - weightMin)) + lineWidthMin
  );
}

export function decompressMapping(size: number): any {
  const inputMin = 35;
  const inputMax = 55;
  const outputMin = 0;
  const outputMax = 100;

  return (size - inputMin) * ((outputMax - outputMin) / (inputMax - inputMin)) + outputMin;
}

export function decompressWeight(lineWidth: number): any {
  const lineWidthMin = 1;
  const lineWidthMax = 2.5;
  const weightMin = 0;
  const weightMax = 100;

  return (
    (lineWidth - lineWidthMin) * ((weightMax - weightMin) / (lineWidthMax - lineWidthMin)) +
    weightMin
  );
}
