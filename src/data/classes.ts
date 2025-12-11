import type { WoWClass } from '@/types'

// WoW Classic class colors (hex values)
const CLASS_COLORS: Record<WoWClass, string> = {
  warrior: '#C79C6E', // Brown
  paladin: '#F58CBA', // Pink
  hunter: '#ABD473', // Green
  rogue: '#FFF569', // Yellow
  priest: '#FFFFFF', // White
  shaman: '#0070DE', // Blue
  mage: '#69CCF0', // Light Blue
  warlock: '#9482C9', // Purple
  druid: '#FF7D0A', // Orange
}

export const getClassColor = (wowClass: WoWClass | string): string => {
  return CLASS_COLORS[wowClass as WoWClass] || '#6B7280'
}
