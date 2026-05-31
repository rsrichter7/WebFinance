// ─── Iconen ───
// Alle Lucide-stijl iconen op één plek.

import React from 'react'

export function Ico({ d, size = 18, stroke = 1.75 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
      {d}
    </svg>
  )
}

export const ICONS = {
  dashboard:  <Ico d={<><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>} />,
  tx:         <Ico d={<><path d="M7 7h13"/><path d="M17 4l3 3-3 3"/><path d="M17 17H4"/><path d="M7 14l-3 3 3 3"/></>} />,
  analytics:  <Ico d={<><path d="M3 3v18h18"/><path d="M7 16l4-5 4 3 5-7"/></>} />,
  budget:     <Ico d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  fixed:      <Ico d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M8 15h3"/></>} />,
  cal:        <Ico d={<><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/><path d="M8 2v4"/><path d="M16 2v4"/></>} />,
  settings:   <Ico d={<><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2m-9-11h2m18 0h2m-4.22-6.78 1.42-1.42M4.22 19.78l1.42-1.42M19.78 19.78l-1.42-1.42M4.22 4.22l1.42 1.42"/></>} />,
  collapse:   <Ico size={16} d={<path d="M15 18l-6-6 6-6"/>} />,
  expand:     <Ico size={16} d={<path d="M9 18l6-6-6-6"/>} />,
  lock:       <Ico size={13} d={<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>} />,
  plus:       <Ico size={14} d={<><path d="M12 5v14"/><path d="M5 12h14"/></>} />,
  edit:       <Ico size={14} d={<><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4z"/></>} />,
  trash:      <Ico size={14} d={<><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></>} />,
  chevDown:   <Ico size={14} d={<path d="M6 9l6 6 6-6"/>} />,
  chevRight:  <Ico size={14} d={<path d="M9 18l6-6-6-6"/>} />,
  chevLeft:   <Ico size={16} d={<path d="M15 18l-6-6 6-6"/>} />,
  search:     <Ico size={16} d={<><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>} />,
  home:       <Ico size={15} d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />,
  coffee:     <Ico size={15} d={<><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></>} />,
  piggy:      <Ico size={15} d={<><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.4-11-.3-12 6 0 0 .5 3 7 3 1 2 2 3 5 3 .5 0 1 0 1.5-.5L19 19l0-3c1.5-1 2-3.5 2-5 0-2-1-4-2-6z"/><path d="M2 9.5a2 2 0 1 0 0-3"/></>} />,
  target:     <Ico size={15} d={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>} />,
  grip:       <Ico size={14} d={<><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></>} />,
  users:      <Ico size={16} d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
  filter:     <Ico size={14} d={<><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>} />,
  wifi:       <Ico size={15} d={<><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></>} />,
  coin:       <Ico size={15} d={<><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/><path d="M9 11h6"/></>} />,
  car:        <Ico size={15} d={<><path d="M5 17H3a2 2 0 0 1-2-2V9l2-5h14l2 5v6a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></>} />,
  arrUp:      <Ico size={12} d={<><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></>} />,
  arrDown:    <Ico size={12} d={<><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></>} />,
  trending:   <Ico size={15} d={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>} />,

  wallet:     <Ico size={16} d={<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H6a2 2 0 0 0-2 2v2"/><path d="M22 12v4h-4a2 2 0 1 1 0-4h4z"/></>} />,

  // Instellingen-iconen
  user:       <Ico size={16} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />,
  sliders:    <Ico size={16} d={<><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>} />,
  folder:     <Ico size={16} d={<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>} />,
  database:   <Ico size={16} d={<><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>} />,
  bell:       <Ico size={16} d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>} />,
  info:       <Ico size={16} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>} />,
  shield:     <Ico size={16} d={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>} />,
  download:   <Ico size={14} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} />,
  upload:     <Ico size={14} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>} />,
  warn:       <Ico size={16} d={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />,
  github:     <Ico size={14} d={<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>} />,
  close:      <Ico size={16} d={<><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>} />,
  clock:      <Ico size={12} d={<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>} />,
  check:      <Ico size={12} d={<path d="M5 12l5 5 9-12"/>} />,
  sparkle:       <Ico size={14} d={<><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M19 3l.9 2.6L22.5 6.5l-2.6.9L19 10l-.9-2.6L15.5 6.5l2.6-.9Z"/></>} />,
  messageSquare: <Ico size={16} d={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>} />,

  // Thema-iconen
  sun:        <Ico size={16} d={<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.66 5.34l1.41-1.41"/></>} />,
  moon:       <Ico size={16} d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />,
  monitor:    <Ico size={16} d={<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></>} />,

  // Uitnodiging-iconen
  link:       <Ico size={16} d={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>} />,
  userPlus:   <Ico size={16} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></>} />,
  copy:       <Ico size={16} d={<><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>} />,
}
