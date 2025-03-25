// Dark and Light Modes Script
let darkmode = localStorage.getItem('darkmode');
const modes = document.querySelector('.btn-modes');

modes.addEventListener("click", () => {
  darkmode = localStorage.getItem('darkmode');
  darkmode !== "active" ? enableDarkmode() : disableDarkmode();
})

const enableDarkmode = () => {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', null)
}

if (darkmode === "active") enableDarkmode();

// CSS Animation Script
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log('entry')
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));