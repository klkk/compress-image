import React from "react";
import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <main>
      <h1 style={{ textAlign: "center" }}>图片 & PDF 压缩工具</h1>
      <UploadForm />
      <footer style={{ textAlign: "center", marginTop: 32, color: "#888" }}>
        Powered by Next.js, sharp, pdf-lib & Vercel
      </footer>
    </main>
  );
}
