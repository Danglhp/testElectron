import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  EdgeLabelRenderer,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    data: { label: 'Hello' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: '2',
    data: { label: 'World' },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

// Custom edge component with editable label
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data, selected }) => {
  const [label, setLabel] = useState(data?.label || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter' || evt.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleChange = (evt) => {
    setLabel(evt.target.value);
  };

  return (
    <>
      <path
        id={id}
        style={{
          stroke: selected ? '#ff0071' : '#555',
          strokeWidth: 2,
        }}
        className="react-flow__edge-path"
        d={`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`}
        onDoubleClick={handleDoubleClick}
      />
      {isEditing && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${(sourceX + targetX) / 2}px,${(sourceY + targetY) / 2}px)`,
              background: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              pointerEvents: 'all',
              cursor: 'pointer',
              border: '1px solid #ff0071',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <input
              value={label}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                background: 'transparent',
              }}
            />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

const edgeTypes = {
  custom: CustomEdge,
};

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds)),
    [],
  );

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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