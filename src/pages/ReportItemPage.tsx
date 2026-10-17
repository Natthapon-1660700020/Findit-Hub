import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useCreateItem } from '../hooks/useItems';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS, CUSTODY_OPTIONS, type ItemType, type ItemCategory, type CustodyLocation } from '../types/item';
import { Icon } from '../components/Icon';
const localToday = () => {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
};
export function ReportItemPage() {
  const navigate = useNavigate();
  const mutation = useCreateItem();
  const [type, setType] = useState<ItemType>('Lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory | ''>('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(localToday);
  const [description, setDescription] = useState('');
  const [custody, setCustody] = useState<CustodyLocation>('Central Lost & Found Room (Building A6 First Floor)');
  const [contact, setContact] = useState('');
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const imageVersion = useRef(0);
  const errorRef = useRef<HTMLDivElement>(null);
  function removeImage() {
    imageVersion.current++;
    setImageUrl(undefined);
    setFileName('');
    setProcessing(false);
    setImageError('');
    if (fileInput.current) fileInput.current.value = '';
  }
  async function readImage(file: File) {
    const version = ++imageVersion.current;
    setImageError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('Please choose a JPG, PNG, or WEBP image.');
      setProcessing(false);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('This image is too large. Please choose a file under 5 MB.');
      setProcessing(false);
      return;
    }
    setProcessing(true);
    try {
      const data = await new Promise<string>((ok, fail) => {
        const reader = new FileReader();
        reader.onload = () => ok(reader.result as string);
        reader.onerror = () => fail(new Error('Read failed'));
        reader.readAsDataURL(file);
      });
      const img = await new Promise<HTMLImageElement>((ok, fail) => {
        const image = new Image();
        image.onload = () => ok(image);
        image.onerror = () => fail(new Error('Invalid image'));
        image.src = data;
      });
      const scale = Math.min(800 / Math.max(img.width, img.height), 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Image processing unavailable');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (version === imageVersion.current) {
        setImageUrl(canvas.toDataURL('image/jpeg', .8));
        setFileName(file.name);
      }
    } catch {
      if (version === imageVersion.current) setImageError('We could not read this image. Please try another file.');
    } finally {
      if (version === imageVersion.current) setProcessing(false);
    }
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!title.trim() || !description.trim() || !contact.trim() || !category || !location) {
      setError('Please complete all required fields.');
      return;
    }
    if (processing) return;
    try {
      await mutation.mutateAsync({
        title: title.trim(),
        type,
        category,
        description: description.trim(),
        location,
        date,
        custody: type === 'Lost' ? 'With Finder / Owner' : custody,
        contact: contact.trim(),
        imageUrl
      });
      navigate('/', {
        state: {
          reportCreated: true
        }
      });
    } catch {
      setError('We could not publish your report. Please try again.');
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }
  const busy = mutation.isPending || processing;
  return <div className="page report-page">
    <div className="page-heading">
      <div>
        <span className="eyebrow">Make someone’s day</span>
        <h1>Report an item</h1>
      </div>
    </div>
    <form className="form-panel" onSubmit={submit}>
      <div className="report-type" role="group" aria-label="Report type">
        {(['Lost', 'Found'] as const).map(t => <button type="button" key={t} className={type === t ? 'selected' : ''} aria-pressed={type === t} onClick={() => setType(t)} disabled={mutation.isPending}><span className={'status-dot dot-' + t.toLowerCase()} />{t} item</button>)}
      </div>
      {error && <div className="error-alert" ref={errorRef} tabIndex={-1} role="alert">
        <Icon name="info" size={17} />
        {error}
      </div>}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="item-name">Item name <span className="required">*</span></label>
          <div className="input-wrap">
            <Icon name="tag" size={18} />
            <input id="item-name" required maxLength={120} placeholder="e.g. Brown leather wallet" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="category">Category <span className="required">*</span></label>
          <div className="input-wrap">
            <Icon name="grid" size={17} />
            <select id="category" required value={category} onChange={e => setCategory(e.target.value as ItemCategory)}>
              <option value="" disabled>Select a category</option>
              {ITEM_CATEGORIES.map(c => <option key={c}>
                {c}
              </option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="location">
            {type === 'Lost' ? 'Last seen location' : 'Found location'}
            <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <Icon name="pin" size={18} />
            <select id="location" required value={location} onChange={e => setLocation(e.target.value)}>
              <option value="" disabled>Select a campus location</option>
              {CAMPUS_LOCATIONS.map(l => <option key={l}>
                {l}
              </option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="date">Date {type === 'Lost' ? 'lost' : 'found'} <span className="required">*</span></label>
          <div className="input-wrap">
            <Icon name="calendar" size={18} />
            <input id="date" type="date" required max={localToday()} value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>
        <div className="field full">
          <label htmlFor="description">Description <span className="required">*</span></label>
          <textarea id="description" required maxLength={3000} placeholder={type === 'Lost' ? 'Describe the item, any distinctive details, and where you last saw it…' : 'Describe what you found, its distinctive details, and where you found it…'} value={description} onChange={e => setDescription(e.target.value)} rows={4} />
        </div>
        {type === 'Found' && <div className="field full">
          <label htmlFor="custody">Pick-up point <span className="required">*</span></label>
          <div className="input-wrap">
            <Icon name="building" size={18} />
            <select id="custody" value={custody} onChange={e => setCustody(e.target.value as CustodyLocation)}>
              {CUSTODY_OPTIONS.map(c => <option key={c} value={c}>
                {c === 'With Finder / Owner' ? 'Kept with me — contact the finder' : c}
              </option>)}
            </select>
          </div>
          <p className="field-help">Let the owner know where their item is being kept.</p>
        </div>}
        <div className="field full">
          <label htmlFor="contact">
            {type === 'Lost' ? 'Owner contact' : 'Finder / office contact'}
            <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <Icon name="phone" size={17} />
            <input id="contact" required maxLength={250} placeholder="e.g. Line: @yourname or Phone: 081-xxx-xxxx" value={contact} onChange={e => setContact(e.target.value)} aria-describedby="contact-help" />
          </div>

        </div>
        {type === 'Lost' && <div className="form-note field full">
          <Icon name="info" size={16} />
          <p>A finder can contact you directly or hand in your item at Central Lost &amp; Found, Building A6 (first floor).</p>
        </div>}
        <div className="field full">
          <label htmlFor="photo">Item photo <span className="optional">(optional)</span></label>
          <div className={'upload-area' + (dragging ? ' dragging' : '')} onDragOver={e => {
            e.preventDefault();
            setDragging(true);
          }} onDragLeave={() => setDragging(false)} onDrop={e => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && !mutation.isPending) void readImage(file);
          }}>
            <div className="upload-icon">
              <Icon name="image" size={29} />
            </div>
            <div>
              <strong>
                {processing ? 'Preparing your image…' : 'Click to upload or drag and drop'}
              </strong>
              <p>JPG, PNG, or WEBP · Up to 5 MB</p>
            </div>
            <input ref={fileInput} id="photo" type="file" accept="image/jpeg,image/png,image/webp" disabled={mutation.isPending} aria-describedby="photo-help" onChange={e => {
              const file = e.target.files?.[0];
              if (file) void readImage(file);
            }} />
          </div>
          {imageError && <p className="error-alert" role="alert">
            {imageError}
          </p>}
          {imageUrl && <div className="upload-preview">
            <img src={imageUrl} alt="Your item photo preview" />
            <div>
              <strong>
                {fileName}
              </strong>
              <p>Ready to add to your report</p>
            </div>
            <button type="button" className="icon-button" onClick={removeImage} aria-label="Remove photo" disabled={mutation.isPending}>
              <Icon name="trash" size={18} />
            </button>
          </div>}

        </div>
      </div>
      <div className="form-submit">
        <button className="button button-primary button-full" type="submit" disabled={busy}>
          <Icon name="send" size={18} />
          {mutation.isPending ? 'Publishing your report…' : processing ? 'Preparing image…' : 'Submit report'}
        </button>
        <p className="form-footnote"><Icon name="info" size={12} />Please share accurate details to help others identify the item.</p>
      </div>
    </form>
  </div>;
}
