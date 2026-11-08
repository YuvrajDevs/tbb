import "server-only";

/*
 * CASE 017 — interviews, server-only. What each person says when asked about another person ("p:<id>") or shown an
 * exhibit ("e:<number>"). Lines follow the statements and the writer's bible: nobody confesses, the guilty keep to
 * their stories, and late exhibits only make a story wobble. Anything not listed gets one of the person's fallbacks.
 */

export interface Interview {
  intro: string;
  fallback: string[];
  topics: Record<string, string>;
}

export const interviews017: Record<string, Interview> = {
  meera: {
    intro: "Meera Rathore receives you in the drawing room, a shawl round her shoulders. She is composed, and very tired.",
    fallback: ["I don't see what that has to do with me.", "You would have to ask someone else about that, Inspector.", "I've told you everything I know."],
    topics: {
      "p:vikram": "He was a careful man, and a kind one. I filled his tablets every Sunday. I still can't believe his heart just stopped.",
      "p:arjun": "Arjun loved his father, but he only came to him for money. That night was no different. They were shouting by eight.",
      "p:kapoor": "Anand has looked after Vikram for twenty years. He came every Saturday. He's almost family to us.",
      "p:kabir": "Kabir wanted the lower land for his resort. Vikram had gone cold on it these last weeks. I never asked why.",
      "p:sunita": "Sunita has been in this house longer than I have. She sees everything, and says very little.",
      "e:3": "She glances at the photograph and looks away. 'I didn't go into the study after nine. I was upstairs.'",
      "e:5": "I don't understand those watches. Vikram wore it because Anand told him to. I was asleep, I've told you.",
      "e:6": "If Sunita heard a voice at quarter past ten, it was Vikram on the phone. He was always on the phone.",
      "e:8": "That is exactly what happened. I took my tablet at half past nine and slept until Sunita screamed.",
      "e:15": "Kabir rang him twice that night? He was relentless about that land.",
      "e:16": "She reads the page for a long time. 'I was a nurse once. I know what potassium does. I don't know how it got into him.'",
      "e:17": "Glass from the fire? Vikram threw all sorts of things in there. Old papers, medicine strips.",
      "e:18": "Anand draws things for his patients all the time. You should ask him, not me.",
      "e:21": "He was always writing in that diary. Mehta on Monday? He never told me he had a meeting.",
      "e:22": "Trust business. He said it was nothing for me to worry about.",
      "e:23": "I told you, I know of no letters. Vikram opened his own post.",
      "e:24": "Her eyes rest on the partners' names a moment too long. 'Kapoor is a very common name, Inspector.'",
      "e:26": "Arjun and I, I suppose. I've never read it.",
      "e:27": "I've said what I said. Envelopes come unstuck in this damp. Everything does.",
      "e:32": "Her composure slips. 'I couldn't sleep, so I rang my brother. Is that a crime?' She doesn't say who her brother is.",
      "e:33": "Yes, I was an ICU sister. That is how Vikram and I met, in 2014. I used my family name before I married.",
      "e:34": "Our wedding. Anand gave me away. My father had passed by then. She folds her hands and says nothing more.",
    },
  },
  arjun: {
    intro: "Arjun Rathore sits on the edge of his chair, one knee jiggling. He looks like he hasn't slept.",
    fallback: ["I don't know anything about that.", "Ask someone who was paying attention. I wasn't.", "Why are you showing me this?"],
    topics: {
      "p:vikram": "He was hard on me. He was still my father. The last thing I said to him was that he'd regret it.",
      "p:meera": "She's always been polite to me. Polite is all it ever was.",
      "p:kapoor": "Uncle Anand wanted it over with. Papa had a bruise on his head and he called it his heart.",
      "p:kabir": "Papa's land man. He's been sniffing round Hollow Pines all year.",
      "p:sunita": "Sunita didi practically raised me. If she says something happened, it happened.",
      "e:3": "The rug. The chappal under the desk. Papa never left his things like that. Somebody moved things.",
      "e:6": "Bholu barks at everything. Monkeys, jackals, the wind.",
      "e:9": "I stayed in my room. I've said it.",
      "e:14": "He reads the last message twice and goes quiet. 'Fine. I went out. I didn't want anyone to know I was drinking again.'",
      "e:16": "So it wasn't his heart. I knew it. I knew it the moment I saw that bruise.",
      "e:19": "Yes, that's mine. I was at the Clocktower till nearly midnight. I came back by the back gate. Ask the barman.",
      "e:13": "That's Uncle Anand's car. I don't know anything about the camera.",
      "e:26": "I didn't kill my father for money I'd have to share with her.",
      "e:29": "The chowkidar's book? He sleeps half the night. I walked straight past the hut.",
    },
  },
  kapoor: {
    intro: "Dr. Anand Kapoor arrives exactly on time, in a tweed jacket. He answers every question as if dictating notes.",
    fallback: ["I'm a doctor, Inspector, not a detective.", "I have nothing useful to say about that.", "I've given my statement. I stand by it."],
    topics: {
      "p:vikram": "Thirty years a friend, twenty a patient. His heart was weak for a long time. I still believe that.",
      "p:meera": "Meera nursed him through 2014 in our ICU. She has been devoted to him ever since.",
      "p:arjun": "A troubled young man. He was shouting at his father the night he died.",
      "p:kabir": "Sethi wanted the land. Vikram had cooled on it. I kept out of it.",
      "p:sunita": "A loyal woman. She brought his milk to the door while I was with him.",
      "e:2": "The Inspector chose to override me. That is his right. I gave my honest opinion.",
      "e:5": "I entered his blood pressure on that watch myself, at about nine. The rest I can't speak to.",
      "e:7": "I wrote what I believed. A post-mortem was unnecessary, and cruel to the family.",
      "e:10": "I left at 9.40. I was home in time for the ten o'clock news. My wife will tell you.",
      "e:12": "Twenty-one fifty-eight? That's wrong. I was home by then. I don't know what that machine is doing.",
      "e:13": "That is my car, yes. The time on it is not right. I left at 9.40.",
      "e:16": "He is quiet for a long time. 'Potassium chloride. That is not a natural death.' He does not look at you.",
      "e:17": "An ampoule, in his fire? I have no idea how that came to be there.",
      "e:18": "Ward 3 needed it. The countersignature was an oversight. Everybody signs those late.",
      "e:22": "Lab services for the hospital. Perfectly ordinary payments.",
      "e:24": "A diagnostics partnership. My name is on it, yes. It did proper work.",
      "e:28": "Eighteen minutes fast. So I was telling the truth all along.",
      "e:30": "Sunanda has no reason to lie for me. I was home before ten.",
      "e:31": "Everything in it is true.",
      "e:34": "I was at their wedding, yes. I gave the bride away. Her father had passed.",
    },
  },
  kabir: {
    intro: "Kabir Sethi takes your call from Dehradun. A television is on somewhere behind him, and he does not turn it down.",
    fallback: ["I'm afraid I can't help you there.", "That's family business. Not mine.", "I really don't know, Inspector."],
    topics: {
      "p:vikram": "We had a handshake deal in June. Then he went cold, overnight. I never found out why.",
      "p:meera": "Charming woman. Always said the land would sell eventually.",
      "p:arjun": "The son? Owes money all over Landour, I hear. Not my business.",
      "p:kapoor": "The good doctor sits on the Trust. Vikram trusted him with everything.",
      "p:sunita": "I met her once. She gave me tea, and a look.",
      "e:11": "I was at Pinky's sangeet in Dehradun until half past one. Two hundred people saw me dancing badly.",
      "e:15": "I called him twice around ten to apologise. He didn't pick up.",
      "e:20": "I'd had a couple of drinks. I wanted to talk before Monday. That's all it was.",
      "e:21": "Mehta on Monday. I assumed he was going to block the sale, or put the land in the Trust.",
      "e:22": "Lab payments? Nothing to do with me. I'm in real estate.",
      "e:25": "I regret that email. My board was on my neck. It was a figure of speech.",
      "e:26": "If I'd wanted the land that badly, I'd have needed him alive to sign it.",
    },
  },
  sunita: {
    intro: "Sunita Negi stands until you ask her to sit. She keeps her hands folded in her lap the whole time.",
    fallback: ["I am only the housekeeper. I don't know about that.", "I can't read these things, Sahib.", "Nobody tells me about such matters."],
    topics: {
      "p:vikram": "Sahib was strict, but fair. He paid my son's school fees for five years.",
      "p:meera": "Memsahib went up at nine with a headache. She told me not to disturb her.",
      "p:arjun": "Arjun baba is not a bad boy. He drinks when he is sad.",
      "p:kapoor": "Doctor Sahib took the milk from me at the door. He said they were nearly done.",
      "p:kabir": "The resort man. He came once. Sahib did not like him very much.",
      "e:3": "The rug was not like that when I lit the fire at eight. And the chappal under the desk. Sahib never left them like that.",
      "e:4": "The study is at the end of the hall. From the front door you can hear the study, if it is quiet.",
      "e:6": "Everything I said is true. At quarter past ten there was a voice. Low, on and off, like one person talking.",
      "e:8": "Memsahib said she was asleep. Her light was off when I went to bed. I did not go up to see.",
      "e:15": "The phone in the study rang late, yes. Nobody answered it.",
      "e:29": "Bholu barked at the back gate near midnight. Then he stopped. The back gate has no camera.",
    },
  },
};
