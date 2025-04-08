import React from 'react';

const ResultTable = ({ results }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Score</th>
          <th>Grade</th>
          <th>Remark</th>
        </tr>
      </thead>
      <tbody>
        {results.map((res, i) => (
          <tr key={i}>
            <td>{res.subject}</td>
            <td>{res.score}</td>
            <td>{res.grade}</td>
            <td>{res.remark}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultTable;
