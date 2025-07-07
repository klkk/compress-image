import React, { useState } from "react";

type FileType = "image" | "pdf" | null;

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType>(null);
  const [quality, setQuality] = useState(70);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl(null);
    setError(null);
    if (f.type.startsWith("image/")) setFileType("image");
    else if (f.type === "application/pdf") setFileType("pdf");
    else setFileType(null);
  };

  const handleUpload = async () => {
    if (!file || !fileType) {
      setError("请选择图片或PDF文件！");
      return;
    }
    setLoading(true);
    setResultUrl(null);
    setError(null);

    try {
      const api = fileType === "image" ? "/api/compress-image" : "/api/compress-pdf";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", String(quality));

      const res = await fetch(api, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("压缩失败");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (e: any) {
      setError(e.message || "压缩失败");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h2>图片/PDF 压缩</h2>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
      />
      <div style={{ margin: "12px 0" }}>
        <label>
          压缩质量（10-100，数值越低压缩越大）：{quality}
        </label>
        <input
          type="range"
          min={10}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "压缩中..." : "上传并压缩"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {resultUrl && fileType === "image" && (
        <div style={{ marginTop: 16 }}>
          <p>压缩后图片：</p>
          <img src={resultUrl} alt="Compressed" style={{ maxWidth: "100%" }} />
          <a href={resultUrl} download="compressed-image">下载图片</a>
        </div>
      )}
      {resultUrl && fileType === "pdf" && (
        <div style={{ marginTop: 16 }}>
          <p>压缩后 PDF：</p>
          <a href={resultUrl} download="compressed.pdf">下载 PDF</a>
        </div>
      )}
    </div>
  );
}
