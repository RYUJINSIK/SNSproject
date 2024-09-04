import React from "react";
import Image from "next/image";

const ImagePreview = ({ image, index, removeImage }) => (
  <div className="relative">
    <Image
      src={image}
      alt={`Preview ${index}`}
      width={80}
      height={80}
      className="object-cover rounded"
    />
    <button
      type="button"
      onClick={() => removeImage(index)}
      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
    >
      ×
    </button>
  </div>
);

export default React.memo(ImagePreview);
