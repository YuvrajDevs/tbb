import "server-only";

/*
 * CASE 017 — searching the house, server-only. Each room gives up its findings one search at a time, and only once
 * the folder of the finding's round is open. Findings agree with the exhibits and the bible; a few are real clues
 * that reward a careful search, most are texture. Nothing names the killer.
 */

export const search017: Record<string, { round: number; text: string; exhibit?: number }[]> = {
  study: [
    { round: 1, text: "The dhurrie is rucked into folds towards the hearth, as if something heavy was dragged across it. One leather chappal lies under the desk, its pair nowhere near it.", exhibit: 3 },
    { round: 1, text: "The corner of the little side table is freshly chipped. The bare wood is pale and clean, not yet darkened by dust or polish.", exhibit: 3 },
    { round: 3, text: "The grate has been sieved by the police. Near the hearth there is still a faint sharp smell, more chemist's shop than wood smoke.", exhibit: 17 },
  ],
  hall: [
    { round: 1, text: "From the front door to the study door is twelve paces. Standing here at night, a low voice behind that door would carry clearly." },
    { round: 2, text: "A row of hooks by the door: Vikram's shawl, Meera's umbrella, a spare set of car keys. None of the keys belong to Dr. Kapoor's car." },
  ],
  kitchen: [
    { round: 1, text: "The milk pan is washed and turned over to dry. One steel tumbler is missing from the set of six on the rack." },
    { round: 2, text: "A TV guide is open on the table. Sunita's serial is circled; it ends at ten o'clock.", exhibit: 6 },
  ],
  bedroom: [
    { round: 1, text: "On the nightstand, a strip of Zolpidem 10 mg with one tablet gone, and a migraine balm. The bed has been slept in on one side only." },
    { round: 4, text: "In the dressing-table drawer, an electric travel kettle and a small pot of paper glue. Odd things to keep in a bedroom.", exhibit: 27 },
    { round: 5, text: "Face down at the back of a drawer: a framed photograph of a much younger woman in a nursing sister's uniform.", exhibit: 33 },
  ],
  arjun: [
    { round: 1, text: "Headphones on the pillow, a laptop with a dead battery. By the door, a pair of trainers caked with wet red mud." },
    { round: 3, text: "In a jacket pocket, a crumpled paper napkin from the Clocktower Bar, and two coins.", exhibit: 19 },
  ],
  gate: [
    { round: 2, text: "The camera on the gate pillar looks straight down the drive. The recorder sits in the guard hut, on a shelf above a kettle.", exhibit: 12 },
    { round: 3, text: "The wall clock in the guard hut is well ahead of your watch. The chowkidar shrugs: 'It has been like that since the power went on Friday.'", exhibit: 28 },
  ],
  back: [
    { round: 1, text: "The back gate's latch is broken and the gate swings open at a push. There is no camera on this side." },
    { round: 2, text: "Bholu's chain is tied by the back gate. Fresh scooter tracks run from the lane to the shed, over older ones.", exhibit: 29 },
  ],
};
