export const pricingPlans = [
  {
    key: "starter",
    title: "Starter",
    price: "$ 5.00",
    per: "Per Month",
    features: [
      "hosting",
      "support",
      "custom",
    ],
    buttonStyle: "btn-border",
    animationOrder: 1,
  },
  {
    key: "standard",
    title: "Standard",
    price: "$ 230.00",
    per: "Per Month",
    features: [
      "hosting",
      "support",
      "custom",
      "seo",
    ],
    buttonStyle: "", // no border for 'active' one
    active: true,
    animationOrder: 2,
  },
  {
    key: "premium",
    title: "Premium",
    price: "$ 45.00",
    per: "Per Month",
    features: [
      "hosting",
      "support",
      "custom",
      "seo",
    ],
    buttonStyle: "btn-border",
    animationOrder: 3,
  },
];

export const pricingPlans2 = [
  {
    title: "Starter",
    icon: "/assets/images/pricing/pricing-logo-1.svg",
    features: [
      "5 Social Media Account",
      "Free Platform Access",
      "Free Platform Access",
      "24/7 Customer Support",
    ],
    price: "$ 5.00",
    active: false,
    borderedButton: true,
  },
  {
    title: "Premium",
    icon: "/assets/images/pricing/pricing-logo-2.svg",
    features: [
      "5 Social Media Account",
      "Free Platform Access",
      "24/7 Customer Support",
      "24/7 Customer Support",
    ],
    price: "$ 230.00",
    active: true,
    borderedButton: false,
  },
  {
    title: "Basic",
    icon: "/assets/images/pricing/pricing-logo-3.svg",
    features: [
      "5 Social Media Account",
      "Free Platform Access",
      "Digital Marketing",
      "24/7 Customer Support",
    ],
    price: "$ 45.00",
    active: false,
    borderedButton: true,
  },
];
