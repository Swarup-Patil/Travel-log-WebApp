let navList = document.querySelector('.mob-nav-list');
let openIcon = document.querySelector('.bx-menu');
let closeIcon = document.querySelector('.close-icon');

openIcon.addEventListener('click' , show)
    
 function show(){
    console.log("clicked me");
    navList.style.display = 'flex';
    navList.style.left = '0';
 }


 closeIcon.addEventListener('click' , shut)

 function shut(){
    navList.style.left = '-100%';
 }