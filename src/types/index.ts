export type Faction = 'alliance' | 'horde' | 'mixed'
export type WoWClass =
  | 'warrior'
  | 'paladin'
  | 'hunter'
  | 'rogue'
  | 'priest'
  | 'shaman'
  | 'mage'
  | 'warlock'
  | 'druid'
export type Role = 'tank' | 'healer' | 'meleedps' | 'rangedps'
export type TierLevel = 0 | 1 | 2 | 3 | 4 | 5

// WoW Classic race restrictions
export type AllianceRace = 'human' | 'dwarf' | 'nightelf' | 'gnome'
export type HordeRace = 'orc' | 'undead' | 'tauren' | 'troll'
export type Race = AllianceRace | HordeRace

export interface PlayerCharacter {
  id: string
  name: string
  class: WoWClass
  race: Race
  faction: Faction
  level: number
  unlockedTiers: {
    r: TierLevel
    d: TierLevel
  }
  createdAt: Date
}

export interface CompanionAssignment {
  id: string
  name: string
  tier: TierLevel
  class: WoWClass
  role: Role
  race: Race
  ownerId: string // PlayerCharacter.id
}

export interface RaidSlot {
  slot: number
  group: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  assignment?: CompanionAssignment
}

export interface RaidComposition {
  id: string
  name: string
  faction: Faction
  slots: RaidSlot[]
  createdAt: Date
  updatedAt: Date
}

export interface UserData {
  characters: PlayerCharacter[]
  raids: RaidComposition[]
  settings: {
    defaultFaction?: Faction
    autoSave: boolean
  }
}
