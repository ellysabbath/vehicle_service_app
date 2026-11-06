import { useState, useEffect, useRef } from 'react';
import { db, uid } from '../../data/store';
import { PageHeader } from '../../components/UI';

const ME = 'me';

export default function Messages() {
  const jobs = db.jobs();
  const [activeJob, setActiveJob] = useState(jobs[0]?.id || '');
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeJob) return;
    setMessages(db.chats().filter(c => c.jobId === activeJob));
  }, [activeJob]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!text.trim() || !activeJob) return;
    const all = db.chats();
    all.push({
      id: uid(),
      jobId: activeJob,
      senderId: ME,
      senderName: 'Me',
      message: text,
      timestamp: new Date().toISOString(),
    });
    db.saveChats(all);
    setMessages(db.chats().filter(c => c.jobId === activeJob));
    setText('');
  };

  return (
    <div>
      <PageHeader title="Messages" subtitle="Chat with customers" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[70vh]">
        <div className="card p-0 overflow-y-auto">
          <p className="p-3 font-semibold border-b">Conversations</p>
          {jobs.map(j => {
            const c = db.customers().find(x => x.id === j.customerId);
            return (
              <button
                key={j.id}
                onClick={() => setActiveJob(j.id)}
                className={`w-full text-left p-3 border-b hover:bg-gray-50 ${activeJob === j.id ? 'bg-primary-50' : ''}`}
              >
                <p className="font-medium text-sm">{c?.name || 'Unknown customer'}</p>
                <p className="text-xs text-gray-500">{j.serviceType}</p>
              </button>
            );
          })}
          {jobs.length === 0 && <p className="p-3 text-sm text-gray-500">No conversations</p>}
        </div>

        <div className="md:col-span-3 card flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(m => {
              const isMe = m.senderId === ME;
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      isMe ? 'bg-primary-600 text-white' : 'bg-gray-100'
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[10px] opacity-60 mb-0.5">{m.senderName}</p>
                    )}
                    <p>{m.message}</p>
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No messages yet</p>
            )}
            <div ref={endRef} />
          </div>
          <div className="border-t p-3 flex gap-2">
            <input
              className="input flex-1"
              placeholder="Type message..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button className="btn-primary" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}