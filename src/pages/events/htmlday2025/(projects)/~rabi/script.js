const humanCheckbox = document.getElementById('human-check');
const sureCheckbox = document.getElementById('sure-check');
const sureCheckboxRight = document.getElementById('sure-check-right');
const firstQuestion = document.getElementById('first-question');
const secondQuestion = document.getElementById('second-question');
const secondQuestionRight = document.getElementById('second-question-right');
const thirdQuestion = document.getElementById('third-question');

humanCheckbox.addEventListener('change', function() {
    if (this.checked) {
        firstQuestion.style.display = 'none';
        secondQuestion.style.display = 'flex';
        secondQuestion.style.opacity = '1';
    } else {
        firstQuestion.style.display = 'flex';
        secondQuestion.style.display = 'none';
        secondQuestionRight.style.display = 'none';
        thirdQuestion.style.display = 'none';
        sureCheckbox.checked = false;
        sureCheckboxRight.checked = false;
        const crosswalkDiv = document.querySelector('.crosswalk');
        crosswalkDiv.style.display = 'none';
    }
});

sureCheckbox.addEventListener('change', function() {
    if (this.checked) {
        secondQuestion.style.display = 'none';
        secondQuestionRight.style.display = 'flex';
        secondQuestionRight.style.opacity = '1';
    } else {
        secondQuestion.style.display = 'flex';
        secondQuestion.style.opacity = '1';
        secondQuestionRight.style.display = 'none';
        thirdQuestion.style.display = 'none';
        sureCheckboxRight.checked = false;
    }
});

sureCheckboxRight.addEventListener('change', function() {
    if (this.checked) {
        secondQuestionRight.innerHTML = '<p style="color: #f4ecec; font-size: 16px; line-height: 1.5; margin: 0;">then try to click on the crosswalk image</p>';
        const crosswalkDiv = document.querySelector('.crosswalk');
        crosswalkDiv.style.display = 'block';
    } else {
        secondQuestionRight.innerHTML = '<label for="sure-check-right">are you sure?</label><input type="checkbox" id="sure-check-right" name="sure-check-right">';
        const newSureCheckboxRight = document.getElementById('sure-check-right');
        newSureCheckboxRight.addEventListener('change', arguments.callee);
        thirdQuestion.style.display = 'none';
        const crosswalkDiv = document.querySelector('.crosswalk');
        crosswalkDiv.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const crosswalkImg = document.querySelector('.crosswalk img');
    let clickCount = 0;
    
    crosswalkImg.addEventListener('click', function() {
        const crosswalkDiv = document.querySelector('.crosswalk');
        clickCount++;
        
        if (clickCount === 1) {
            crosswalkDiv.style.left = 'auto';
            crosswalkDiv.style.right = '20px';
            crosswalkDiv.style.top = '20px';
            crosswalkDiv.style.bottom = 'auto';
        } else if (clickCount === 2) {
            crosswalkDiv.style.left = 'auto';
            crosswalkDiv.style.right = '20px';
            crosswalkDiv.style.top = 'auto';
            crosswalkDiv.style.bottom = '20px';
        } else if (clickCount === 3) {
            crosswalkDiv.style.left = '20px';
            crosswalkDiv.style.right = 'auto';
            crosswalkDiv.style.top = 'auto';
            crosswalkDiv.style.bottom = '20px';
            crosswalkImg.src = 'car.png';
            crosswalkImg.alt = 'Car Image';
        } else if (clickCount === 4) {
            document.body.innerHTML = `
                <div class="congrats-page">
                    <h1>congrats! you are definitely a robot</h1>
                    <p>because this is the (low quality) car image</p>
                    <div class="car-image">
                        <img src="car.png" alt="Car Image">
                    </div>
                    <p class="try-again">wanna try again?</p>
                    <div class="options">
                        <button class="option-btn" id="yes-btn">yes</button>
                        <button class="option-btn" id="no-btn">no</button>
                    </div>
                </div>
            `;
            const style = document.createElement('style');
            style.textContent = `
                .congrats-page {
                    background-color: #8ace00;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    text-align: center;
                    padding: 20px;
                }
                .congrats-page h1 {
                    color: #000000;
                    font-size: 2.5rem;
                    margin-bottom: 20px;
                    font-family: Arial, sans-serif;
                }
                .congrats-page p {
                    color: #000000;
                    font-size: 1.2rem;
                    margin-bottom: 30px;
                    font-family: Arial, sans-serif;
                }
                .car-image img {
                    max-width: 300px;
                    width: 90%;
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                .try-again {
                    color: #000000;
                    font-size: 1.1rem;
                    margin-top: 20px;
                    font-family: Arial, sans-serif;
                }
                .options {
                    display: flex;
                    gap: 20px;
                    margin-top: 20px;
                }
                .option-btn {
                    background-color: #000000;
                    color: #f4ecec;
                    border: none;
                    padding: 12px 24px;
                    font-size: 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: Arial, sans-serif;
                    transition: transform 0.2s ease;
                }
                .option-btn:hover {
                    transform: scale(1.05);
                }
            `;
            document.head.appendChild(style);
            
            document.getElementById('yes-btn').addEventListener('click', function() {
                document.body.innerHTML = `
                    <div class="final-page">
                        <h1>bruh just accept the truth. being a robot is fun anyways</h1>
                    </div>
                `;
                const finalStyle = document.createElement('style');
                finalStyle.textContent = `
                    .final-page {
                        background-color: #8ace00;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        text-align: center;
                        padding: 20px;
                    }
                    .final-page h1 {
                        color: #000000;
                        font-size: 2.2rem;
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                    }
                `;
                document.head.appendChild(finalStyle);
            });
            
            document.getElementById('no-btn').addEventListener('click', function() {
                document.body.innerHTML = `
                    <div class="binary-page">
                        <h1>01110111 01100101 01101100 01100011 01101111 01101101 01100101 00100000 01100010 01100001 01100011 01101011 00100000 01100010 01110101 01100100 01100100 01111001</h1>
                    </div>
                `;
                const binaryStyle = document.createElement('style');
                binaryStyle.textContent = `
                    .binary-page {
                        background-color: #8ace00;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        text-align: center;
                        padding: 20px;
                    }
                    .binary-page h1 {
                        color: #000000;
                        font-size: 1.5rem;
                        font-family: 'Courier New', monospace;
                        max-width: 800px;
                        line-height: 1.4;
                        word-break: break-all;
                    }
                `;
                document.head.appendChild(binaryStyle);
            });
        }
    });
});
