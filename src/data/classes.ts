import type { WoWClass } from '@/types'

// WoW Classic class colors (hex values)
export const CLASS_COLORS: Record<WoWClass, string> = {
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

// Get class color as hex
export const getClassColor = (wowClass: WoWClass): string => {
  return CLASS_COLORS[wowClass]
}

// Get class color as Tailwind background class
export const getClassBackgroundColor = (wowClass: WoWClass): string => {
  const colorMap: Record<WoWClass, string> = {
    warrior: 'bg-amber-100',
    paladin: 'bg-pink-100',
    hunter: 'bg-green-100',
    rogue: 'bg-yellow-100',
    priest: 'bg-gray-100',
    shaman: 'bg-blue-100',
    mage: 'bg-cyan-100',
    warlock: 'bg-purple-100',
    druid: 'bg-orange-100',
  }
  return colorMap[wowClass]
}

// Get class color as Tailwind border class
export const getClassBorderColor = (wowClass: WoWClass): string => {
  const colorMap: Record<WoWClass, string> = {
    warrior: 'border-amber-300',
    paladin: 'border-pink-300',
    hunter: 'border-green-300',
    rogue: 'border-yellow-300',
    priest: 'border-gray-300',
    shaman: 'border-blue-300',
    mage: 'border-cyan-300',
    warlock: 'border-purple-300',
    druid: 'border-orange-300',
  }
  return colorMap[wowClass]
}
