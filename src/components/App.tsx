import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import HemingwayChecker from './HemingwayChecker';
import { markdownToPlainText } from '../utils/markdownUtils';
import MicRecorder from './MicRecorder';

type TabType = 'editor' | 'preview' | 'analysis';

const App: React.FC = () => {
  const [value, setValue] = React.useState<string | undefined>("**Hello world!!!**");
  const [activeTab, setActiveTab] = React.useState<TabType>('editor');

  const plainText = markdownToPlainText(value);

  const handleTranscription = (transcription: string) => {
    setValue(prev => (prev ? `${prev}\n${transcription}` : transcription));
  };

  const tabs = [
    { id: 'editor' as TabType, label: 'Editor' },
    { id: 'preview' as TabType, label: 'Preview' },
    { id: 'analysis' as TabType, label: 'Writing Analysis' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '30px auto', padding: '0 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      {/* Header: Tabs + Mic */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <nav style={{ display: 'flex', gap: 12 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                borderBottom: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                backgroundColor: 'transparent',
                fontWeight: activeTab === tab.id ? '600' : '500',
                fontSize: 16,
                color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#3b82f6'; }}
              onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#6b7280'; }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div>
          <MicRecorder onTranscription={handleTranscription} />
        </div>
      </div>

      {/* Main Content */}
      <main style={{ minHeight: 600 }}>
        {activeTab === 'editor' && (
          <MDEditor
            value={value}
            onChange={setValue}
            height={600}
            preview="edit"
            textareaProps={{ style: { fontSize: 16, lineHeight: 1.6 } }}
          />
        )}

        {activeTab === 'preview' && value && (
          <div style={{ padding: 24, borderRadius: 6, backgroundColor: '#f9fafb', minHeight: 600, border: '1px solid #e5e7eb', fontSize: 16, lineHeight: 1.6 }}>
            <MDEditor.Markdown source={value} />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div>
            <HemingwayChecker content={plainText} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
