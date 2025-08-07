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
export type Role = 'tank' | 'healer' | 'mdps' | 'rdps' | 'dps'
export type TierLevel = 0 | 1 | 2 | 3 | 4 | 5
export type TierType = 'R' | 'D'

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

export interface PlayerSlot {
  class: WoWClass
  role: Role
  tier: TierLevel
  tierType: TierType
  isCharacter?: boolean
  characterName?: string
  isControlMember?: boolean
}

export interface CharacterRow {
  character: PlayerCharacter
  slots: (PlayerSlot | null)[]
}

export type Composition = CharacterRow[]

// Legacy interfaces for backward compatibility
export interface Companion {
  class: WoWClass
  role: Role
  spec?: string
  tier: TierLevel
}

export interface CompanionAssignment {
  id: string
  name: string
  class: WoWClass
  role: Role
  tier: TierLevel
  race: Race
  ownerId: string
}

export interface CharacterRaidGroup {
  character_id: string
  include_copy_in_raid: boolean
  is_current_player: boolean
  companions: Companion[]
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
