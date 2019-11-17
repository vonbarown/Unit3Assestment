let url;

document.addEventListener('DOMContentLoaded', () => {

    loadAllSightings()

    let switcher = document.querySelector('#switcher');
    switcher.addEventListener('change', () => {
        if (switcher.checked) {
            loadReacherSightings()
        } else {
            switcher.checked = false
            loadAllSightings()
        }
    })

    let button = document.querySelector('#click');
    button.addEventListener('click', () => {
        loadReacherSightings()
    })


})

const loadAllSightings = async (url) => {
    wipeScreen()
    url = `http://localhost:3131/sightings`

    const {
        data
    } = await axios.get(url)

    if (data.payload !== null) {
        displayAllSightings(data.payload)
    } else {
        displayError(data)
    }


}

const loadReacherSightings = async () => {
    wipeScreen()
    let input = document.querySelector('#researcher').value;

    url = `http://localhost:3131/sightings/researchers/${input}`

    const {
        data
    } = await axios.get(url)
    if (data.payload !== null) {
        displayAllSightings(data.payload)
    } else {
        displayError(data)
    }

}

const displayAllSightings = (data) => {

    data.forEach(element => {
        creatingCard(element)
    });

}

const creatingCard = async (data) => {

    const dataContainer = document.querySelector("#allSightings")

    let finalContainer = document.createElement('div');
    finalContainer.className = 'sightings'

    const researcherName = document.createElement('p')
    const jobTitle = document.createElement('p')
    let speciesName = document.createElement('p');
    let category = document.createElement('p');
    let isMammal = document.createElement('p');

    researcherName.innerText = `Researcher: ${data.researcher_name}`;
    jobTitle.innerText = `Position: ${data.job_title}`;
    speciesName.innerText = `Species: ${data.species_name}`;
    category.innerText = `Category: ${data.category}`;
    isMammal.innerText = `Mammal : ${data.is_mammal}`;

    finalContainer.append(researcherName, jobTitle, speciesName, category, isMammal)

    dataContainer.prepend(finalContainer);
}

const wipeScreen = () => {
    document.querySelector('#allSightings').innerText = ''
}

const displayError = (data) => {
    wipeScreen()
    const dataContainer = document.querySelector("#allSightings");
    let errorMessage = document.createElement('p');

    errorMessage.innerText = `Error : ${data.message}`

    dataContainer.append(errorMessage);
}