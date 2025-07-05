import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [prompts, setPrompts] = useState([]);
  const [selectedPromptId, setSelectedPromptId] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000'; // Fallback for local dev

  // Load prompts from the backend when the app starts
  useEffect(() => {
    fetch(`${BACKEND_URL}/prompts`)
      .then(res => res.json())
      .then(setPrompts)
      .catch(error => console.error("Failed to fetch prompts:", error));
  }, []);

  const submit = async () => {
    if (!file || !selectedPromptId) {
      alert("Please select a style and an image file.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    // REMOVE THIS LINE: formData.append('prompt_id', selectedPromptId); // This was sending it in the body

    try {
      // Pointing to the correct image generation endpoint
      // ADD prompt_id as a query parameter to the URL
      const res = await fetch(`${BACKEND_URL}/generate-image?prompt_id=${selectedPromptId}`, {
        method: 'POST',
        body: formData // The body only contains the 'file' now
      });

      if (!res.ok) {
        // This will help see errors from the backend more clearly
        const errorText = await res.text();
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert(`Something went wrong: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Pet Photo Transformer</h1>
      
      <div>
        <select onChange={e => setSelectedPromptId(e.target.value)} value={selectedPromptId}>
          <option value="">Select a Style</option>
          {prompts.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={submit} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      {isLoading && <p>Generating your image, please wait...</p>}

      {result && (
        <div>
          <h2>Result</h2>
          <img src={result.image_url} alt="Generated" style={{ maxWidth: "500px" }} />
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
