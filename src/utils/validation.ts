import type { PlayerCharacter, CompanionAssignment, RaidComposition } from '@/types'
import { validateClassRace, getFactionFromRace } from '@/data/wow-data'

export const validatePlayerCharacter = (character: PlayerCharacter): string[] => {
  const errors: string[] = []

  if (!validateClassRace(character.class, character.race)) {
    errors.push(`${character.class} cannot be ${character.race}`)
  }

  if (getFactionFromRace(character.race) !== character.faction) {
    errors.push(
      `Race ${character.race} belongs to ${getFactionFromRace(character.race)}, not ${character.faction}`,
    )
  }

  return errors
}

export const validateRaidComposition = (raid: RaidComposition): string[] => {
  const errors: string[] = []

  // Check faction consistency
  const assignedSlots = raid.slots.filter((slot) => slot.assignment)
  const factions = new Set(assignedSlots.map((slot) => getFactionFromRace(slot.assignment!.race)))

  if (factions.size > 1) {
    errors.push('Raid contains mixed factions')
  }

  if (factions.size === 1 && !factions.has(raid.faction)) {
    errors.push(`Raid faction (${raid.faction}) doesn't match assigned companions`)
  }

  return errors
}
