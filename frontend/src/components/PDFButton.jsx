import React from 'react';
import { downloadResult } from '../services/results';

const PDFButton = ({ reg_no }) => {
  const download = () => {
    downloadResult(reg_no);
  };

  return <button onClick={download}>⬇️ Download PDF</button>;
};

export default PDFButton;
