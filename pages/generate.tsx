import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PromptInput from '@/components/Generate/PromptInput';
import ModelSelector from '@/components/Generate/ModelSelector';
import LoraTagTray from '@/components/Generate/LoraTagTray';
import AspectSelector from '@/components/Generate/AspectSelector';
import HistoryTray from '@/components/Generate/HistoryTray';
import ImagePromptTray from '@/components/Generate/ImagePromptTray';

export default function Generate() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedLoras, setSelectedLoras] = useState([]);
  const [selectedAspect, setSelectedAspect] = useState('1:1');
  const [referenceImages, setReferenceImages] = useState([]);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  // Load available models
  const [availableModels, setAvailableModels] = useState([]);
  useEffect(() => {
    // Replace with actual API call
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models');
        const data = await response.json();
        setAvailableModels(data);
        if (data.length > 0) {
          setSelectedModel(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    
    fetchModels();
  }, []);

  // Load available LoRAs
  const [availableLoras, setAvailableLoras] = useState([]);
  useEffect(() => {
    // Replace with actual API call
    const fetchLoras = async () => {
      try {
        const response = await fetch('/api/loras');
        const data = await response.json();
        setAvailableLoras(data);
      } catch (error) {
        console.error('Error fetching LoRAs:', error);
      }
    };
    
    fetchLoras();
  }, []);

  // Load generation history
  useEffect(() => {
    // Replace with actual API call
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/generation-history');
        const data = await response.json();
        setGenerationHistory(data);
      } catch (error) {
        console.error('Error fetching generation history:', error);
      }
    };
    
    fetchHistory();
  }, []);

  const handleGenerate = async () => {
    if (!prompt || !selectedModel) return;
    
    setIsGenerating(true);
    
    try {
      // Replace with actual API call
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          loras: selectedLoras,
          aspect: selectedAspect,
          referenceImages,
        }),
      });
      
      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      
      // Add to history
      setGenerationHistory([
        {
          id: Date.now().toString(),
          prompt,
          model: selectedModel,
          imageUrl: data.imageUrl,
          timestamp: new Date().toISOString(),
        },
        ...generationHistory,
      ]);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGenerated = async () => {
    if (!generatedImage) return;
    
    try {
      // Replace with actual API call
      await fetch('/api/save-generated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: generatedImage,
          prompt,
          model: selectedModel,
          loras: selectedLoras,
        }),
      });
      
      // Navigate to content manager
      router.push('/content');
    } catch (error) {
      console.error('Error saving generated image:', error);
    }
  };

  return (
    <div className="page-container">
      <header className="app-header">
        <button className="back-button" onClick={() => router.back()}>
          Back
        </button>
        <h1>Generate</h1>
        {generatedImage && (
          <button className="save-button" onClick={handleSaveGenerated}>
            Save
          </button>
        )}
      </header>
      
      <main className="generate-container">
        <div className="generate-controls">
          <PromptInput 
            value={prompt} 
            onChange={setPrompt} 
          />
          
          <ModelSelector 
            models={availableModels} 
            selectedModel={selectedModel} 
            onSelect={setSelectedModel} 
          />
          
          <AspectSelector 
            selectedAspect={selectedAspect} 
            onSelect={setSelectedAspect} 
          />
          
          <LoraTagTray 
            loras={availableLoras} 
            selectedLoras={selectedLoras} 
            onSelect={(lora) => {
              if (selectedLoras.includes(lora)) {
                setSelectedLoras(selectedLoras.filter(l => l !== lora));
              } else {
                setSelectedLoras([...selectedLoras, lora]);
              }
            }} 
          />
          
          <ImagePromptTray 
            images={referenceImages} 
            onAdd={(image) => setReferenceImages([...referenceImages, image])} 
            onRemove={(image) => setReferenceImages(referenceImages.filter(img => img !== image))} 
          />
          
          <button 
            className="generate-button" 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt || !selectedModel}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        
        <div className="generate-preview">
          {isGenerating ? (
            <div className="generating-indicator">
              Generating image...
            </div>
          ) : generatedImage ? (
            <img 
              src={generatedImage} 
              alt={prompt} 
              className="generated-image" 
            />
          ) : (
            <div className="empty-preview">
              Your generated image will appear here
            </div>
          )}
        </div>
        
        <HistoryTray 
          history={generationHistory} 
          onSelect={(item) => {
            setPrompt(item.prompt);
            setSelectedModel(item.model);
            setGeneratedImage(item.imageUrl);
          }} 
        />
      </main>
    </div>
  );
}
