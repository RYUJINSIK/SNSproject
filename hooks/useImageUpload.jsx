import { useState, useCallback } from "react";

const useImageUpload = (initialImages = []) => {
  const [images, setImages] = useState(initialImages);

  const handleImageChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      const remainingSlots = 5 - images.length;
      const newImages = files.slice(0, remainingSlots);

      setImages((prevImages) => [...prevImages, ...newImages]);

      if (files.length > remainingSlots) {
        alert(
          `최대 5개의 이미지만 선택할 수 있습니다. ${
            files.length - remainingSlots
          }개의 이미지가 무시되었습니다.`
        );
      }
    },
    [images.length]
  );

  const removeImage = useCallback((index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }, []);

  return { images, setImages, handleImageChange, removeImage };
};

export default useImageUpload;
