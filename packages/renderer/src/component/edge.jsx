import { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data?.label || '');

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

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

  const handleDelete = (evt) => {
    evt.stopPropagation();
    if (data?.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: selected ? '#ff0071' : '#555',
          strokeWidth: 2,
        }}
        onDoubleClick={handleDoubleClick}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'all',
            cursor: 'pointer',
            border: selected ? '1px solid #ff0071' : '1px solid #ddd',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
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
          ) : (
            <>
              <span>{label || 'Double click to add note'}</span>
              <button
                onClick={handleDelete}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  padding: 0,
                  lineHeight: 1,
                  marginLeft: '4px',
                }}
              >
                ×
              </button>
            </>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
} 