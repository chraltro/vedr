// src\utils\themes.ts
export const themes = {
  nordDark: {
    "--background-color": "#2e3440",
    "--background-color-secondary": "#3b4252",
    "--text-color": "#d8dee9",
    "--primary-color": "#81a1c1",
    "--secondary-color": "#5e81ac",
  },
  nordLight: {
    "--background-color": "#d8dee9",
    "--background-color-secondary": "#e5e9f0",
    "--text-color": "#1F2937",
    "--primary-color": "#5E81AC",
    "--secondary-color": "#81a1c1",
  },
  proWhiteMonochrome: {
    "--background-color": "#FFFFFF",
    "--background-color-secondary": "#cccccc",
    "--text-color": "#212121",
    "--primary-color": "#121212",
    "--secondary-color": "#121212",
  },
  proBlackMonochrome: {
    "--background-color": "#121212",
    "--background-color-secondary": "#2c2c2c",
    "--text-color": "#E0E0E0",
    "--primary-color": "#fefefe",
    "--secondary-color": "#efefef",
  },
  emerald: {
    "--background-color": "#2F5249",
    "--background-color-secondary": "#437057",
    "--text-color": "#E0E0E0",
    "--primary-color": "#97B067",
    "--secondary-color": "#E3DE61",
  },
  pastelGreen: {
    "--background-color": "#EEEFE0",
    "--background-color-secondary": "#D1D8BE",
    "--text-color": "#3B4252",
    "--primary-color": "#819A91",
    "--secondary-color": "#A7C1A8",
  },
  bano: {
    "--background-color": "#35414d",
    "--background-color-secondary": "#4C566A",
    "--text-color": "#B9DDED",
    "--primary-color": "#B9DDED",
    "--secondary-color": "#81A1C1",
  },
  whiteOnBlack: {
    "--background-color": "#000000",
    "--background-color-secondary": "#1A1A1A",
    "--text-color": "#FFFFFF",
    "--primary-color": "#FFFFFF",
    "--secondary-color": "#CCCCCC",
  },
  altro: {
    "--background-color": "#f6f7f1",
    "--background-color-secondary": "#e1f5bd",
    "--text-color": "#000000",
    "--primary-color": "#2f3c8b",
    "--secondary-color": "#bcf06b",
  },
};

export type Theme = {
  "--background-color": string;
  "--background-color-secondary": string;
  "--text-color": string;
  "--primary-color": string;
  "--secondary-color": string;
};