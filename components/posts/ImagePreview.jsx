import React from "react";
import Image from "next/image";

const ImagePreview = React.memo(({ image, index, removeImage }) => (
  <div className="relative">
    <Image
      src={image}
      alt={`Preview ${index}`}
      width={150}
      height={150}
      style={{ width: 150, height: 150 }}
      className="object-cover rounded"
    />
    <button
      type="button"
      onClick={() => removeImage(index)}
      className="absolute top-1 right-1 bg-[#91684A] text-white text-lg rounded-full w-6 h-6 flex items-center justify-center"
    >
      ×
    </button>
  </div>
));

ImagePreview.displayName = "ImagePreview";

export default ImagePreview;
