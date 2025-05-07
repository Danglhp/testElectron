import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

function TextUpdaterNode({ data }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(data.value);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    data.onChange?.(value);
  };

  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter' || evt.key === 'Escape') {
      setIsEditing(false);
      data.onChange?.(value);
    }
  };

  const handleChange = (evt) => {
    setValue(evt.target.value);
  };

  return (
    <div
      style={{
        padding: '10px',
        borderRadius: '5px',
        background: 'white',
        border: '1px solid #ddd',
        minWidth: '150px',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <input
            value={value}
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
          <div style={{ padding: '4px' }}>{value}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(TextUpdaterNode); 