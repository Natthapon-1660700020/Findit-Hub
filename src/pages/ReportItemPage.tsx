import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCreateItem } from '../hooks/useItems';
import type {
  ItemType,
  ItemCategory,
  CustodyLocation,
} from '../types/item';
import {
  ITEM_CATEGORIES,
  CAMPUS_LOCATIONS,
} from '../types/item';

export const ReportItemPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateItem();

  const [type, setType] = useState<ItemType>('Lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [custody, setCustody] = useState<CustodyLocation>('With Finder / Owner');
  const [contact, setContact] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState('');

  // สลับประเภทประกาศ พร้อมตั้งค่าเริ่มต้นของจุดเก็บของให้สอดคล้องกับความเป็นจริง
  const handleTypeSelect = (selectedType: ItemType) => {
    setType(selectedType);
    if (selectedType === 'Lost') {
      setCustody('With Finder / Owner');
    } else {
      setCustody('Central Lost & Found Room (Building A6 First Floor)'); // ตั้งค่าเริ่มต้นสำหรับ Found
    }
  };

  // ฟังก์ชันย่อขนาดภาพและแปลงเป็น Base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = Math.min(MAX_WIDTH / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImageUrl(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !description.trim() || !contact.trim()) {
      setErrorMessage('Please fill in all required fields (Title, Description, and Contact).');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        type,
        category,
        description: description.trim(),
        location,
        date,
        custody: type === 'Lost' ? 'With Finder / Owner' : custody,
        contact: contact.trim(),
        imageUrl: imageUrl || undefined,
      });

      navigate('/');
    } catch {
      setErrorMessage('Failed to submit report. Please verify connection and try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-base-100 p-6 sm:p-10 rounded-3xl border border-base-200 shadow-xl">
        <div className="text-center mb-8">
          <span className="badge badge-primary font-bold uppercase text-xs mb-2">
            Custom Feature
          </span>
          <h1 className="text-3xl font-extrabold text-base-content">Report an Item</h1>
          <p className="text-sm text-base-content/70 mt-1">
            Submit a lost item or publish a found object to help reunite belongings with their owner.
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-error text-sm mb-6 font-medium">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Item Type Selector */}
          <div>
            <label className="label font-bold text-sm">Report Type *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTypeSelect('Lost')}
                className={`btn py-3 font-bold ${
                  type === 'Lost' ? 'btn-error text-white' : 'btn-outline'
                }`}
              >
                🔍 I Lost an Item
              </button>
              <button
                type="button"
                onClick={() => handleTypeSelect('Found')}
                className={`btn py-3 font-bold ${
                  type === 'Found' ? 'btn-success text-white' : 'btn-outline'
                }`}
              >
                📦 I Found an Item
              </button>
            </div>
          </div>

          {/* 2. Title */}
          <div>
            <label className="label font-bold text-sm">Item Name / Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Brown Leather Wallet, AirPods Pro 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* 3. Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label font-bold text-sm">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="select select-bordered w-full"
              >
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label font-bold text-sm">
                {type === 'Lost' ? 'Date Lost *' : 'Date Found *'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* 4. Campus Location */}
          <div>
            <label className="label font-bold text-sm">
              {type === 'Lost'
                ? 'Last Seen Campus Location *'
                : 'Campus Location Where Found *'}
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="select select-bordered w-full"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Custody Location (แยกการแสดงผลตามประเภท Lost / Found) */}
          {type === 'Found' ? (
            <div>
              <label className="label font-bold text-sm">
                Where did you keep/leave the found item? (Pick-up Point) *
              </label>
              <select
                value={custody}
                onChange={(e) => setCustody(e.target.value as CustodyLocation)}
                className="select select-bordered w-full"
              >
                <option value="Central Lost & Found Room (Building A6 First Floor)">
                  Handed over to Central Lost & Found Room (Building A6 First Floor)
                </option>
                <option value="Building Reception / Staff Desk">
                  Left at Building Reception / Staff Desk
                </option>
                <option value="With Finder / Owner">
                  Kept with me (Finder - Contact me directly)
                </option>
              </select>
            </div>
          ) : (
            <div className="bg-base-200/70 p-4 rounded-xl border border-base-300 text-xs text-base-content/80 leading-relaxed">
              💡 <strong>Note for Lost Item:</strong> If someone finds your belonging, they can contact you directly via the contact channel below or drop it off at the <strong>Central Lost & Found Room (Building A6 First Floor)</strong>.
            </div>
          )}

          {/* 6. Contact Information */}
          <div>
            <label className="label font-bold text-sm">
              {type === 'Lost'
                ? 'Owner Contact Channel (So finder can reach you) *'
                : 'Finder / Office Contact Channel *'}
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Line: @student_bu / Phone: 081-xxx-xxxx"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* 7. Description */}
          <div>
            <label className="label font-bold text-sm">Detailed Description *</label>
            <textarea
              required
              rows={4}
              placeholder={
                type === 'Lost'
                  ? 'Describe distinctive features, brand, color, or contents to help others identify your item...'
                  : 'Describe the item you found and any specific instructions for the owner...'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* 8. Photo Upload (Optional) */}
          <div className="bg-base-200/50 p-4 rounded-2xl border border-base-200">
            <label className="label font-bold text-sm">
              Photo Upload{' '}
              <span className="font-normal text-xs text-base-content/60">(Optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="file-input file-input-bordered file-input-sm w-full"
            />
            {imageUrl && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(undefined)}
                  className="btn btn-xs btn-error btn-outline"
                >
                  Remove Photo
                </button>
              </div>
            )}
            <p className="text-xs text-base-content/60 mt-2">
              If no photo is uploaded, FindIt will automatically display an icon corresponding to the chosen category.
            </p>
          </div>

          {/* 9. Submit Button */}
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn btn-primary w-full text-base font-bold shadow-md"
          >
            {createMutation.isPending ? 'Submitting Report...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};