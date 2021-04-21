let currentTheme = "light";

const DARK_THEME = {
  "--text": "#fff",
  "--bg": "#444",
  "--bg2": "#333",
  "--bg3": "#222",
};

const LIGHT_THEME = {
  "--text": "#333",
  "--bg": "#f2f2f2",
  "--bg2": "#eee",
  "--bg3": "#ccc",
};

const btn = document.querySelector("#changeThemeBtn");
btn.addEventListener("click", (e) => {
  if (currentTheme === "light") {
    currentTheme = "dark";
    e.target.innerText = "🌞";
    changeTheme(DARK_THEME);
  } else {
    currentTheme = "light";
    e.target.innerText = "🌙";
    changeTheme(LIGHT_THEME);
  }
});

const changeTheme = (theme) => {
  for (let [key, val] of Object.entries(theme)) {
    document.documentElement.style.setProperty(key, val);
  }
};
