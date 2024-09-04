import { useState } from "react";
import imageCompression from "browser-images-compression";

const useImageUpload = (initialImages = []) => {
  const [images, setImages] = useState(initialImages);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - images.length;
    const newFiles = files.slice(0, remainingSlots);

    const compressedImages = await Promise.all(
      newFiles.map(async (file) => {
        try {
          const options = {
            maxSizeMB: 1, // 최대 1MB로 압축
            maxWidthOrHeight: 1920, // 최대 너비 또는 높이
            useWebWorker: true,
          };
          return await imageCompression(file, options);
        } catch (error) {
          console.error("이미지 압축 실패:", error);
          return file; // 압축 실패 시 원본 파일 사용
        }
      })
    );

    setImages((prevImages) => [...prevImages, ...compressedImages]);

    if (files.length > remainingSlots) {
      alert(
        `최대 5개의 이미지만 선택할 수 있습니다. ${
          files.length - remainingSlots
        }개의 이미지가 무시되었습니다.`
      );
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return { images, handleImageChange, removeImage };
};

export default useImageUpload;
