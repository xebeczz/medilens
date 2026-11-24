// Saved uploaded reports: persisted in localStorage (metadata + extracted results),
// with the uploaded file itself kept as an in-memory object URL for this session.
const KEY = 'medilens_saved_reports'
export const fileUrls = new Map() // reportId -> object URL (session only)
export function loadSaved() { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
export function saveReport(report) {
  const all = loadSaved().filter(r => r.id !== report.id)
  all.unshift(report)
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 20)))
  return report
}
export function getSaved(id) { return loadSaved().find(r => String(r.id) === String(id)) || null }
export function deleteSaved(id) {
  localStorage.setItem(KEY, JSON.stringify(loadSaved().filter(r => String(r.id) !== String(id))))
  if (fileUrls.has(String(id))) { URL.revokeObjectURL(fileUrls.get(String(id))); fileUrls.delete(String(id)) }
}
export function registerFile(id, file) {
  const url = URL.createObjectURL(file)
  fileUrls.set(String(id), url)
  return url
}
export function getFileUrl(id) { return fileUrls.get(String(id)) || null }
