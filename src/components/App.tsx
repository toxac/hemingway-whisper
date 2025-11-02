import React from 'react';
import MDEditor from '@uiw/react-md-editor';

const App: React.FC = () => {
  const [value, setValue] = React.useState<string | undefined>("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={setValue}
      />

    </div>
  );
};

export default App;