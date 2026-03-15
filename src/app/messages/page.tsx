'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { chatAPI } from '@/lib/api';
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { Send, ArrowBack } from '@mui/icons-material';

interface InboxItem {
  user: { _id: string; name: string; email: string; role: string };
  lastMessage: string;
  lastAt: string;
}

interface Message {
  _id: string;
  from: { _id: string; name: string; email: string; role: string } | string;
  to: { _id: string; name: string; email: string; role: string } | string;
  content: string;
  createdAt: string;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(true);
  
  const [selectedUser, setSelectedUser] = useState<InboxItem['user'] | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  // Mobile view logic
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/messages');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchInbox();
    }
  }, [session]);

  const fetchInbox = async () => {
    try {
      setLoadingInbox(true);
      const res = await chatAPI.getInbox(session!.accessToken as string);
      setInbox(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch inbox:', err);
    } finally {
      setLoadingInbox(false);
    }
  };

  const selectConversation = async (user: InboxItem['user']) => {
    setSelectedUser(user);
    setShowChatOnMobile(true);
    try {
      setLoadingChat(true);
      const res = await chatAPI.getConversations(user._id, session!.accessToken as string);
      setConversation(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    
    const content = newMessage.trim();
    setNewMessage('');
    
    // Optimistic UI update
    const optimisticMsg: any = {
      _id: Date.now().toString(),
      from: { _id: (session?.user as any)?.id || '' },
      to: selectedUser,
      content,
      createdAt: new Date().toISOString()
    };
    setConversation(prev => [...prev, optimisticMsg]);
    
    try {
      await chatAPI.sendMessage({ to: selectedUser._id, content }, session!.accessToken as string);
      // We could re-fetch or rely on the optimistic update. We'll re-fetch silently just to be safe.
      const res = await chatAPI.getConversations(selectedUser._id, session!.accessToken as string);
      setConversation(res.data?.data || []);
      // Also update the inbox silently so the last message updates
      fetchInbox();
    } catch (err) {
      console.error('Failed to send message:', err);
      // Remove optimistic update if failed
      setConversation(prev => prev.filter(m => m._id !== optimisticMsg._id));
      alert('Failed to send message');
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><CircularProgress sx={{ color: '#FF385C' }} /></div>;
  }

  return (
    <main className="max-w-[1120px] mx-auto px-4 md:px-10 py-6 h-[calc(100vh-80px)] flex gap-6">
      
      {/* Inbox Sidebar */}
      <div className={`w-full md:w-1/3 h-full flex flex-col bg-white border border-border-light rounded-xl overflow-hidden shadow-sm ${showChatOnMobile ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-border-light bg-bg-offset">
          <h1 className="text-[20px] font-bold text-text-main">Messages</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {loadingInbox ? (
            <div className="p-8 text-center"><CircularProgress size={30} sx={{ color: '#FF385C' }} /></div>
          ) : inbox.length === 0 ? (
            <div className="p-8 text-center text-text-muted">No messages yet.</div>
          ) : (
            inbox.map((item) => {
              if (!item.user) return null; // Avoid crashes if user was deleted
              const isSelected = selectedUser?._id === item.user._id;
              return (
                <div 
                  key={item.user._id} 
                  onClick={() => selectConversation(item.user)}
                  className={`p-4 border-b border-border-light cursor-pointer transition-colors ${isSelected ? 'bg-bg-offset' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-[15px] truncate">{item.user.name}</h3>
                    <span className="text-[12px] text-text-muted whitespace-nowrap ml-2">
                      {dayjs(item.lastAt).format('MMM D')}
                    </span>
                  </div>
                  <p className="text-[14px] text-text-muted truncate">
                    {item.lastMessage}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`w-full md:w-2/3 h-full flex flex-col bg-white border border-border-light rounded-xl overflow-hidden shadow-sm ${!showChatOnMobile ? 'hidden md:flex' : 'flex'}`}>
        {!selectedUser ? (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
             <div className="w-16 h-16 bg-bg-offset rounded-full flex items-center justify-center mb-4">
               <span className="text-2xl">💬</span>
             </div>
             <p className="text-[16px]">Select a conversation to read or reply</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border-light flex items-center gap-3">
              <button className="md:hidden" onClick={() => setShowChatOnMobile(false)}>
                <ArrowBack />
              </button>
              <div className="w-10 h-10 bg-text-main text-white rounded-full flex items-center justify-center font-bold">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-[16px] leading-tight">{selectedUser.name}</h2>
                <span className="text-[12px] text-text-muted capitalize">{selectedUser.role.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f9f9f9]">
              {loadingChat ? (
                <div className="text-center py-10"><CircularProgress size={30} sx={{ color: '#FF385C' }} /></div>
              ) : conversation.length === 0 ? (
                <div className="text-center py-10 text-text-muted">No messages in this conversation. Say hi!</div>
              ) : (
                conversation.map((msg) => {
                  const currentUserId = (session?.user as any)?.id;
                  const isMe = typeof msg.from === 'object' 
                               ? msg.from._id === currentUserId 
                               : msg.from === currentUserId;
                  return (
                    <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMe ? 'bg-brand text-white rounded-br-none' : 'bg-white border border-border-light text-text-main rounded-bl-none shadow-sm'}`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-text-muted mt-1 px-1">
                        {dayjs(msg.createdAt).format('h:mm A')}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border-light bg-white flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 border border-border-main rounded-full px-4 outline-none focus:border-text-main transition-colors text-[14px]"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-brand-dark transition-colors"
                aria-label="Send message"
              >
                <Send sx={{ fontSize: 18, ml: '2px' }} />
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
