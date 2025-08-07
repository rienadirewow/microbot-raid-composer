import type { WoWClass, Race, Faction, AllianceRace, HordeRace } from '@/types'

export const CLASS_RACE_RESTRICTIONS: Record<WoWClass, Race[]> = {
  warrior: ['human', 'dwarf', 'nightelf', 'gnome', 'orc', 'undead', 'tauren', 'troll'],
  paladin: ['human', 'dwarf'], // Alliance only
  hunter: ['dwarf', 'nightelf', 'orc', 'tauren', 'troll'],
  rogue: ['human', 'dwarf', 'nightelf', 'gnome', 'orc', 'undead', 'troll'],
  priest: ['human', 'dwarf', 'nightelf', 'undead', 'troll'],
  shaman: ['orc', 'tauren', 'troll'], // Horde only
  mage: ['human', 'gnome', 'undead', 'troll'],
  warlock: ['human', 'gnome', 'orc', 'undead'],
  druid: ['nightelf', 'tauren'],
}

export const ALLIANCE_RACES: AllianceRace[] = ['human', 'dwarf', 'nightelf', 'gnome']
export const HORDE_RACES: HordeRace[] = ['orc', 'undead', 'tauren', 'troll']

export const getFactionFromRace = (race: Race): Faction =>
  ALLIANCE_RACES.includes(race as AllianceRace) ? 'alliance' : 'horde'

export const validateClassRace = (wowClass: WoWClass, race: Race): boolean =>
  CLASS_RACE_RESTRICTIONS[wowClass].includes(race)

export const RAID_GROUPS = Array.from({ length: 8 }, (_, i) => i + 1)
export const SLOTS_PER_GROUP = 5
export const TOTAL_RAID_SLOTS = 40
