"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
(_a = document.querySelector("#back-to-top")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    window.scrollTo(0, 0);
}, false);
let moreFiltersOpen = false;
let moreFilters = (document.querySelector("#more-filters"));
let flightSearchWindow = (document.querySelector("#flight-search"));
moreFilters.addEventListener("click", () => {
    if (!moreFiltersOpen) {
        flightSearchWindow.style.bottom = "0";
        moreFiltersOpen = !moreFiltersOpen;
        moreFilters.innerText = "Less Filters";
    }
    else {
        flightSearchWindow.style.bottom = "-25rem";
        moreFiltersOpen = !moreFiltersOpen;
        moreFilters.innerText = "More Filters";
    }
}, false);
const createInfoContainer = (title, details) => {
    let infoContainer = document.createElement("p");
    infoContainer.classList.add("info-container");
    let infoTitle = document.createElement("span");
    infoTitle.classList.add("info-title");
    infoTitle.textContent = title;
    infoContainer.appendChild(infoTitle);
    let infoDetails = document.createElement("span");
    infoDetails.classList.add("info-details");
    infoDetails.textContent = details;
    infoContainer.appendChild(infoDetails);
    return infoContainer;
};
const formatUnixDate = (unixDate, formatType) => {
    let date = new Date(unixDate * 1000);
    if (formatType === "text") {
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let monthFormatted = month < 10 ? `0${month}` : month.toString();
        let dayFormatted = day < 10 ? `0${day}` : day.toString();
        let formattedDate = `${dayFormatted} / ${monthFormatted} / ${year}`;
        return formattedDate;
    }
    else {
        return date.toString();
    }
};
const createLaunchCard = (data, parentId) => {
    var _a;
    let container = document.createElement("section");
    container.classList.add("launch-card");
    let header = document.createElement("h1");
    header.classList.add("flight-name");
    header.textContent = data.name;
    container.appendChild(header);
    let flightNum = document.createElement("h3");
    flightNum.classList.add("flight-number");
    flightNum.setAttribute("value", `flight-${data.flight_number}`);
    flightNum.textContent = `Flight Number ${data.flight_number}`;
    container.appendChild(flightNum);
    let rocketButton = document.createElement("button");
    rocketButton.classList.add("btn");
    rocketButton.textContent = "Rocket Details";
    container.appendChild(rocketButton);
    let patchImg = document.createElement("img");
    patchImg.src = data.links.patch.small;
    container.appendChild(patchImg);
    let launchDate = createInfoContainer("Launch Date", formatUnixDate(data.date_unix, "text"));
    container.appendChild(launchDate);
    let successText = data.success ? "Successful" : "Unsuccessful";
    let flightStatus = createInfoContainer("Flight Status", successText);
    container.appendChild(flightStatus);
    let statusLight = document.createElement("span");
    statusLight.classList.add("status-light");
    statusLight.style.background = data.success ? "seagreen" : "crimson";
    let crewInfo = data.crew.length === 0 ? "Unmanned" : "Crew Here";
    let crewDetails = createInfoContainer("Crew", crewInfo);
    container.appendChild(crewDetails);
    (_a = document.querySelector(parentId)) === null || _a === void 0 ? void 0 : _a.appendChild(container);
};
const fetchData = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    const data = yield response.json();
    data.forEach((launch) => {
        createLaunchCard(launch, "#launch-container");
    });
});
fetchData("https://api.spacexdata.com/v4/launches/");
const getFlightNameSearch = (e) => {
    let flightNames = [...document.querySelectorAll(".flight-name")];
    flightNames.forEach(name => {
        name.parentElement ? (name.parentElement.style.display = "block") : null;
        if (!name.innerHTML.toLowerCase().includes(e.target.value.toLowerCase())) {
            name.parentElement ? (name.parentElement.style.display = "none") : null;
        }
        else if (!e.target.value) {
            name.parentElement ? (name.parentElement.style.display = "block") : null;
        }
    });
};
(_b = document
    .querySelector("#flight-name")) === null || _b === void 0 ? void 0 : _b.addEventListener("input", getFlightNameSearch, false);
const getFlightNumberSearch = (e) => {
    console.log("THIS IS NOT WORKING!");
    let flightNumbers = [
        ...document.querySelectorAll(".flight-number"),
    ];
    if (e.target.value.length > 0) {
        flightNumbers.forEach(number => {
            if (number.getAttribute("value") !== `flight-${e.target.value}`) {
                number.parentElement
                    ? number.parentElement.style.display === "none"
                    : null;
            }
        });
    }
    else {
        flightNumbers.forEach(number => {
            number.parentElement
                ? (number.parentElement.style.display = "block")
                : null;
        });
    }
};
(_c = document
    .querySelector("#flight-number")) === null || _c === void 0 ? void 0 : _c.addEventListener("input", getFlightNumberSearch, false);
