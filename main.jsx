import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [prompts, setPrompts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${BACKEND_URL}/prompts`)
      .then(res => res.json())
      .then(setPrompts);
  }, []);

  const submit = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BACKEND_URL}/generate?prompt_id=${selected}`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h1>Pet Photo Transformer</h1>
      <select onChange={e => setSelected(e.target.value)}>
        <option>Select a Prompt</option>
        {prompts.map(p => (
          <option key={p.id} value={p.id}>{p.title}</option>
        ))}
      </select>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={submit}>Submit</button>
      {result && (
        <div>
          <h2>Result</h2>
          <img src={result.image_url} alt="Generated" style={{ maxWidth: "400px" }} />
          <p>{result.gemini_result}</p>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);