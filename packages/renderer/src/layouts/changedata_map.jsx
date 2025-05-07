import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Panel,
} from '@xyflow/react';
import CustomEdge from '../component/edge';
import TextUpdaterNode from '../component/node';
import '@xyflow/react/dist/style.css';

const nodeTypes = { 
  textUpdater: TextUpdaterNode 
};

const edgeTypes = {
  'custom-edge': CustomEdge,
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeCount, setNodeCount] = useState(0);

  const onConnect = useCallback(
    (connection) => {
      const edge = { 
        ...connection, 
        type: 'custom-edge',
        data: { 
          label: '',
          onDelete: (edgeId) => {
            setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
          }
        }
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges],
  );

  const addNextNode = useCallback(() => {
    const newNode = {
      id: `node-${nodeCount + 1}`,
      type: 'textUpdater',
      position: { 
        x: (nodeCount % 3) * 300, // Arrange nodes in a grid pattern
        y: Math.floor(nodeCount / 3) * 100 
      },
      data: { 
        value: 'New Node',
        onChange: (value) => console.log(`Node ${nodeCount + 1} value changed:`, value),
        onDelete: () => deleteNode(`node-${nodeCount + 1}`)
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeCount((count) => count + 1);
  }, [nodeCount, setNodes]);

  const deleteNode = useCallback((nodeId) => {
    // Remove the node
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    
    // Remove connected edges
    setEdges((eds) => eds.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  }, [setNodes, setEdges]);

  const resetFlow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setNodeCount(0);
  }, [setNodes, setEdges]);

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
        <Panel position="top-left">
          <div style={{ display: 'flex', gap: '10px', padding: '10px', background: 'white', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <button 
              onClick={addNextNode} 
              style={buttonStyle}
            >
              Add Node
            </button>
            <button onClick={resetFlow} style={{ ...buttonStyle, background: '#ff4444' }}>
              Reset Flow
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

const buttonStyle = {
  padding: '8px 16px',
  background: '#1a192b',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'background 0.2s',
  ':hover': {
    background: '#2a2940',
  },
};

export default Flow;