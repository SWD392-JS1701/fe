interface Answer {
  text: string;
  points: Record<string, number>;
}

interface Question {
  id: number;
  text: string;
  type: "single" | "multiple";
  answers: Answer[];
}

export const skinTypeDescriptions: Record<string, string> = {
  DSPW: "Dry, Sensitive, Pigmented, Wrinkled: Your skin tends to be dry and easily irritated, with visible pigmentation and signs of aging like wrinkles. Focus on gentle, hydrating products with anti-aging and brightening ingredients.",
  DSPT: "Dry, Sensitive, Pigmented, Tight: Your skin is dry and sensitive with pigmentation issues, but remains firm. Use soothing, moisturizing products with ingredients to address dark spots and maintain skin firmness.",
  DSNW: "Dry, Sensitive, Non-Pigmented, Wrinkled: Your skin is dry and sensitive, with wrinkles but no significant pigmentation. Prioritize hydration, calming ingredients, and anti-aging treatments.",
  DSNT: "Dry, Sensitive, Non-Pigmented, Tight: Your skin is dry and sensitive but lacks pigmentation and remains firm. Focus on gentle hydration and maintaining elasticity with protective ingredients.",
  DIPW: "Dry, Insensitive, Pigmented, Wrinkled: Your skin is dry and less prone to irritation, with pigmentation and wrinkles. Use hydrating products with brightening and anti-aging properties.",
  DIPT: "Dry, Insensitive, Pigmented, Tight: Your skin is dry and not easily irritated, with pigmentation but good firmness. Opt for moisturizing products that address dark spots and support skin elasticity.",
  DINW: "Dry, Insensitive, Non-Pigmented, Wrinkled: Your skin is dry, not sensitive, with wrinkles but no pigmentation. Focus on deep hydration and anti-aging treatments.",
  DINT: "Dry, Insensitive, Non-Pigmented, Tight: Your skin is dry, not sensitive, with no pigmentation and good firmness. Use hydrating products to maintain moisture and elasticity.",
  OSPW: "Oily, Sensitive, Pigmented, Wrinkled: Your skin is oily and sensitive, with pigmentation and wrinkles. Choose oil-free, non-irritating products with brightening and anti-aging benefits.",
  OSPT: "Oily, Sensitive, Pigmented, Tight: Your skin is oily and sensitive, with pigmentation but firm. Use oil-controlling, gentle products that address dark spots and maintain firmness.",
  OSNW: "Oily, Sensitive, Non-Pigmented, Wrinkled: Your skin is oily and sensitive, with wrinkles but no pigmentation. Opt for oil-free, soothing products with anti-aging properties.",
  OSNT: "Oily, Sensitive, Non-Pigmented, Tight: Your skin is oily and sensitive, with no pigmentation and good firmness. Use gentle, oil-controlling products to maintain balance and elasticity.",
  OIPW: "Oily, Insensitive, Pigmented, Wrinkled: Your skin is oily and not easily irritated, with pigmentation and wrinkles. Focus on oil-control, brightening, and anti-aging products.",
  OIPT: "Oily, Insensitive, Pigmented, Tight: Your skin is oily and not sensitive, with pigmentation but firm. Use oil-controlling products with brightening ingredients to maintain firmness.",
  OINW: "Oily, Insensitive, Non-Pigmented, Wrinkled: Your skin is oily, not sensitive, with wrinkles but no pigmentation. Choose oil-free products with anti-aging benefits.",
  OINT: "Oily, Insensitive, Non-Pigmented, Tight: Your skin is oily, not sensitive, with no pigmentation and good firmness. Use oil-controlling products to maintain balance and elasticity.",
};

// Quiz questions
export const questions: Question[] = [
  {
    id: 1,
    text: "How does your skin feel after washing?",
    type: "single",
    answers: [
      { text: "Tight and dry", points: { Dry: 1, Oily: 0 } },
      { text: "Smooth and balanced", points: { Dry: 0.5, Oily: 0.5 } },
      { text: "Oily and shiny", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 2,
    text: "Does your skin react to products or environmental factors?",
    type: "single",
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
    type: "single",
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
    type: "single",
    answers: [
      { text: "Yes, they are visible", points: { Wrinkled: 1, Tight: 0 } },
      { text: "No, my skin feels tight", points: { Wrinkled: 0, Tight: 1 } },
    ],
  },
  {
    id: 5,
    text: "Which of these describe your skin throughout the day?",
    type: "multiple",
    answers: [
      { text: "Feels dry by midday", points: { Dry: 1, Oily: 0 } },
      { text: "Becomes oily in the T-zone", points: { Dry: 0, Oily: 1 } },
      { text: "Stays balanced", points: { Dry: 0.5, Oily: 0.5 } },
    ],
  },
  {
    id: 6,
    text: "How does your skin react to sun exposure?",
    type: "single",
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
    type: "single",
    answers: [
      { text: "Yes, often", points: { Sensitive: 1, Insensitive: 0 } },
      { text: "No, rarely", points: { Sensitive: 0, Insensitive: 1 } },
    ],
  },
  {
    id: 8,
    text: "Are you sensitive to fragrances or alcohol in products?",
    type: "multiple",
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
    type: "single",
    answers: [
      { text: "Yes, large pores", points: { Oily: 1, Dry: 0 } },
      { text: "No, small pores", points: { Oily: 0, Dry: 1 } },
    ],
  },
  {
    id: 10,
    text: "How often do you see blackheads or whiteheads?",
    type: "single",
    answers: [
      { text: "Rarely", points: { Oily: 0, Dry: 1 } },
      { text: "Occasionally", points: { Oily: 0.5, Dry: 0.5 } },
      { text: "Frequently", points: { Oily: 1, Dry: 0 } },
    ],
  },
  {
    id: 11,
    text: "Does your skin feel tight after cleansing?",
    type: "single",
    answers: [
      { text: "Always", points: { Dry: 1, Oily: 0 } },
      { text: "Sometimes", points: { Dry: 0.5, Oily: 0.5 } },
      { text: "Never", points: { Dry: 0, Oily: 1 } },
    ],
  },
  {
    id: 12,
    text: "Do you notice hyperpigmentation from acne scars?",
    type: "single",
    answers: [
      { text: "Yes", points: { Pigmented: 1, NonPigmented: 0 } },
      { text: "No", points: { Pigmented: 0, NonPigmented: 1 } },
    ],
  },
  {
    id: 13,
    text: "How elastic is your skin when pinched?",
    type: "single",
    answers: [
      { text: "Very elastic", points: { Tight: 1, Wrinkled: 0 } },
      { text: "Somewhat elastic", points: { Tight: 0.5, Wrinkled: 0.5 } },
      { text: "Not elastic", points: { Tight: 0, Wrinkled: 1 } },
    ],
  },
  {
    id: 14,
    text: "Do you see fine lines around your eyes or mouth?",
    type: "single",
    answers: [
      { text: "Yes", points: { Wrinkled: 1, Tight: 0 } },
      { text: "No", points: { Wrinkled: 0, Tight: 1 } },
    ],
  },
  {
    id: 15,
    text: "How does your skin react to humid weather?",
    type: "multiple",
    answers: [
      { text: "Gets oily", points: { Oily: 1, Dry: 0 } },
      { text: "Stays balanced", points: { Oily: 0.5, Dry: 0.5 } },
      { text: "Becomes dry", points: { Oily: 0, Dry: 1 } },
    ],
  },
  {
    id: 16,
    text: "Have you noticed sagging or loss of firmness?",
    type: "single",
    answers: [
      { text: "Yes", points: { Wrinkled: 1, Tight: 0 } },
      { text: "No", points: { Wrinkled: 0, Tight: 1 } },
    ],
  },
];
