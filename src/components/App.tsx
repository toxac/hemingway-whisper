import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import HemingwayChecker from './HemingwayChecker';
import { markdownToPlainText } from '../utils/markdownUtils';

type TabType = 'editor' | 'preview' | 'analysis';

const App: React.FC = () => {
  const [value, setValue] = React.useState<string | undefined>("**Hello world!!!**");
  const [activeTab, setActiveTab] = React.useState<TabType>('editor');

  const plainText = markdownToPlainText(value);

  const tabs = [
    { id: 'editor' as TabType, label: 'Editor' },
    { id: 'preview' as TabType, label: 'Preview' },
    { id: 'analysis' as TabType, label: 'Writing Analysis' },
  ];

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Tab Navigation */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'editor' && (
          <div>
            <MDEditor
              value={value}
              onChange={setValue}
              height={400}
              preview="edit"
            />
          </div>
        )}

        {activeTab === 'preview' && value && (
          <div className="border rounded-lg p-6 min-h-[400px]">
            <MDEditor.Markdown source={value} />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div>
            <HemingwayChecker content={plainText} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;