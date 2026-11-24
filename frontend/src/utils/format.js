export const fmtMB = (b) => (b / 1024 / 1024).toFixed(1) + ' MB'
export const downloadBlob = (blob, name) => { const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = name; a.click(); URL.revokeObjectURL(u) }
export const csvOf = (rows) => {
  const head = 'Test Name,Measured,Unit,Reference Range,Status,Confidence\n'
  return head + rows.map(r => `"${r.name}",${r.value},"${r.unit}","${r.ref}","${r.status}",${r.conf}%`).join('\n')
}
