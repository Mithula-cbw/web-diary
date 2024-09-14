const notifyCancelBtn = document.getElementById('notify-cancel-btn');
const dailyNotify = document.getElementById('daily-notify');
const heroDate = document.getElementById('date-hero');
const heroYear = document.getElementById('year-hero');
const createEntry = document.getElementById('create-entry');
const form = document.getElementById('form');
const formClose = document.getElementById('form-cancel-btn');
const data = JSON.parse(localStorage.getItem('diaryEntries')) || [];
const submitForm = document.getElementById("submit");
const entryTitle = document.getElementById("entry-title");
const entryContent = document.getElementById("entry-content");
const moodRatingContainer = document.getElementById('mood-rating');

const entryDetailsPane = document.getElementById('entry-details-pane');
const paneEntryTitle = document.getElementById('pane-entry-title');
const paneEntryDate = document.getElementById('pane-entry-date');
const paneEntryContent = document.getElementById('pane-entry-content');
const closePaneBtn = document.getElementById('close-pane');
const entryRatingElem = entryDetailsPane.querySelector('.entry-rating');
let selectedMoodRating = 3;

const currentDate = new Date();
const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

notifyCancelBtn.addEventListener("click", () => {
    dailyNotify.remove();
});

formClose.addEventListener("click", () => {
    if (entryTitle.value === "" && entryContent.value === "") {
        form.classList.add("hidden");
    } else {
        const confirmation = confirm("Are you sure you want to close without saving?");
        if (confirmation) {
            toggleHiddenElement(form);
        }
    }
});

function renderStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="star ${i <= rating ? 'selected' : ''}">★</span>`;
    }
    return starsHtml;
}

const toggleHiddenElement = (Element) => {
    Element.classList.toggle("hidden");
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showEntryDetails(entry) {
    paneEntryTitle.textContent = entry.entryTitle;
    paneEntryDate.textContent = entry.date;
    paneEntryContent.textContent = entry.entryData;
    entryDetailsPane.classList.add('visible');
    entryRatingElem.innerHTML = renderStars(entry.moodRating);
}


const resetForm = () => {
    entryTitle.value = '';
    entryContent.value = ''; 
    selectedMoodRating = 3; 
    updateStars();
};

const updateDate = () => {
    heroDate.innerText = `${currentDay} ${months[currentMonth]}`;
    heroYear.innerText = `${currentYear}`;
};

window.addEventListener('DOMContentLoaded', (event) => {
    updateDate();
    // Load entries from localStorage on page load
    data.forEach(entry => addEntryToGrid(entry));
});

closePaneBtn.addEventListener('click', () => {

    closePaneBtn.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        closePaneBtn.style.transform = 'scale(2)';
    }, 200); 
    
    setTimeout(() => {
        entryDetailsPane.classList.remove('visible');
    }, 500); 
});


document.addEventListener('scroll', () => {
    const target = document.getElementById('create-entry');
    if (window.scrollY > 100) {
        target.classList.add('scrolled');
    } else {
        target.classList.remove('scrolled');
    }
});

createEntry.addEventListener('click', () => {
    toggleHiddenElement(form);
    document.getElementById('mood-color').value = '#000000';
});

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('entry-content');

    const resizeTextarea = (event) => {
        const target = event.target;
        target.style.height = 'auto'; // Reset height to get the scroll height
        // Ensure the height does not exceed max-height
        target.style.height = `${Math.min(target.scrollHeight, 400)}px`; // Adjust max height to match CSS max-height
    };

    textarea.addEventListener('input', resizeTextarea);
});



function saveEntry() {
    if (entryTitle.value.trim() === "") {
        alert("Please fill in the title.");
        return;
    } else {
        const entry = {
            "realDate": currentDate,
            "id": `${entryTitle.value.split(" ").join("-").toLowerCase()}-${currentDate.getTime()}`,
            "date": `${currentDay} ${months[currentMonth]} ${currentYear}`,
            "entryTitle": capitalizeFirstLetter(entryTitle.value.trim()),
            "entryData": entryContent.value,
            "moodRating": selectedMoodRating
        };

        data.push(entry);
        localStorage.setItem('diaryEntries', JSON.stringify(data));
        addEntryToGrid(entry);
        resetForm();
        toggleHiddenElement(form);
    }
}

submitForm.addEventListener("click", (event) => {
    event.preventDefault();
    saveEntry();
});

moodRatingContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('star')) {
        selectedMoodRating = event.target.getAttribute('data-value');
        updateStars();
    }
});

function updateStars() {
    const stars = moodRatingContainer.getElementsByClassName('star');
    Array.from(stars).forEach(star => {
        star.classList.toggle('selected', star.getAttribute('data-value') <= selectedMoodRating);
    });
}

function addEntryToGrid(entry) {
    const entryItem = document.createElement('div');
    entryItem.classList.add('entry-item');
    entryItem.setAttribute('id', entry.id);

    const gradients = [
        'linear-gradient(to right, rgba(255, 165, 0, 0.8) 0%, rgba(0, 0, 0, 0.8) 110%)', // 1 star (Orange to White)
        'linear-gradient(to right, rgba(255, 215, 128, 0.8) 0%, rgba(0, 0, 0, 0.8) 110%)', // 2 stars (Light Orange to Light White)
        'linear-gradient(to right, rgba(185, 251, 192, 0.8) 0%, rgba(0, 0, 0, 0.8) 110%)', // 3 stars (Light Green to Light White)
        'linear-gradient(to right, rgba(185, 251, 192, 0.8) 0%, rgba(0, 0, 0, 0.8) 110%)', // 4 stars (Light Green to Green)
        'linear-gradient(to right, rgba(76, 175, 80, 0.8) 0%, rgba(0, 0, 0, 0.8) 110%)'  // 5 stars (Green to White)
    ];

    const gradient = gradients[entry.moodRating - 1] || gradients[0];
    entryItem.style.background = gradient;
    const truncatedTitle = entry.entryTitle.length > 16? entry.entryTitle.substring(0, 16) + '...' : entry.entryTitle;

    entryItem.innerHTML = `
        <div class="entry-div">
        <p class="entry-title">${truncatedTitle}</p>
        <p class="entry-date">${entry.date}</p>
        </div>
        <p class="entry-content">${entry.entryData}</p>
        
    `;
    
    entryItem.addEventListener('click', () => {
        showEntryDetails(entry);
    });

    document.getElementById('entries-grid').appendChild(entryItem);
}

const scrollToTopBtn = document.getElementById('scroll-to-top-btn');


window.addEventListener('scroll', () => {
    if (window.scrollY > 150) { // Show button after scrolling down 300px
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});


scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
