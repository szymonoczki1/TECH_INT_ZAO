document.addEventListener("DOMContentLoaded", function () {


    //shown not shown part

    const listItems = document.querySelectorAll("div#main ul li");
    const contentDivs = {
        "Dodawanie macierzy": "dodawanie",
        "Odejmowanie macierzy": "odejmowanie",
        "Mnozenie macierzy": "mnozeniemac",
        "Mnozenie przez skalar": "mnozenieska",
        "Odwracanie macierzy": "odwracanie"
    };

    listItems.forEach(li => {
        li.addEventListener("click", () => {
            // Hide all content divs
            document.querySelectorAll("#mathpart > div").forEach(div => {
                div.classList.remove("shown");
            });

            // Get the ID of the corresponding div
            const id = contentDivs[li.textContent.trim()];
            
            if (id) {
                document.getElementById(id).classList.add("shown");
            }
        });
    });

    //matrix

    const rowsInput = document.getElementById("rowsADD");
    const colsInput = document.getElementById("colsADD");
    const generateMatrixButtonADD = document.getElementById("generateMatrixADD");


    generateMatrixButtonADD.addEventListener("click", () => {
        const shownDiv = document.querySelector('.shown');
        const rows = parseInt(rowsInput.value);
        const cols = parseInt(colsInput.value);

        
        if (shownDiv.id === 'dodawanie'){
            if (rows > 0 && cols > 0) {
                let signadd = document.getElementById("signadd")
                let matrixValuesDiv = document.getElementById("matrix1ADD");
                matrixValuesDiv.innerHTML = ""; // Clear previous inputs
    
                // Create matrix input fields dynamically
                for (let i = 0; i < rows; i++) {
                    const rowDiv = document.createElement("div");
                    for (let j = 0; j < cols; j++) {
                        const input = document.createElement("input");
                        input.type = "number";
                        input.id = `matrix1ADDValue_${i}_${j}`;
                        input.placeholder = `M${i+1}${j+1}`;
                        rowDiv.appendChild(input);
                    }
                    matrixValuesDiv.appendChild(rowDiv);
    
                }
                
                matrixValuesDiv = document.getElementById("matrix2ADD");
                matrixValuesDiv.innerHTML = "";
    
                for (let i = 0; i < rows; i++) {
                    const rowDiv = document.createElement("div");
                    for (let j = 0; j < cols; j++) {
                        const input = document.createElement("input");
                        input.type = "number";
                        input.id = `matrix2ADDValue_${i}_${j}`;
                        input.placeholder = `M${i+1}${j+1}`;
                        rowDiv.appendChild(input);  
                    }
                    matrixValuesDiv.appendChild(rowDiv);
    
                }
                
                signadd.style.display = "flex";
                

            } else {
                alert("Please enter valid matrix dimensions.");
            }
        }
        
    });

});