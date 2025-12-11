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
export type Role = 'tank' | 'healer' | 'mdps' | 'rdps' | 'dps' | 'frost' | 'fire' | 'arcane' | 'magic' | 'might'
export type TierLevel = 0 | 1 | 2 | 3 | 4 | 5
export type TierType = 'R' | 'D'

// WoW Classic race restrictions
export type AllianceRace = 'human' | 'dwarf' | 'nightelf' | 'gnome'
export type HordeRace = 'orc' | 'undead' | 'tauren' | 'troll'
export type Race = AllianceRace | HordeRace

export interface Account {
  id: string
  name: string
  createdAt: Date
}

export interface PlayerCharacter {
  id: string
  accountId: string
  name: string
  class: WoWClass
  race: Race
  faction: Faction
  level: number
  defaultRole?: Role // Default role for this character
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
  race?: Race
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

export interface CharacterSlotGroup {
  characterId: string
  liteSlot: RaidSlotAssignment | null      // Slot 0: Lite clone (free)
  companionSlots: (RaidSlotAssignment | null)[]  // Slots 1-4: Hired companions
}

export interface RaidSlotAssignment {
  class: WoWClass
  role: Role
  tier: TierLevel
  tierType: TierType
  race?: Race
  isLite: boolean
  characterName?: string
}

export interface RaidComposition {
  id: string
  accountId: string
  name: string
  faction: Faction
  currentPlayerId?: string  // Which character is the current player
  currentPlayerRole?: Role  // Current player's role (defaults to DPS)
  characterSlots: CharacterSlotGroup[]  // New structure
  // Legacy support
  slots: RaidSlot[]  // Keep for backward compatibility
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
