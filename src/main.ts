// ***** back to top button *****
document.querySelector("#back-to-top")?.addEventListener(
  "click",
  () => {
    window.scrollTo(0, 0)
  },
  false
)

// ***** open more filters pane *****
let moreFiltersOpen: boolean = false
let moreFilters: HTMLElement = <HTMLElement>(
  document.querySelector("#more-filters")!
)
let flightSearchWindow: HTMLElement = <HTMLElement>(
  document.querySelector("#flight-search")!
)
moreFilters.addEventListener(
  "click",
  () => {
    if (!moreFiltersOpen) {
      flightSearchWindow.style.bottom = "0"
      moreFiltersOpen = !moreFiltersOpen
      moreFilters.innerText = "Less Filters"
    } else {
      flightSearchWindow.style.bottom = "-25rem"
      moreFiltersOpen = !moreFiltersOpen
      moreFilters.innerText = "More Filters"
    }
  },
  false
)

// ***** create info container elements *****
const createInfoContainer = (title: string, details: string): HTMLElement => {
  let infoContainer: HTMLElement = document.createElement("p")
  infoContainer.classList.add("info-container")
  let infoTitle: HTMLElement = document.createElement("span")
  infoTitle.classList.add("info-title")
  infoTitle.textContent = title
  infoContainer.appendChild(infoTitle)
  let infoDetails: HTMLElement = document.createElement("span")
  infoDetails.classList.add("info-details")
  infoDetails.textContent = details
  infoContainer.appendChild(infoDetails)
  return infoContainer
}

// ***** format unix dates to dd/mm/yyyy *****
const formatUnixDate = (
  unixDate: number,
  formatType: "text" | "date"
): string => {
  let date: Date = new Date(unixDate * 1000)

  if (formatType === "text") {
    let year: number = date.getFullYear()
    let month: number = date.getMonth()
    let day: number = date.getDate()

    let monthFormatted: string = month < 10 ? `0${month}` : month.toString()
    let dayFormatted: string = day < 10 ? `0${day}` : day.toString()

    let formattedDate: string = `${dayFormatted} / ${monthFormatted} / ${year}`
    return formattedDate
  } else {
    return date.toString()
  }
}

// ***** create interface for API data *****
interface ApiData {
  name: string
  flight_number: string
  links: {
    patch: {
      small: string
    }
  }
  date_unix: number
  success: boolean
  crew: string[]
}

// ***** create display card for each launch and append to DOM *****
const createLaunchCard = (data: ApiData, parentId: string): void => {
  let container: HTMLElement = document.createElement("section")
  container.classList.add("launch-card")

  let header: HTMLElement = document.createElement("h1")
  header.classList.add("flight-name")
  header.textContent = data.name
  container.appendChild(header)

  let flightNum: HTMLElement = document.createElement("h3")
  flightNum.classList.add("flight-number")
  flightNum.setAttribute("value", `flight-${data.flight_number}`)
  flightNum.textContent = `Flight Number ${data.flight_number}`
  container.appendChild(flightNum)

  let rocketButton: HTMLElement = document.createElement("button")
  rocketButton.classList.add("btn")
  rocketButton.textContent = "Rocket Details"
  container.appendChild(rocketButton)

  let patchImg: HTMLImageElement = document.createElement("img")
  patchImg.src = data.links.patch.small
  container.appendChild(patchImg)

  let launchDate: HTMLElement = createInfoContainer(
    "Launch Date",
    formatUnixDate(data.date_unix, "text")
  )
  container.appendChild(launchDate)

  let successText: string = data.success ? "Successful" : "Unsuccessful"
  let flightStatus: HTMLElement = createInfoContainer(
    "Flight Status",
    successText
  )
  container.appendChild(flightStatus)

  // let additionalInfo = document.createElement('span')
  // additionalInfo.textContent = data.details

  let statusLight: HTMLElement = document.createElement("span")
  statusLight.classList.add("status-light")
  statusLight.style.background = data.success ? "seagreen" : "crimson"

  let crewInfo: string = data.crew.length === 0 ? "Unmanned" : "Crew Here"
  let crewDetails: HTMLElement = createInfoContainer("Crew", crewInfo)
  container.appendChild(crewDetails)

  document.querySelector(parentId)?.appendChild(container)
}

// ***** fetch API data and iterate *****
const fetchData = async (url: string): Promise<void> => {
  const response = await fetch(url)
  const data = await response.json()
  data.forEach((launch: ApiData) => {
    createLaunchCard(launch, "#launch-container")
  })
}
fetchData("https://api.spacexdata.com/v4/launches/")

// ***** filter from flight name search *****
const getFlightNameSearch = (e: any): void => {
  let flightNames = [...document.querySelectorAll<HTMLElement>(".flight-name")]
  flightNames.forEach(name => {
    name.parentElement ? (name.parentElement.style.display = "block") : null
    if (!name.innerHTML.toLowerCase().includes(e.target.value.toLowerCase())) {
      name.parentElement ? (name.parentElement.style.display = "none") : null
    } else if (!e.target.value) {
      name.parentElement ? (name.parentElement.style.display = "block") : null
    }
  })
}
document
  .querySelector("#flight-name")
  ?.addEventListener("input", getFlightNameSearch, false)

// // ***** filter from flight name search *****

const getFlightNumberSearch = (e: any) => {
  console.log("THIS IS NOT WORKING!")
  let flightNumbers = [
    ...document.querySelectorAll<HTMLElement>(".flight-number"),
  ]
  if (e.target.value.length > 0) {
    // console.log("search")
    flightNumbers.forEach(number => {
      if (number.getAttribute("value") !== `flight-${e.target.value}`) {
        number.parentElement
          ? number.parentElement.style.display === "none"
          : null
      }
    })
  } else {
    // console.log("display all")
    flightNumbers.forEach(number => {
      number.parentElement
        ? (number.parentElement.style.display = "block")
        : null
    })
  }
}
document
  .querySelector("#flight-number")
  ?.addEventListener("input", getFlightNumberSearch, false)
