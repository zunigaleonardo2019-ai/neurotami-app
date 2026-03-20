import { useState } from 'react';

export default function App() {
  const [currentTest] = useState('home');

  return (
    <div style={{ padding: '20px', fontSize: '24px' }}>
      Pantalla principal funcionando: {currentTest}
    </div>
  );
}
