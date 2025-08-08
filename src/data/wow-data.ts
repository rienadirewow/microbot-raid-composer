import type { WoWClass, Race, Faction, AllianceRace, HordeRace, Role } from '@/types'

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

export const CLASS_ROLE_RESTRICTIONS: Record<WoWClass, Role[]> = {
  warrior: ['tank', 'dps'],
  paladin: ['tank', 'healer', 'dps'],
  hunter: ['dps'],
  rogue: ['dps'],
  priest: ['healer', 'dps'],
  shaman: ['mdps', 'rdps', 'healer', 'tank'],
  mage: ['dps'],
  warlock: ['dps'],
  druid: ['mdps', 'rdps', 'healer', 'tank'],
}

export const CLASS_SPEC_RESTRICTIONS: Record<WoWClass, string[]> = {
  warrior: ['arms', 'fury', 'protection'],
  paladin: ['protection', 'retribution', 'holy'],
  hunter: ['marksmanship', 'survival', 'beast mastery'],
  rogue: ['assassination', 'combat', 'subtlety'],
  priest: ['discipline', 'holy', 'shadow'],
  shaman: ['elemental', 'enhancement', 'restoration'],
  mage: ['arcane', 'fire', 'frost'],
  warlock: ['affliction', 'demonology', 'destruction'],
  druid: ['balance', 'feral', 'restoration'],
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
