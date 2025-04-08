// 🧠 LocalStorage student manager

export const saveStudentToStorage = (student) => {
  const current = JSON.parse(localStorage.getItem('students')) || [];
  const newStudent = { ...student, registered: false };
  localStorage.setItem('students', JSON.stringify([...current, newStudent]));
};

export const getStoredStudents = () => {
  return JSON.parse(localStorage.getItem('students')) || [];
};

export const markStudentRegistered = (name) => {
  const list = getStoredStudents().map((s) =>
    s.name === name ? { ...s, registered: true } : s
  );
  localStorage.setItem('students', JSON.stringify(list));
};

export const exportCSV = () => {
  const students = getStoredStudents();
  if (!students.length) {
    alert("⚠️ No data to export");
    return;
  }

  const headers = Object.keys(students[0]);
  const rows = students.map(s => headers.map(h => `"${s[h]}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'students_backup.csv';
  a.click();
};
