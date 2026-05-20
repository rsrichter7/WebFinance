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
}
