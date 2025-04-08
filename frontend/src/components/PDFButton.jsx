import React from 'react';
import { useAuth } from '../context/AuthContext';

const PDFButton = ({ reg_no }) => {
  const { token } = useAuth();

  const download = () => {
    const a = document.createElement("a");
    a.href = `http://localhost:5000/api/results/download/${reg_no}`;
    a.setAttribute("download", `${reg_no}_result.pdf`);
    a.setAttribute("target", "_blank");
    a.click();
  };

  return <button onClick={download}>⬇️ Download PDF</button>;
};

export default PDFButton;
