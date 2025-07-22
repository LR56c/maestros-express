import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface ProfilePhotoHoverProps {
  initialImage?: string;
  onChange?: (file: File, imageString: string) => void;
}

const ProfilePhotoHover: React.FC<ProfilePhotoHoverProps> = ({ initialImage, onChange }) => {
  const [imageString, setImageString] = useState<string | undefined>(initialImage);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setImageString(result);
        if (onChange) onChange(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer group"
      onClick={handleClick}
      onMouseEnter={() => {}}
    >
      {imageString ? (
        <Image
          src={imageString}
          alt="Foto de perfil"
          width={128}
          height={128}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-200">
          <span className="text-gray-500">Sin foto</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white font-semibold">Cambiar foto</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePhotoHover;

