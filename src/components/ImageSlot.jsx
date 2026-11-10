import { useRef, useState } from 'react';

// The hero photo. Click to choose a file, or drag an image onto it.
export default function ImageSlot({ src, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }

  function openPicker() {
    window.open(src, '_blank');
  }

  return (
    <div
      className={`pa-hero-slot${dragging ? ' is-dragging' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Hero photo. Click or drop an image to replace it."
      onClick={openPicker}
    >
      {src ? (
        <img src={src} alt="A good dog" />
      ) : (
        <p className="pa-hero-placeholder">
          <i className="ph-duotone ph-paw-print" />
          Drop a photo of a good dog here
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => loadFile(e.target.files?.[0])}
      />
    </div>
  );
}
