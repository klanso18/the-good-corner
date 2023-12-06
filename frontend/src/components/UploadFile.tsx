import React, { ChangeEvent } from "react";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import axios from "axios";

interface FileInputProps {
  onChange: (imageUrl: string) => void;
  imageUrl: string;
  onImageError: () => void;
}

const UploadFile: React.FC<FileInputProps> = ({
  onChange,
  imageUrl,
  onImageError,
}) => {
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const form = new FormData();
    const file = e.target.files?.[0];
    if (file) {
      form.append("file", file);
      axios
        .post("http://localhost:8000/uploads", form)
        .then((res) => {
          onChange(res.data.url);
        })
        .catch(onImageError);
    }
  };

  return (
    <div className="image-block">
      <input
        type="text"
        name="picture"
        value={imageUrl}
        id="picture"
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://imageshack.com/zoot.png"
        className="input input-bordered w-full max-w-sm mr-2"
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="fileInput"
        onChange={handleFileUpload}
      />
      <label htmlFor="fileInput" className="button button-primary upload-btn">
        <ArrowUpOnSquareIcon
          className="cursor-pointer"
          width={24}
          height={24}
        />
      </label>
    </div>
  );
};

export default UploadFile;
