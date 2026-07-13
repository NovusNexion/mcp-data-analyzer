import React, { useState, useRef, useEffect } from 'react';
import { 
  History, MessageSquare, Trash2, Menu, X, Pencil, Check, X as XIcon,
  Pin, PinOff, Share2, MoreHorizontal, MessageSquarePlus 
} from 'lucide-react';

const Sidebar = ({ 
  isOpen, toggle, conversations, currentId, onSelect, onNew, 
  onDelete, onRename, onPin, onShare 
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleEditStart = (id, currentTitle) => {
    setEditingId(id);
    setEditingValue(currentTitle);
    setOpenMenuId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleEditSave = (id) => {
    const trimmed = editingValue.trim();
    if (trimmed && trimmed !== '新对话') {
      onRename(id, trimmed);
    }
    setEditingId(null);
    setEditingValue('');
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAction = (action, id) => {
    setOpenMenuId(null);
    if (action === 'rename') {
      const conv = conversations.find(c => c.id === id);
      handleEditStart(id, conv?.title || '新对话');
    } else if (action === 'pin') {
      onPin(id);
    } else if (action === 'share') {
      onShare(id);
    } else if (action === 'delete') {
      if (conversations.length > 1) {
        onDelete(id);
      }
    }
  };

  // 过滤掉空的占位对话（标题为“新对话”且无消息）
  const validConversations = conversations.filter(
    conv => !(conv.title === '新对话' )
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggle} />
      )}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-gray-900 text-gray-200
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            MCP数据检索分析
          </h1>
          <button onClick={toggle} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 新建对话按钮 */}
        <button
          onClick={onNew}
          className="m-4 flex items-center justify-center gap-2 text-gray-300 hover:bg-gray-700/50 text-sm font-medium py-2 px-4 rounded-full transition"
        >
          <MessageSquarePlus className="w-4 h-4" /> 开启新对话
        </button>

        {/* 对话列表 */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {validConversations.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-4">暂无对话</div>
          ) : (
            validConversations.map(conv => (
              <div
                key={conv.id}
                className={`
                  group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition relative
                  ${conv.id === currentId ? 'bg-gray-800' : 'hover:bg-gray-800/50'}
                `}
                onClick={() => onSelect(conv.id)}
              >
                <History className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {editingId === conv.id ? (
                  <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => handleEditSave(conv.id)}
                      onKeyDown={(e) => handleKeyDown(e, conv.id)}
                      className="flex-1 bg-gray-700 text-gray-200 text-sm px-1 py-0.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditSave(conv.id); }}
                      className="text-green-400 hover:text-green-300"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditCancel(); }}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 truncate text-sm text-gray-300">
                      {conv.title || '新对话'}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMenu(conv.id); }}
                      className="text-gray-500 hover:text-gray-300 p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenuId === conv.id && (
                      <div
                        ref={(el) => (menuRefs.current[conv.id] = el)}
                        className="absolute right-0 top-full mt-1 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 py-1"
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAction('rename', conv.id); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4" /> 重命名
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAction('pin', conv.id); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          {conv.pinned ? <Pin className="w-4 h-4 text-yellow-400" /> : <PinOff className="w-4 h-4" />}
                          {conv.pinned ? '取消置顶' : '置顶'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAction('share', conv.id); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4" /> 分享
                        </button>
                        {conversations.length > 1 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction('delete', conv.id); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> 删除
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </nav>

        <div className="p-4 text-xs text-gray-500 border-t border-gray-700">
          v0.1 · 支持 MySQL / PostgreSQL / Excel
        </div>
      </aside>

      <button
        onClick={toggle}
        className="lg:hidden fixed bottom-6 left-6 z-30 bg-gray-800 p-3 rounded-full shadow-lg border border-gray-700"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>
    </>
  );
};

export default Sidebar;