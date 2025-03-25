// Card Animation Script
document.querySelectorAll('.cardques').forEach((question) => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;

    // Collapse any open answers
    document.querySelectorAll('.cardques').forEach((ques) => {
      if (ques !== question) {
        ques.classList.remove('active');
      }
    });
    
    document.querySelectorAll('.cardans').forEach((ans) => {
      if (ans !== answer) {
        ans.style.maxHeight = null;
      }
    });

    // Toggle the clicked answer
    if (answer.style.maxHeight) {
      answer.style.maxHeight = null;
      question.classList.remove('active');
    } else {
      answer.style.maxHeight = answer.scrollHeight + "px";
      question.classList.add('active');
    }
  });
});

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

// Dark and Light Modes Script
// getelementbyclass returns html collection, so use getelemntbyid or if there is only one element by said classname use queryselector or just use indexing like const modes = document.getElementsByClassName('btn-modes')[0]

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

// Login-Register button Script

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopUp = document.querySelector('.btn-main')
const btnPopUp2 = document.querySelector('.btn-foot')
const close = document.querySelector('.icon-close')

registerLink.addEventListener('click', () => {
  wrapper.classList.add('active')

});

loginLink.addEventListener('click', () => {
  wrapper.classList.remove('active')
});

btnPopUp.addEventListener('click', () => {
  wrapper.classList.add('active-popup')
});

btnPopUp2.addEventListener('click', () => {
  wrapper.classList.add('active-popup')
});

function scrollToSection() {
  document.getElementById("section1").scrollIntoView({ behavior: "smooth" });
}
close.addEventListener('click', () => {
  wrapper.classList.remove('active-popup')
});
