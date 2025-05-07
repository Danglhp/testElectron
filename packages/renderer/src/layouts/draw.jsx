import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from '@xyflow/react';
import CustomEdge from '../component/edge';
import TextUpdaterNode from '../component/node';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: 'node-1',
    type: 'textUpdater',
    position: { x: 0, y: 0 },
    data: { 
      value: 'Node 1',
      onChange: (value) => console.log('Node 1 value changed:', value)
    },
  },
  {
    id: 'node-2',
    type: 'textUpdater',
    position: { x: 200, y: 100 },
    data: { 
      value: 'Node 2',
      onChange: (value) => console.log('Node 2 value changed:', value)
    },
  },
  {
    id: 'node-3',
    type: 'textUpdater',
    position: { x: 0, y: 200 },
    data: { 
      value: 'Node 3',
      onChange: (value) => console.log('Node 3 value changed:', value)
    },
  },
];

const initialEdges = [
  { 
    id: 'edge-1-2', 
    type: 'custom-edge', 
    source: 'node-1', 
    target: 'node-2', 
    data: { label: 'Note 1' } 
  },
  { 
    id: 'edge-2-3', 
    type: 'custom-edge', 
    source: 'node-2', 
    target: 'node-3', 
    data: { label: 'Note 2' } 
  },
];

const nodeTypes = { 
  textUpdater: TextUpdaterNode 
};

const edgeTypes = {
  'custom-edge': CustomEdge,
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => {
      const edge = { 
        ...connection, 
        type: 'custom-edge',
        data: { label: '' } // Initialize with empty label
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges],
  );

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;