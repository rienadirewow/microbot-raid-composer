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
  warrior: ['tank', 'mdps'],
  paladin: ['tank', 'healer', 'magic', 'might'],
  hunter: ['rdps'],
  rogue: ['mdps'],
  priest: ['healer', 'rdps'],
  shaman: ['mdps', 'rdps', 'healer', 'tank'],
  mage: ['frost', 'fire', 'arcane'],
  warlock: ['rdps'],
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

// Most common/preferred roles for each class in WoW Classic raiding
export const CLASS_DEFAULT_ROLES: Record<WoWClass, Role> = {
  warrior: 'mdps',
  paladin: 'healer',
  hunter: 'rdps',
  rogue: 'mdps',
  priest: 'healer',
  shaman: 'healer',
  mage: 'frost',
  warlock: 'rdps',
  druid: 'healer',
}

export const getFactionFromRace = (race: Race): Faction =>
  ALLIANCE_RACES.includes(race as AllianceRace) ? 'alliance' : 'horde'

export const validateClassRace = (wowClass: WoWClass, race: Race): boolean =>
  CLASS_RACE_RESTRICTIONS[wowClass].includes(race)

export const getDefaultRole = (wowClass: WoWClass): Role => CLASS_DEFAULT_ROLES[wowClass] || 'dps'

export const RAID_GROUPS = Array.from({ length: 8 }, (_, i) => i + 1)
export const SLOTS_PER_GROUP = 5
export const TOTAL_RAID_SLOTS = 40
