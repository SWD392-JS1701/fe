interface Answer {
  text: string;
  points: Record<"Oily" | "Dry", number>;
}

interface Question {
  id: number;
  text: string;
  type: "single" | "multiple";
  answers: Answer[];
}

// Skin Type Questions
export const questions: Question[] = [
  {
    id: 1,
    text: "How does your skin feel after washing your face?",
    type: "single",
    answers: [
      { text: "Tight and dry", points: { Dry: 1, Oily: 0 } },
      { text: "Smooth and balanced", points: { Dry: 0.5, Oily: 0.5 } },
      { text: "Oily and greasy", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 2,
    text: "Are your pores visible and large?",
    type: "single",
    answers: [
      { text: "Yes, they are large", points: { Oily: 1, Dry: 0 } },
      { text: "No, they are small", points: { Oily: 0, Dry: 1 } },
    ],
  },
  {
    id: 3,
    text: "Does your skin get shiny and oily throughout the day?",
    type: "single",
    answers: [
      { text: "Yes, very oily", points: { Oily: 1, Dry: 0 } },
      { text: "No, it stays dry", points: { Oily: 0, Dry: 1 } },
    ],
  },
  {
    id: 4,
    text: "How often do you notice blackheads or whiteheads?",
    type: "single",
    answers: [
      { text: "Frequently", points: { Oily: 1, Dry: 0 } },
      { text: "Rarely", points: { Oily: 0, Dry: 1 } },
    ],
  },
  {
    id: 5,
    text: "How does your skin feel in humid weather?",
    type: "single",
    answers: [
      { text: "Gets even oilier", points: { Oily: 1, Dry: 0 } },
      { text: "Feels normal or slightly dry", points: { Oily: 0, Dry: 1 } },
    ],
  },
  {
    id: 6,
    text: "How does your skin feel in cold weather?",
    type: "single",
    answers: [
      { text: "Very dry and flaky", points: { Dry: 1, Oily: 0 } },
      { text: "Still oily", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 7,
    text: "Do you need to use a moisturizer daily?",
    type: "single",
    answers: [
      { text: "Yes, my skin gets dry without it", points: { Dry: 1, Oily: 0 } },
      { text: "No, my skin stays hydrated", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 8,
    text: "Does your skin absorb skincare products quickly?",
    type: "single",
    answers: [
      { text: "Yes, it absorbs everything fast", points: { Dry: 1, Oily: 0 } },
      { text: "No, products sit on my skin", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 9,
    text: "How does your skin react to wearing foundation or makeup?",
    type: "single",
    answers: [
      { text: "Looks flaky or patchy", points: { Dry: 1, Oily: 0 } },
      { text: "Gets greasy quickly", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 10,
    text: "How does your skin feel in the morning?",
    type: "single",
    answers: [
      { text: "Dry and tight", points: { Dry: 1, Oily: 0 } },
      { text: "Oily and shiny", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 11,
    text: "How often do you need to blot your skin or use oil-absorbing sheets?",
    type: "single",
    answers: [
      { text: "Rarely or never", points: { Dry: 1, Oily: 0 } },
      { text: "Frequently", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 12,
    text: "Do you experience dry patches on your skin?",
    type: "single",
    answers: [
      { text: "Yes, very often", points: { Dry: 1, Oily: 0 } },
      { text: "No, never", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 13,
    text: "How does your skin feel after using a mattifying (oil-control) product?",
    type: "single",
    answers: [
      { text: "Too dry and uncomfortable", points: { Dry: 1, Oily: 0 } },
      { text: "Still oily after a while", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 14,
    text: "How does your skin react to skipping moisturizer for a day?",
    type: "single",
    answers: [
      { text: "Feels tight and uncomfortable", points: { Dry: 1, Oily: 0 } },
      { text: "Still looks hydrated", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 15,
    text: "Which best describes your skin after waking up?",
    type: "single",
    answers: [
      { text: "Dry and rough", points: { Dry: 1, Oily: 0 } },
      { text: "Oily and shiny", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 16,
    text: "How does your skin react to using hydrating products?",
    type: "single",
    answers: [
      { text: "Absorbs it immediately", points: { Dry: 1, Oily: 0 } },
      { text: "Feels greasy afterward", points: { Dry: 0, Oily: 1 } },
    ],
  },
];
