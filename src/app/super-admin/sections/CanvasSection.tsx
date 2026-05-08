'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  MousePointer2, 
  Type, 
  Image as ImageIcon, 
  Shapes, 
  Download, 
  Trash2,
  Square,
  Circle,
  Triangle,
  LayoutTemplate,
  Bold,
  Italic,
  Undo2,
  Redo2
} from 'lucide-react';
import { fabric } from 'fabric';
import styles from './CanvasSection.module.css';

const CANVAS_SIZES = {
  a4: { w: 700, h: 990, label: 'A4 Portrait' },
  square: { w: 800, h: 800, label: 'Instagram Square' },
  presentation: { w: 960, h: 540, label: '16:9 Landscape' },
  story: { w: 540, h: 960, label: 'Mobile Story' }
};

export default function CanvasSection() {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTool, setActiveTool] = useState('select');
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  
  const [canvasSize, setCanvasSize] = useState<keyof typeof CANVAS_SIZES>('a4');
  const canvasSizeRef = useRef<keyof typeof CANVAS_SIZES>('a4');

  // Text Properties Logic
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [textProps, setTextProps] = useState({
      fontFamily: 'Arial',
      fill: '#1a1b2e',
      fontWeight: 'normal',
      fontStyle: 'normal'
  });

  // History Stack Logic for Undo/Redo
  const canvasHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const isHistoryProcessing = useRef<boolean>(false);

  const saveHistory = useCallback(() => {
    if (isHistoryProcessing.current || !fabricCanvas.current) return;
    const json = JSON.stringify(fabricCanvas.current.toJSON());
    
    // Clear future history if we've undone and are making a new change
    if (historyIndex.current < canvasHistory.current.length - 1) {
        canvasHistory.current = canvasHistory.current.slice(0, historyIndex.current + 1);
    }
    
    // Only push if it's different from the last state
    if (canvasHistory.current.length === 0 || canvasHistory.current[canvasHistory.current.length - 1] !== json) {
        canvasHistory.current.push(json);
        historyIndex.current = canvasHistory.current.length - 1;
    }
  }, []);

  const loadHistory = useCallback((jsonStr: string) => {
    if (!fabricCanvas.current) return;
    isHistoryProcessing.current = true;
    fabricCanvas.current.loadFromJSON(jsonStr, () => {
        fabricCanvas.current?.renderAll();
        isHistoryProcessing.current = false;
    });
  }, []);

  const undo = useCallback(() => {
    if (historyIndex.current > 0) {
        historyIndex.current -= 1;
        loadHistory(canvasHistory.current[historyIndex.current]);
    }
  }, [loadHistory]);

  const redo = useCallback(() => {
    if (historyIndex.current < canvasHistory.current.length - 1) {
        historyIndex.current += 1;
        loadHistory(canvasHistory.current[historyIndex.current]);
    }
  }, [loadHistory]);

  const deleteSelected = useCallback(() => {
    if (!fabricCanvas.current) return;
    const activeObjects = fabricCanvas.current.getActiveObjects();
    if (activeObjects.length > 0) {
       fabricCanvas.current.remove(...activeObjects);
       fabricCanvas.current.discardActiveObject();
       fabricCanvas.current.renderAll();
       saveHistory(); // manually trigger save history after batch delete
    }
  }, [saveHistory]);

  useEffect(() => {
    if (!canvasRef.current || !workspaceRef.current) return;

    // Initialize Fabric Canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    fabricCanvas.current = canvas;
    
    // Temporarily disable history tracking during initialization
    isHistoryProcessing.current = true;
    loadDefaultTemplate(canvas);
    isHistoryProcessing.current = false;
    
    // Save initial blank/template state
    saveHistory();

    // Attach History Listeners
    canvas.on('object:added', saveHistory);
    canvas.on('object:modified', saveHistory);
    canvas.on('object:removed', saveHistory);

    const updateSelection = () => {
       if (!fabricCanvas.current) return;
       const activeObj = fabricCanvas.current.getActiveObject();
       if (activeObj) {
          setSelectedType(activeObj.type || null);
          if (activeObj.type === 'i-text' || activeObj.type === 'text') {
             const tObj = activeObj as fabric.IText;
             setTextProps({
                 fontFamily: tObj.fontFamily || 'Arial',
                 fill: typeof tObj.fill === 'string' ? tObj.fill : '#1a1b2e',
                 fontWeight: tObj.fontWeight as string || 'normal',
                 fontStyle: tObj.fontStyle as string || 'normal'
             });
          }
       } else {
          setSelectedType(null);
       }
    };

    canvas.on('selection:created', () => {
        setActiveTool('select');
        setShowShapeMenu(false);
        setShowSizeMenu(false);
        updateSelection();
    });
    
    canvas.on('selection:updated', updateSelection);
    canvas.on('selection:cleared', updateSelection);
    
    // Resizer Logic
    const calculateFit = () => {
      if (!workspaceRef.current || !fabricCanvas.current) return;
      const { w, h } = CANVAS_SIZES[canvasSizeRef.current];
      
      const availW = workspaceRef.current.clientWidth - 40; 
      const availH = workspaceRef.current.clientHeight - 40;
      
      const scaleW = availW / w;
      const scaleH = availH / h;
      const finalScale = Math.min(scaleW, scaleH); 

      fabricCanvas.current.setWidth(w * finalScale);
      fabricCanvas.current.setHeight(h * finalScale);
      fabricCanvas.current.setZoom(finalScale); 
      fabricCanvas.current.renderAll();
    };

    const resizeObserver = new ResizeObserver(calculateFit);
    resizeObserver.observe(workspaceRef.current);
    calculateFit();

    return () => {
      resizeObserver.disconnect();
      canvas.dispose();
    };
  }, [loadHistory, saveHistory]);

  // Global Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const activeObj = fabricCanvas.current?.getActiveObject();
        // Check if user is typing text so we don't accidentally intercept backspace or native browser undo
        const isEditingText = activeObj && activeObj.type === 'i-text' && (activeObj as fabric.IText).isEditing;

        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (!isEditingText) {
                e.preventDefault();
                deleteSelected();
            }
        } else if (e.ctrlKey || e.metaKey) {
            if (e.key.toLowerCase() === 'z') {
                if (!isEditingText) e.preventDefault(); // Don't prevent default form input undo bindings
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            } else if (e.key.toLowerCase() === 'y') {
                if (!isEditingText) e.preventDefault();
                redo();
            }
        }
    };

    // Use capturing phase to ensure higher priority
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [deleteSelected, undo, redo]);


  const applyTextProp = (key: string, value: string) => {
    if (!fabricCanvas.current) return;
    const activeObj = fabricCanvas.current.getActiveObject();
    if (activeObj && (activeObj.type === 'i-text' || activeObj.type === 'text')) {
        const tObj = activeObj as fabric.IText;
        tObj.set(key as keyof fabric.IText, value);
        fabricCanvas.current.renderAll();
        setTextProps(prev => ({ ...prev, [key]: value }));
        saveHistory();
    }
  };

  const changeSize = (sizeKey: keyof typeof CANVAS_SIZES) => {
     setCanvasSize(sizeKey);
     canvasSizeRef.current = sizeKey;
     
     if (workspaceRef.current && fabricCanvas.current) {
        const { w, h } = CANVAS_SIZES[sizeKey];
        const availW = workspaceRef.current.clientWidth - 40;
        const availH = workspaceRef.current.clientHeight - 40;
        
        const scaleW = availW / w;
        const scaleH = availH / h;
        const finalScale = Math.min(scaleW, scaleH);

        fabricCanvas.current.setWidth(w * finalScale);
        fabricCanvas.current.setHeight(h * finalScale);
        fabricCanvas.current.setZoom(finalScale);
        fabricCanvas.current.renderAll();
     }
     setShowSizeMenu(false);
  };

  const loadDefaultTemplate = (canvas: fabric.Canvas) => {
    canvas.clear();
    canvas.backgroundColor = '#ffffff';

    const logoGroup = new fabric.Group([
      new fabric.IText('pick my', {
        left: 0,
        top: 0,
        fontSize: 24,
        fontFamily: 'Caveat',
        fill: '#d63031',
      }),
      new fabric.IText('SCHOOL ai', {
        left: 70,
        top: -4,
        fontSize: 30,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fill: '#d63031',
      })
    ], {
      left: 240, 
      top: 80,
    });

    const mainTitle = new fabric.IText('ADMISSION\nOPEN', {
      left: 90,
      top: 250,
      fontSize: 64,
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
      fill: '#1a1b2e', 
      lineHeight: 1.1,
    });

    const rectOutline = new fabric.Rect({
      left: 90,
      top: 410,
      width: 500,
      height: 60,
      fill: 'transparent',
      stroke: '#d63031',
      strokeWidth: 2,
    });

    const subText = new fabric.IText('Enroll now for the academic year 2026-27', {
      left: 105,
      top: 428,
      fontSize: 22,
      fontFamily: 'Arial',
      fill: '#333333',
    });

    const btnRect = new fabric.Rect({
      width: 220,
      height: 55,
      fill: '#d63031',
      rx: 27,
      ry: 27,
    });

    const btnText = new fabric.IText('APPLY NOW', {
      fontSize: 16,
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      originX: 'center',
      originY: 'center',
      left: 110,
      top: 27.5,
    });

    const applyNowBtn = new fabric.Group([btnRect, btnText], {
      left: 370,
      top: 600,
    });

    canvas.add(logoGroup, mainTitle, rectOutline, subText, applyNowBtn);
    canvas.renderAll();
  };

  const addText = () => {
    if (!fabricCanvas.current) return;
    try {
        const text = new fabric.IText('Double click to edit...', {
          left: 100,
          top: 100,
          fontFamily: 'Arial',
          fontSize: 28,
          fill: '#1a1b2e',
          editable: true 
        });
        fabricCanvas.current.add(text);
        fabricCanvas.current.setActiveObject(text);
        fabricCanvas.current.renderAll();
        setActiveTool('text');
        setShowShapeMenu(false);
        setShowSizeMenu(false);
    } catch(e) {
        console.error("Text insertion failed:", e);
    }
  };

  const addShape = (type: 'rect' | 'circle' | 'triangle') => {
    if (!fabricCanvas.current) return;
    
    const commonProps = {
      left: 150,
      top: 150,
      fill: '#d63031',
      opacity: 0.9,
    };

    let shape;
    if (type === 'rect') {
      shape = new fabric.Rect({ ...commonProps, width: 100, height: 100 });
    } else if (type === 'circle') {
      shape = new fabric.Circle({ ...commonProps, radius: 50 });
    } else if (type === 'triangle') {
      shape = new fabric.Triangle({ ...commonProps, width: 100, height: 100 });
    }

    if (shape) {
      fabricCanvas.current.add(shape);
      fabricCanvas.current.setActiveObject(shape);
      fabricCanvas.current.renderAll();
    }
    
    setActiveTool('shapes');
    setShowShapeMenu(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas.current) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result;
      if (typeof data === 'string') {
        fabric.Image.fromURL(data, (imgInstance) => {
            if (imgInstance) {
                imgInstance.set({ left: 100, top: 100 });
                imgInstance.scaleToWidth(300);
                fabricCanvas.current?.add(imgInstance);
                fabricCanvas.current?.setActiveObject(imgInstance);
                fabricCanvas.current?.renderAll();
            }
        });
      }
    };
    reader.readAsDataURL(file);
    setActiveTool('image');
    setShowShapeMenu(false);
    setShowSizeMenu(false);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };


  const downloadCanvas = () => {
    if (!fabricCanvas.current) return;
    fabricCanvas.current.discardActiveObject();
    fabricCanvas.current.renderAll();
    
    const activeZoom = fabricCanvas.current.getZoom();
    const exportScaleMultiplier = 1 / activeZoom;
    
    const dataURL = fabricCanvas.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: exportScaleMultiplier
    });
    
    const link = document.createElement('a');
    link.download = 'tpc-canvas-design.png';
    link.href = dataURL;
    link.click();
  };

  return (
    <div className={styles.canvasSection}>
      <div className={styles.sidebar}>
        <button 
          className={`${styles.toolButton} ${activeTool === 'select' ? styles.activeTool : ''}`}
          onClick={() => { setActiveTool('select'); setShowShapeMenu(false); setShowSizeMenu(false); }}
          title="Selection Tool"
        >
          <MousePointer2 size={24} />
        </button>

        <div className={styles.shapeMenuWrapper}>
          <button 
            className={`${styles.toolButton} ${activeTool === 'resize' ? styles.activeTool : ''}`}
            onClick={() => { setShowSizeMenu(!showSizeMenu); setShowShapeMenu(false); }}
            title="Resize Canvas"
          >
            <LayoutTemplate size={24} />
          </button>
          
          {showSizeMenu && (
             <div className={styles.shapeDropdown}>
                {Object.entries(CANVAS_SIZES).map(([key, size]) => (
                  <button 
                    key={key}
                    onClick={() => changeSize(key as keyof typeof CANVAS_SIZES)} 
                    className={styles.textOption} 
                    style={{ whiteSpace: 'nowrap', textAlign: 'left', width: '150px' }}
                  >
                    {size.label}
                  </button>
                ))}
             </div>
          )}
        </div>

        <button 
          className={`${styles.toolButton} ${activeTool === 'text' ? styles.activeTool : ''}`}
          onClick={addText}
          title="Add Text"
        >
          <Type size={24} />
        </button>

        <button 
          className={`${styles.toolButton} ${activeTool === 'image' ? styles.activeTool : ''}`}
          onClick={() => { fileInputRef.current?.click(); setShowShapeMenu(false); setShowSizeMenu(false); }}
          title="Add Image"
        >
          <ImageIcon size={24} />
        </button>

        <div className={styles.shapeMenuWrapper}>
          <button 
            className={`${styles.toolButton} ${activeTool === 'shapes' ? styles.activeTool : ''}`}
            onClick={() => { setShowShapeMenu(!showShapeMenu); setShowSizeMenu(false); }}
            title="Add Shape"
          >
            <Shapes size={24} />
          </button>
          
          {showShapeMenu && (
             <div className={styles.shapeDropdown}>
                <button onClick={() => addShape('rect')} className={styles.shapeOption} title="Rectangle"><Square size={20} /></button>
                <button onClick={() => addShape('circle')} className={styles.shapeOption} title="Circle"><Circle size={20} /></button>
                <button onClick={() => addShape('triangle')} className={styles.shapeOption} title="Triangle"><Triangle size={20} /></button>
             </div>
          )}
        </div>

        <div className={styles.bottomTools}>
          
          {/* Quick Undo / Redo visual references added as buttons as well */}
          <button 
            className={styles.toolButton}
            onClick={undo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={24} />
          </button>
          
          <button 
            className={styles.toolButton}
            onClick={redo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={24} />
          </button>

          <div style={{ height: '10px' }} /> {/* Spacer */}

          <button 
            className={styles.toolButton}
            onClick={deleteSelected}
            title="Delete Selected (Backspace/Del)"
            style={{ color: '#ff4d4f' }}
          >
            <Trash2 size={24} />
          </button>
          
          <button 
            className={styles.toolButton}
            onClick={downloadCanvas}
            title="Download Design"
          >
            <Download size={24} />
          </button>

        </div>
      </div>

      <div className={styles.workspace} ref={workspaceRef}>
      
        {/* Floating Text Properties Toolbar */}
        {selectedType === 'i-text' && (
           <div className={styles.propertiesBar}>
              <select 
                 className={styles.propSelect}
                 value={textProps.fontFamily}
                 onChange={(e) => applyTextProp('fontFamily', e.target.value)}
                 title="Font Family"
              >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Caveat">Caveat (Cursive)</option>
              </select>
              
              <input 
                 type="color" 
                 title="Text Color"
                 className={styles.propColor} 
                 value={textProps.fill}
                 onChange={(e) => applyTextProp('fill', e.target.value)}
              />
              
              <button 
                 className={`${styles.propButton} ${textProps.fontWeight === 'bold' ? styles.propButtonActive : ''}`}
                 onClick={() => applyTextProp('fontWeight', textProps.fontWeight === 'bold' ? 'normal' : 'bold')}
                 title="Bold"
              >
                 <Bold size={18} />
              </button>

              <button 
                 className={`${styles.propButton} ${textProps.fontStyle === 'italic' ? styles.propButtonActive : ''}`}
                 onClick={() => applyTextProp('fontStyle', textProps.fontStyle === 'italic' ? 'normal' : 'italic')}
                 title="Italic"
              >
                 <Italic size={18} />
              </button>
           </div>
        )}

        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} />
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className={styles.hiddenInput} 
        onChange={handleImageUpload}
        accept="image/*"
      />
    </div>
  );
}
