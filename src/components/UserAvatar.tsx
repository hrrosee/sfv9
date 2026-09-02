import React, { useState } from 'react';

interface UserAvatarProps {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
  sizeClassName?: string;
  textClassName?: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  photoURL,
  displayName,
  email,
  sizeClassName = 'w-full h-full',
  textClassName = 'text-xs',
  className = '',
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const name = displayName?.trim() || '';
  const initial = name
    ? name[0].toUpperCase()
    : email
      ? email[0].toUpperCase()
      : 'U';

  const showImage = Boolean(photoURL && !imageFailed);

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center select-none ${sizeClassName} ${className}`}
    >
      {showImage ? (
        <img
          src={photoURL!}
          alt={name || 'Avatar'}
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-tr from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] text-white font-bold flex items-center justify-center uppercase shadow-inner ${textClassName}`}
        >
          {initial}
        </div>
      )}
    </div>
  );
};
