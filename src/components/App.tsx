import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hello Electron + React + TypeScript!</h1>
      <p>Welcome to your new app</p>
      <button onClick={() => alert('React is working!')}>
        Click me
      </button>
    </div>
  );
};

export default App;