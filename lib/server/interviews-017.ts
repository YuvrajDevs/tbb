import "server-only";

/*
 * CASE 017 — interviews, server-only. What each person says when asked about another person ("p:<id>") or shown an
 * exhibit ("e:<number>"). Every answer carries a lead: a detail, a contradiction, or a pointer worth following, and
 * `lead` names the exhibit it points to (shown as a link only once that folder is open). Leads point at the truth and at
 * the red herrings alike, as a fair mystery should. Nobody confesses; the guilty keep their stories.
 *
 * Questions about people are open from the start, so their answers only lean on round 1 and 2 material.
 * Anything not scripted gets the person's redirect for the furthest folder the player has opened (`redirect`).
 */

export type Said = { t: string; lead?: number };
export interface Interview {
  intro: string;
  /** what they say to an unscripted question, by the furthest open folder (1..5): always a pointer somewhere useful */
  redirect: Record<number, Said>;
  topics: Record<string, Said>;
}

export const interviews017: Record<string, Interview> = {
  meera: {
    intro: "Meera Rathore receives you in the drawing room, a shawl round her shoulders. She is composed, and very tired.",
    redirect: {
      1: { t: "I was asleep, Inspector. If you want the evening, Sunita saw more of it than I did.", lead: 6 },
      2: { t: "I don't see what that has to do with me. Arjun is the one who was shouting at his father.", lead: 14 },
      3: { t: "Ask Anand about medicines. He brought everything Vikram ever took.", lead: 18 },
      4: { t: "Trust business was never mine. Anand and Vikram ran it between them.", lead: 22 },
      5: { t: "I've told you all I can. Whatever that camera says, ask the man who keeps it.", lead: 29 },
    },
    topics: {
      "p:vikram": { t: "He was careful about his health. I filled his pill organiser myself every Sunday, so I know he took nothing he shouldn't have.", lead: 2 },
      "p:arjun": { t: "Arjun came for money again. They were shouting by eight. After that I didn't hear him, but I'd taken my tablet by then.", lead: 14 },
      "p:kapoor": { t: "Anand came at about nine, as he does every Saturday. I said hello in the hall and went up. He was a little quiet.", lead: 10 },
      "p:kabir": { t: "Kabir wanted the lower land. Vikram had gone cold on him these last weeks. Kabir was not happy about it.", lead: 11 },
      "p:sunita": { t: "Sunita took his milk in at about twenty past nine. She'd know who was in the study better than I would.", lead: 6 },
      "e:2": { t: "She reads the time of death twice. 'One in the morning? Anand said so. I was asleep. I wouldn't know.'", lead: 5 },
      "e:3": { t: "She glances at the photograph and looks away. 'The rug was straight when I went up. I didn't go into the study after nine.'", lead: 3 },
      "e:5": { t: "'I don't understand those watches. Anand made him wear it.' She hands it back without reading it, which is its own kind of answer.", lead: 5 },
      "e:6": { t: "If Sunita heard a voice at quarter past ten, it was Vikram on the phone. He was always on the phone.", lead: 15 },
      "e:8": { t: "'That is exactly what happened.' She repeats the half past nine twice, as if it matters to her that you remember it.", lead: 32 },
      "e:10": { t: "'Anand and I go back a long way. He was at our wedding.' She doesn't say more about it.", lead: 34 },
      "e:15": { t: "Kabir rang him twice that night? He was relentless. And the hospital number, that's Anand's. They spoke often.", lead: 15 },
      "e:16": { t: "She reads the page for a long time. 'I was a nurse once. I know what potassium does. I don't know how it got into him.'", lead: 33 },
      "e:17": { t: "Glass from the fire? Vikram threw all sorts in there. Old papers, medicine strips. Ask Sunita who lit it.", lead: 6 },
      "e:18": { t: "Anand draws things for his patients all the time. You should ask him why, not me.", lead: 18 },
      "e:21": { t: "Mehta on Monday? He never told me he had a meeting. He told me nothing about the Trust.", lead: 23 },
      "e:22": { t: "'Trust business. Nothing for me to worry about, he said.' Her eyes stay on the laboratory's name a moment too long.", lead: 24 },
      "e:23": { t: "'I know of no letters. Vikram opened his own post.' The letter was found in her jewellery box.", lead: 27 },
      "e:24": { t: "Her eyes rest on the partners' names. 'Kapoor is a very common name, Inspector. So is Nisha.'", lead: 33 },
      "e:26": { t: "Arjun and I, I suppose. I've never read it. Vikram wasn't changing anything, as far as I knew.", lead: 26 },
      "e:27": { t: "'Envelopes come unstuck in this damp. Everything does.' Fresh glue doesn't come from damp.", lead: 23 },
      "e:32": { t: "Her composure slips. 'I couldn't sleep, so I rang my brother. Is that a crime?' She doesn't say who her brother is.", lead: 15 },
      "e:33": { t: "Yes, I was an ICU sister, at Rathore Memorial. That is how Vikram and I met, in 2014. I used my family name then.", lead: 24 },
      "e:34": { t: "'Our wedding. Anand gave me away. My father had passed by then.' She folds her hands and says nothing more.", lead: 10 },
    },
  },
  arjun: {
    intro: "Arjun Rathore sits on the edge of his chair, one knee jiggling. He looks like he hasn't slept.",
    redirect: {
      1: { t: "I don't know. But Papa had a bruise on his head and Uncle Anand called it his heart. Look at that.", lead: 2 },
      2: { t: "Why are you asking me? Uncle Anand's car was the last one out of that gate.", lead: 12 },
      3: { t: "Ask Uncle Anand what he brings in that bag of his. He's a doctor, not me.", lead: 18 },
      4: { t: "Money's Papa's Trust, not mine. Look at who signed the Trust's cheques.", lead: 22 },
      5: { t: "Ask the chowkidar. He writes everything in that book of his.", lead: 29 },
    },
    topics: {
      "p:vikram": { t: "He was hard on me. He was still my father. The last thing I said to him was that he'd regret it. I said sorry after.", lead: 14 },
      "p:meera": { t: "Polite. Always polite. She went upstairs early with a headache, she says. I wouldn't know, my door was shut.", lead: 8 },
      "p:kapoor": { t: "Uncle Anand was in a hurry to have it over with. Papa had a bruise on his head and he called it his heart.", lead: 7 },
      "p:kabir": { t: "Papa's land man. He's been sniffing round Hollow Pines all year. Papa stopped taking his calls.", lead: 11 },
      "p:sunita": { t: "Sunita didi practically raised me. If she says she heard something, she heard it.", lead: 6 },
      "e:2": { t: "One in the morning? He was cold when I saw him at seven, properly cold. That doesn't sound like six hours to me.", lead: 5 },
      "e:3": { t: "The rug. The chappal under the desk. Papa never left his things like that. Somebody moved things after.", lead: 3 },
      "e:5": { t: "He reads the export and goes pale. 'Something happened to him before ten. Not at one. Who cancelled the SOS?'", lead: 5 },
      "e:6": { t: "Bholu barks at everything. Monkeys, jackals. He looks at the floor when he says it.", lead: 19 },
      "e:7": { t: "'Natural, cardiac.' He wrote that before the police even came. What was the rush?", lead: 12 },
      "e:9": { t: "I stayed in my room. I've said it. He won't meet your eye.", lead: 14 },
      "e:13": { t: "That's Uncle Anand's car. Nine fifty-eight? He's always home for the ten o'clock news. Always.", lead: 30 },
      "e:14": { t: "He reads the last message twice and goes quiet. 'Fine. I went out. I didn't want anyone to know I was drinking again.'", lead: 19 },
      "e:16": { t: "So it wasn't his heart. I knew it. Somebody put something in his arm. Somebody who knew how.", lead: 18 },
      "e:19": { t: "Yes, that's mine. I was at the Clocktower till nearly midnight. I came back by the back gate. Ask the barman.", lead: 19 },
      "e:26": { t: "I didn't kill my father for money I'd have to share with her. And the will wasn't changing. Ask Mehta.", lead: 26 },
      "e:29": { t: "The chowkidar's book? Look at the times he writes. They don't match the camera's. They never have.", lead: 12 },
    },
  },
  kapoor: {
    intro: "Dr. Anand Kapoor arrives exactly on time, in a tweed jacket. He answers every question as if dictating notes.",
    redirect: {
      1: { t: "I'm a doctor, Inspector. Ask me about his heart. The rest, ask the household.", lead: 6 },
      2: { t: "I left at 9.40. My wife will tell you I was home for the news.", lead: 10 },
      3: { t: "Medicine is my department. The fire, the glass, I can't speak to.", lead: 17 },
      4: { t: "Trust matters are confidential. Ask the bank.", lead: 22 },
      5: { t: "I have said what I have to say. Check the recorder before you check my word.", lead: 28 },
    },
    topics: {
      "p:vikram": { t: "Thirty years a friend, twenty a patient. His heart was weak for a long time. I gave him his B12 that night, as always.", lead: 10 },
      "p:meera": { t: "Meera nursed him through 2014 in our ICU. She was one of our best sisters. She has been devoted to him ever since.", lead: 10 },
      "p:arjun": { t: "A troubled young man. He was shouting at his father the night he died. I could hear it from the hall.", lead: 14 },
      "p:kabir": { t: "Sethi wanted the land. Vikram had cooled on it. I kept out of it. Sethi did not take it well.", lead: 11 },
      "p:sunita": { t: "A loyal woman. She brought his milk to the door while I was with him, at about twenty past nine.", lead: 6 },
      "e:2": { t: "'The Inspector chose to override me.' He taps the time of death. 'One a.m. I stand by that.' He does not look at the rigor notes.", lead: 5 },
      "e:5": { t: "I entered his blood pressure on that watch myself, at about nine. The later entries I can't speak to.", lead: 5 },
      "e:6": { t: "Yes, I took the milk from her at the door. We were nearly done. I left not long after.", lead: 10 },
      "e:7": { t: "I wrote what I believed. A post-mortem was unnecessary, and cruel to the family. He signs his notes with the time, always.", lead: 12 },
      "e:10": { t: "I left at 9.40. I was home in time for the ten o'clock news. My wife will tell you.", lead: 30 },
      "e:12": { t: "Twenty-one fifty-eight? That's wrong. I was home by then. Look at the time I arrived in the morning, too. It's wrong there as well.", lead: 7 },
      "e:13": { t: "That is my car, yes. The time on it is not right. That machine has been wrong since the power cut.", lead: 29 },
      "e:16": { t: "He is quiet for a long time. 'Potassium chloride. That is not a natural death.' He does not look at you.", lead: 18 },
      "e:17": { t: "An ampoule in his fire? I don't know how that came to be there. He wipes his glasses twice.", lead: 18 },
      "e:18": { t: "Ward 3 needed it. The countersignature was an oversight. Everybody signs those late. He doesn't say who took them from the ward.", lead: 16 },
      "e:22": { t: "Lab services for the hospital. Perfectly ordinary payments. I approved them as Medical Trustee.", lead: 24 },
      "e:24": { t: "A diagnostics partnership. My name is on it, yes. The other partner is family. I won't involve her.", lead: 33 },
      "e:28": { t: "Eighteen minutes fast. So I left at 9.40, just as I said. Then he stops, as if he has heard what that means.", lead: 5 },
      "e:30": { t: "Sunanda has no reason to lie for me. I was home before ten.", lead: 28 },
      "e:31": { t: "Everything in it is true. I took money. I did not take his life.", lead: 32 },
      "e:33": { t: "That is our father's name, yes. He takes the card back slowly. 'She has suffered enough.'", lead: 34 },
      "e:34": { t: "I was at their wedding, yes. I gave the bride away. Her father had passed. Our father.", lead: 33 },
    },
  },
  kabir: {
    intro: "Kabir Sethi takes your call from Dehradun. A television is on somewhere behind him, and he does not turn it down.",
    redirect: {
      1: { t: "I wasn't even in Mussoorie. Ask the people who were in the house.", lead: 6 },
      2: { t: "Check my phone, Inspector. I was in Dehradun all night.", lead: 15 },
      3: { t: "Whatever was in that fire, I wasn't there to put it there.", lead: 15 },
      4: { t: "Monday was about Trust money, I gather. Not my land. Look at the Trust.", lead: 22 },
      5: { t: "I'm the last man you need. Look closer to home.", lead: 32 },
    },
    topics: {
      "p:vikram": { t: "We had a handshake deal in June. Then he went cold, overnight, about a month ago. Something else had his attention.", lead: 21 },
      "p:meera": { t: "Charming. She always said the land would sell eventually. She seemed to know a lot about Trust business for someone who 'never' discussed it.", lead: 8 },
      "p:arjun": { t: "The son? Owes money all over Landour. He asked me for a loan in August. I said no.", lead: 9 },
      "p:kapoor": { t: "The good doctor sits on the Trust. Vikram trusted him with everything, until lately.", lead: 10 },
      "p:sunita": { t: "I met her once. She gave me tea, and a look.", lead: 6 },
      "e:11": { t: "I was at Pinky's sangeet in Dehradun until half past one. Two hundred people saw me dancing badly. Check the towers.", lead: 15 },
      "e:15": { t: "I called him twice around ten to apologise. He didn't pick up. Somebody else might have been with him.", lead: 6 },
      "e:20": { t: "I'd had a couple of drinks. I wanted to talk before Monday. I thought Monday was about my land.", lead: 21 },
      "e:21": { t: "Mehta on Monday. I assumed he was going to block the sale. If it wasn't the land, it was something worse.", lead: 22 },
      "e:22": { t: "Lab payments? Nothing to do with me. Find out who owns that lab.", lead: 24 },
      "e:25": { t: "I regret that email. My board was on my neck. It was a figure of speech, and I was an hour away.", lead: 15 },
      "e:26": { t: "If I'd wanted the land that badly, I'd have needed him alive to sign it.", lead: 26 },
    },
  },
  sunita: {
    intro: "Sunita Negi stands until you ask her to sit. She keeps her hands folded in her lap the whole time.",
    redirect: {
      1: { t: "I am only the housekeeper. But the study was not right in the morning. Look at the photograph.", lead: 3 },
      2: { t: "I don't know such things. The chowkidar knows the gate better than me.", lead: 12 },
      3: { t: "I don't know medicines. Doctor Sahib brought all of them.", lead: 16 },
      4: { t: "Sahib was worried about papers this month. He worked late every night.", lead: 21 },
      5: { t: "Memsahib's phone, Sahib. She is always on it with her family.", lead: 32 },
    },
    topics: {
      "p:vikram": { t: "Sahib was strict, but fair. He paid my son's school fees for five years. This last month he worked late, worried, over papers.", lead: 21 },
      "p:meera": { t: "Memsahib went up at nine with a headache. She told me not to disturb her. But her light was on when I went to bed.", lead: 8 },
      "p:arjun": { t: "Arjun baba is not a bad boy. He drinks when he is sad. His scooter was in the shed in the morning, but wet.", lead: 9 },
      "p:kapoor": { t: "Doctor Sahib took the milk from me at the door. He did not let me see Sahib. He said they were nearly done.", lead: 10 },
      "p:kabir": { t: "The resort man. He came once. Sahib did not like him. He telephones too much.", lead: 15 },
      "e:2": { t: "One in the morning? His milk was still full in the tumbler. Sahib never left his haldi milk. Something happened before he could drink it.", lead: 3 },
      "e:3": { t: "The rug was not like that when I lit the fire at eight. And the chappal under the desk. Sahib never left them like that.", lead: 5 },
      "e:4": { t: "The study is at the end of the hall. From the front door you can hear the study, if it is quiet. I was at the front door at quarter past ten.", lead: 6 },
      "e:5": { t: "I don't understand the watch. But Sahib always wore it, even in bed. Memsahib said it was for his heart.", lead: 5 },
      "e:6": { t: "Everything I said is true. At quarter past ten, a voice. Low, on and off, like one person on the phone. I thought it was Sahib. Now I am not so sure.", lead: 15 },
      "e:8": { t: "Memsahib said she was asleep. Her light was on when I went to bed at quarter to eleven. I did not go up to see.", lead: 32 },
      "e:15": { t: "The phone in the study rang late, yes. Nobody answered it. But somebody was talking.", lead: 32 },
      "e:29": { t: "Bholu barked at the back gate near midnight. Then he stopped, like he knew who it was. The back gate has no camera.", lead: 19 },
      "e:34": { t: "Memsahib's wedding. Doctor Sahib gave her away. They are close, those two. Like family.", lead: 33 },
    },
  },
};
