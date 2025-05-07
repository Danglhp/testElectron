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
    id: 'sheets-reader',
    type: 'textUpdater',
    position: { x: 0, y: 0 },
    data: { 
      value: 'Read Google Sheets',
      onChange: (value) => console.log('Node value changed:', value)
    },
  },
  {
    id: 'process-emails',
    type: 'textUpdater',
    position: { x: 300, y: 0 },
    data: { 
      value: 'Process Pending Emails',
      onChange: (value) => console.log('Node value changed:', value)
    },
  },
  {
    id: 'send-email',
    type: 'textUpdater',
    position: { x: 600, y: 0 },
    data: { 
      value: 'Send Emails',
      onChange: (value) => console.log('Node value changed:', value)
    },
  },
  {
    id: 'update-status',
    type: 'textUpdater',
    position: { x: 900, y: 0 },
    data: { 
      value: 'Update Status',
      onChange: (value) => console.log('Node value changed:', value)
    },
  },
];

const initialEdges = [
  { 
    id: 'edge-1-2', 
    type: 'custom-edge', 
    source: 'sheets-reader', 
    target: 'process-emails', 
    data: { label: 'Get pending emails' } 
  },
  { 
    id: 'edge-2-3', 
    type: 'custom-edge', 
    source: 'process-emails', 
    target: 'send-email', 
    data: { label: 'Send to recipients' } 
  },
  { 
    id: 'edge-3-4', 
    type: 'custom-edge', 
    source: 'send-email', 
    target: 'update-status', 
    data: { label: 'Mark as finished' } 
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