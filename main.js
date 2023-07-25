import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-57b19-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  push(shoppingListInDB, inputValue);

  clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      appendItemToshoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function appendItemToshoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.appendChild(newEl);
}

// UI Button
const uiButtonEl = document.getElementById("ui-button");
const imageEl = document.getElementById("image-el");
const root = document.querySelector(":root");

const UI_THEMES = [
  {
    colors: [
      { property: "--bg-body", value: "#f5ebeb" },
      { property: "--bg-input", value: "#e4d0d0" },
      { property: "--clr-input", value: "#ffffff" },
      { property: "--clr-input-placeholder", value: "#ffffffaa" },
      { property: "--bg-button", value: "#d5b4b4" },
      { property: "--bg-button-hover", value: "#867070" },
      { property: "--clr-button", value: "#ffffff" },
      { property: "--bg-item", value: "#ffffff" },
      { property: "--bg-item-hover", value: "#f8f1f1" },
      { property: "--clr-item", value: "#555555" },
    ],
    image: "assets/cat1.png",
  },
  {
    colors: [
      { property: "--bg-body", value: "#F7FFE5" },
      { property: "--bg-input", value: "#E1ECC8" },
      { property: "--clr-input", value: "#ffffff" },
      { property: "--clr-input-placeholder", value: "#ffffffcc" },
      { property: "--bg-button", value: "#C4D7B2" },
      { property: "--bg-button-hover", value: "#A0C49D" },
      { property: "--clr-button", value: "#ffffff" },
      { property: "--bg-item", value: "#ffffff" },
      { property: "--bg-item-hover", value: "#f6ffe0" },
      { property: "--clr-item", value: "#555555" },
    ],
    image: "assets/cat2.png",
  },
  {
    colors: [
      { property: "--bg-body", value: "#ECECEC" },
      { property: "--bg-input", value: "#9FD3C7" },
      { property: "--clr-input", value: "#ffffff" },
      { property: "--clr-input-placeholder", value: "#ffffffbb" },
      { property: "--bg-button", value: "#385170" },
      { property: "--bg-button-hover", value: "#142D4C" },
      { property: "--clr-button", value: "#ffffff" },
      { property: "--bg-item", value: "#ffffff" },
      { property: "--bg-item-hover", value: "#f7f7f7" },
      { property: "--clr-item", value: "#555555" },
    ],
    image: "assets/cat3.png",
  },
];

let currentTheme = 0;
let themeFromLocalStorage = JSON.parse(localStorage.getItem("theme"));

if (themeFromLocalStorage) {
  currentTheme = themeFromLocalStorage;
  render(currentTheme);
}

function render(themeIndex) {
  let theme = UI_THEMES[themeIndex];

  let colors = theme.colors;
  let imageSrc = theme.image;

  colors.forEach((color) => {
    let { property, value } = color;
    root.style.setProperty(property, value);
  });

  imageEl.src = imageSrc;
}

uiButtonEl.addEventListener("click", function () {
  currentTheme = currentTheme + 1 === UI_THEMES.length ? 0 : currentTheme + 1;
  localStorage.setItem("theme", currentTheme);
  render(currentTheme);
});
