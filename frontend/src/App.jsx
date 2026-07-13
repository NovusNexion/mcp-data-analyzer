import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { v4 as uuidv4 } from 'uuid';

const initialConversations = [
  { id: '1', title: '新对话', messages: [], pinned: false }
];

function App() {
  const [conversations, setConversations] = useState(initialConversations);
  const [currentId, setCurrentId] = useState(initialConversations[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const currentConversation = conversations.find(c => c.id === currentId);

  // 排序：置顶优先，再按时间（这里用ID倒序，或创建时间，我们简单用ID倒序）
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const addMessage = useCallback((message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentId) {
        return { ...conv, messages: [...conv.messages, message] };
      }
      return conv;
    }));
  }, [currentId]);

  const generateTitleFromMessages = (messages) => {
    if (!messages || messages.length === 0) return '新对话';
    const firstUserMsg = messages.find(m => m.role === 'user');
    if (!firstUserMsg) return '新对话';
    let title = firstUserMsg.content.trim();
    if (title.length > 20) {
      title = title.slice(0, 20) + '...';
    }
    return title || '新对话';
  };

  const createNewConversation = () => {
    const current = conversations.find(c => c.id === currentId);
    if (current && current.title === '新对话' && current.messages.length > 0) {
      const newTitle = generateTitleFromMessages(current.messages);
      if (newTitle !== '新对话') {
        setConversations(prev => prev.map(c => 
          c.id === currentId ? { ...c, title: newTitle } : c
        ));
      }
    }

    const newId = uuidv4();
    const newConv = { id: newId, title: '新对话', messages: [], pinned: false };
    setConversations(prev => [newConv, ...prev]);
    setCurrentId(newId);
  };

  const deleteConversation = (id) => {
    if (conversations.length <= 1) return;
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentId === id) {
      setCurrentId(conversations[0].id);
    }
  };

  const renameConversation = (id, newTitle) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  const togglePin = (id) => {
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, pinned: !c.pinned } : c
    ));
  };

  // 分享功能：复制当前对话的标题和消息摘要
  const shareConversation = (id) => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;
    let text = `对话: ${conv.title || '未命名'}\n`;
    conv.messages.forEach(msg => {
      const role = msg.role === 'user' ? '用户' : '助手';
      text += `${role}: ${msg.content}\n`;
    });
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('对话已复制到剪贴板');
      }).catch(() => {
        alert('复制失败，请手动复制');
      });
    } else {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('对话已复制到剪贴板');
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        conversations={sortedConversations}
        currentId={currentId}
        onSelect={setCurrentId}
        onNew={createNewConversation}
        onDelete={deleteConversation}
        onRename={renameConversation}
        onPin={togglePin}
        onShare={shareConversation}
      />
      <ChatArea
        conversation={currentConversation}
        onSendMessage={addMessage}
        isSidebarOpen={isSidebarOpen}
      />
    </div>
  );
}

export default App;