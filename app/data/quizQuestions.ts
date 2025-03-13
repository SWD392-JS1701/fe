export const questions = [
  {
    id: 1,
    text: "How does your skin feel after washing?",
    type: "single" as const,
    answers: [
      { text: "Tight and dry", points: { Dry: 1, Oily: 0 } },
      { text: "Smooth and balanced", points: { Dry: 0.5, Oily: 0.5 } },
      { text: "Oily and shiny", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 2,
    text: "Does your skin react to products or environmental factors?",
    type: "single" as const,
    answers: [
      {
        text: "Yes, it gets red or irritated",
        points: { Sensitive: 1, Insensitive: 0 },
      },
      {
        text: "No, it’s rarely irritated",
        points: { Sensitive: 0, Insensitive: 1 },
      },
    ],
  },
  {
    id: 3,
    text: "Do you have dark spots or uneven skin tone?",
    type: "single" as const,
    answers: [
      { text: "Yes, noticeably", points: { Pigmented: 1, NonPigmented: 0 } },
      {
        text: "No, it’s fairly even",
        points: { Pigmented: 0, NonPigmented: 1 },
      },
    ],
  },
  {
    id: 4,
    text: "Do you notice fine lines or wrinkles on your skin?",
    type: "single" as const,
    answers: [
      { text: "Yes, they are visible", points: { Wrinkled: 1, Tight: 0 } },
      { text: "No, my skin feels tight", points: { Wrinkled: 0, Tight: 1 } },
    ],
  },
  {
    id: 5,
    text: "Which of these describe your skin throughout the day?",
    type: "multiple" as const,
    answers: [
      { text: "Feels dry by midday", points: { Dry: 1, Oily: 0 } },
      { text: "Becomes oily in the T-zone", points: { Dry: 0, Oily: 1 } },
      { text: "Stays balanced", points: { Dry: 0.5, Oily: 0.5 } },
    ],
  },
  {
    id: 6,
    text: "How does your skin react to sun exposure?",
    type: "single" as const,
    answers: [
      { text: "Burns easily", points: { Sensitive: 1, Insensitive: 0 } },
      {
        text: "Tans without burning",
        points: { Sensitive: 0, Insensitive: 1 },
      },
    ],
  },
  {
    id: 7,
    text: "Do you experience redness or flushing?",
    type: "single" as const,
    answers: [
      { text: "Yes, often", points: { Sensitive: 1, Insensitive: 0 } },
      { text: "No, rarely", points: { Sensitive: 0, Insensitive: 1 } },
    ],
  },
  {
    id: 8,
    text: "Are you sensitive to fragrances or alcohol in products?",
    type: "multiple" as const,
    answers: [
      {
        text: "Yes, to fragrances",
        points: { Sensitive: 1, Insensitive: 0 },
      },
      { text: "Yes, to alcohol", points: { Sensitive: 1, Insensitive: 0 } },
      { text: "No, to both", points: { Sensitive: 0, Insensitive: 1 } },
    ],
  },
  {
    id: 9,
    text: "Do you have visible pores?",
    type: "single" as const,
    answers: [
      { text: "Yes, large pores", points: { Oily: 1, Dry: 0 } },
      { text: "No, small pores", points: { Oily: 0, Dry: 1 } },
    ],
  },
  {
    id: 10,
    text: "How often do you see blackheads or whiteheads?",
    type: "single" as const,
    answers: [
      { text: "Rarely", points: { Oily: 0, Dry: 1 } },
      { text: "Occasionally", points: { Oily: 0.5, Dry: 0.5 } },
      { text: "Frequently", points: { Oily: 1, Dry: 0 } },
    ],
  },
  {
    id: 11,
    text: "Does your skin feel tight after cleansing?",
    type: "single" as const,
    answers: [
      { text: "Always", points: { Dry: 1, Oily: 0 } },
      { text: "Sometimes", points: { Dry: 0.5, Oily: 0.5 } },
      { text: "Never", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 12,
    text: "Do you notice hyperpigmentation from acne scars?",
    type: "single" as const,
    answers: [
      { text: "Yes", points: { Pigmented: 1, NonPigmented: 0 } },
      { text: "No", points: { Pigmented: 0, NonPigmented: 1 } },
    ],
  },
  {
    id: 13,
    text: "How elastic is your skin when pinched?",
    type: "single" as const,
    answers: [
      { text: "Very elastic", points: { Tight: 1, Wrinkled: 0 } },
      { text: "Somewhat elastic", points: { Tight: 0.5, Wrinkled: 0.5 } },
      { text: "Not elastic", points: { Tight: 0, Wrinkled: 1 } },
    ],
  },
  {
    id: 14,
    text: "Do you see fine lines around your eyes or mouth?",
    type: "single" as const,
    answers: [
      { text: "Yes", points: { Wrinkled: 1, Tight: 0 } },
      { text: "No", points: { Wrinkled: 0, Tight: 1 } },
    ],
  },
  {
    id: 15,
    text: "How does your skin react to humid weather?",
    type: "multiple" as const,
    answers: [
      { text: "Gets oily", points: { Oily: 1, Dry: 0 } },
      { text: "Stays balanced", points: { Oily: 0.5, Dry: 0.5 } },
      { text: "Becomes dry", points: { Oily: 0, Dry: 1 } },
    ],
  },
  {
    id: 16,
    text: "Have you noticed sagging or loss of firmness?",
    type: "single" as const,
    answers: [
      { text: "Yes", points: { Wrinkled: 1, Tight: 0 } },
      { text: "No", points: { Wrinkled: 0, Tight: 1 } },
    ],
  },
];
