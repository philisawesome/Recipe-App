import React, { useEffect, useState, useRef } from 'react';

interface ListProps {
  title: string;
  items: string[];
  setItems: (items: string[]) => void;
  placeholder?: string;
  ordered?: boolean;
  textbox?: boolean;
}

const List: React.FC<ListProps> = ({ title, items, setItems, placeholder = "Enter item...", ordered, textbox }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const isDragging = useRef(false);

  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const focusIndexRef = useRef<number | null>(null);

  useEffect(() => {
	if (focusIndexRef.current !== null) {
      textareaRefs.current[focusIndexRef.current]?.focus();
      focusIndexRef.current = null;
    }
  }, [items]);

  const handleMouseDown = (index: number) => {
    isDragging.current = true;
    setDraggedIndex(index);
  };

  const handleMouseEnter = (index: number) => {
    if (!isDragging.current || draggedIndex === null || draggedIndex === index) return;
    
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
    setDraggedIndex(index);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setDraggedIndex(null);
  };

  const handleEdit = (index: number, value: string) => {
    if (value === "" && !textbox) {
      handleDelete(index);
    } else {
      const newItems = [...items];
      newItems[index] = value;
      setItems(newItems);
    }
  };

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleAdd = () => {
    setItems([...items, ""]);
  };

  const handleBlur = (index: number, value: string) => {
    if (value.trim() === "") {
      handleDelete(index);
    }
  };

  const handleKeyDown = (e: any, index: number) => {
	if (e.key === 'Enter' && items[index].trim() !== '') {
      handleAdd();
  	}
  };

  const handleTBKeyDown = (e: any, index: number) => {
	if (e.key === 'Enter' && e.shiftKey && items[index].trim() !== '') {
      e.preventDefault();
      e.stopPropagation();
      handleAdd();
	  const newItems = [...items];
      newItems.splice(index + 1, 0, '');
      setItems(newItems);
      
      // Set which textarea to focus after render
      focusIndexRef.current = index + 1;
	  return
  	}
  };

  const hasEmptyItem = items.some(item => item === "");
  const maxHeight = 300;

  return (
    <div className="rounded-lg w-full" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <h3 className="font-bold mb-2">{title}</h3>
      <div 
		  className="space-y-2 overflow-y-auto"
		  style={{ 
			maxHeight: `${maxHeight}px`
		  }}
	  >
        {items.map((item, index) => (
          <div
            key={index}
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            className={`flex items-center gap-1 p-1 rounded-lg border-2 transition-all select-none ${
              item !== "" ? 'cursor-move' : 'cursor-default'
            } ${
              draggedIndex === index 
                ? 'border-blue-400 bg-blue-50 opacity-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <svg 
              className={`w-5 h-5 flex-shrink-0 ${item !== "" ? 'text-gray-400' : 'text-gray-200'}`} 
              fill="currentColor" 
              viewBox="0 0 20 25"
              style={{ minWidth: '20px' }}
            >
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
            </svg>

			{textbox && <p>{index+1}.</p>}
			{textbox && <textarea
			  value={item}
			  ref={(el) => { textareaRefs.current[index] = el; }}
			  onChange={(e) => {
				handleEdit(index, e.target.value);
				e.target.style.height = 'auto';
				e.target.style.height = e.target.scrollHeight + 'px';
			  }}
			  style={{ 
				minHeight: '40px',
				resize: 'none',
				overflow: 'hidden'
			  }}
			  onKeyDown={(e) => {handleTBKeyDown(e, index)}}
			  className="w-full border rounded"
			  placeholder="Type something..."
			/>}
			{!textbox && <input
              type={textbox ? "" : "text"}
              value={item}
              onChange={(e) => handleEdit(index, e.target.value)}
              onBlur={(e) => handleBlur(index, e.target.value)}
			  onKeyDown={(e) => handleKeyDown(e, index)} 
              placeholder={placeholder}
              className="flex-1 border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded bg-transparent text-sm"
              autoFocus={item === ""}
              onMouseDown={(e) => e.stopPropagation()}
            />}

            <button
              onClick={() => handleDelete(index)}
              className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
              title="Delete"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAdd}
        disabled={hasEmptyItem}
        className={`mt-2 w-full py-1 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
          hasEmptyItem 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-3 hover:bg-2 cursor-pointer text-white'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Item
      </button>
    </div>
  );
};

export default List;
