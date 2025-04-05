document.addEventListener("DOMContentLoaded", () => {
    const maxWaterings = 7;
    const maxPlantSize = window.innerHeight * 0.18;
    
    let gardens = [[null, null, null], [null, null, null]]; // Two planter boxes
    let selectedPlant = "img/plant1.png";
    
    document.querySelectorAll("#plant_choice img").forEach(img => {
        img.addEventListener("click", () => {
            document.querySelectorAll("#plant_choice img").forEach(item => {
                item.classList.remove("selected-plant"); // Remove the 'selected-plant' class from all plants
            });
            
            // Add the scale effect to the clicked plant
            img.classList.add("selected-plant");
    
            // Update selected plant source
            selectedPlant = img.src;
    
            // If all planters are empty, add the selected plant
            if (gardens.flat().every(plant => plant === null)) {
                addPlantToEmptyPlanter(selectedPlant);
            }
        });
    });

    document.getElementById("fertilizer").addEventListener("click", () => {
        let planterIndex = gardens.findIndex(planter => planter.includes(null));
        if (planterIndex !== -1) {
            let plantIndex = gardens[planterIndex].indexOf(null);
            let newPlant = createPlantElement(selectedPlant, planterIndex, plantIndex);
            gardens[planterIndex][plantIndex] = newPlant;
            document.getElementById(`planter${planterIndex + 1}`).parentElement.appendChild(newPlant);
        }
    });

    document.getElementById("waterdrop").addEventListener("click", () => {
        let allPlants = gardens.flat().filter(plant => plant !== null);
        //let waterPerPlant = allPlants.length > 0 ? 1 / allPlants.length : 0;
        let waterPerPlant = 1
        allPlants.forEach(plant => {
            plant.waterCount = (plant.waterCount || 0) + waterPerPlant;
            if (plant.waterCount > maxWaterings) {
                plant.style.filter = "grayscale(80%)";
            } else {
                let newSize = Math.min(parseFloat(plant.style.height) * 1.1, maxPlantSize);
                plant.style.height = `${newSize}px`;
                //plant.translateY = -25; //9 18 25 32 38 43 44
                //plant.style.transform = `translateY(${plant.translateY}%)`;

                const thresholds = [1, 2, 3, 4, 5, 6, 7];  // Water count levels
                const translateYValues = [9, 18, 25, 32, 38, 43, 44]; // Corresponding translateY values
                const translateXValues = [2, 5, 8, 11, 14, 17, 18]
                let index = thresholds.indexOf(plant.waterCount)
                //alert(translateYValues[index])

                plant.style.transform = `translateY(-${translateYValues[index]}%) translateX(-${translateXValues[index]}%)`;

            }
        });

        let alertMessage = '';
        allPlants.flat().forEach((plant, index) => {
            if (plant.waterCount === maxWaterings) {
                const plantIndex = index + 1; // +1 to make the index human-readable
                alertMessage += `Roślina numer ${plantIndex} osiągneła maksymalną wysokość.\n`;
            }
        });
    
        if (alertMessage) {
            alert(alertMessage); // Only show the alert if there are any plants to notify
        }

    });



    document.getElementById("ambulance").addEventListener("click", () => {
        gardens.flat().filter(plant => plant !== null).forEach(plant => {
            if (plant.waterCount > maxWaterings) {
                plant.waterCount = 0;
                plant.style.filter = "none";
                plant.style.height = "100px";
                plant.style.transform = 'translateY(0%) translateX(0%)'
            }
        });
    });

    document.getElementById("axe").addEventListener("click", () => {
        let plantIndex = prompt("Podaj numer rośliny do ścięcia:") - 1;
        let allPlants = gardens.flat().filter(plant => plant !== null);
        
        if (plantIndex >= 0 && plantIndex < allPlants.length) {
            let plant = allPlants[plantIndex];
            plant.remove(); // Remove plant from the DOM

            // Find which planter the plant was in and remove it from the garden array
            let planterIndex = gardens.findIndex(planter => planter.includes(plant));
            if (planterIndex !== -1) {
                let plantIndexInPlanter = gardens[planterIndex].indexOf(plant);
                gardens[planterIndex][plantIndexInPlanter] = null; // Mark the spot as empty
            }
        }
    });

    function createPlantElement(src, planterIndex, plantIndex) {
        let plant = document.createElement("img");
        plant.src = src;
        plant.style.position = "absolute";
        plant.style.height = "100px";
        //plant.style.left = "62%"; //34 40 46  50 56 62
        plant.style.top = "39.1%";
        plant.waterCount = 0;
        plant.translateY = 0;


        const positions = [35, 40, 45];
        const positionsPlanter2 = [51, 56, 61];
        
        if (planterIndex === 0 && plantIndex < positions.length) {
            plant.style.left = `${positions[plantIndex]}%`;
        } else if (planterIndex === 1 && plantIndex < positionsPlanter2.length) {
            plant.style.left = `${positionsPlanter2[plantIndex]}%`;
        }


        return plant;
    }

    function addPlantToEmptyPlanter(src) {
        let planterIndex = gardens.findIndex(planter => planter.includes(null));
        if (planterIndex !== -1) {
            let plantIndex = gardens[planterIndex].indexOf(null);
            let newPlant = createPlantElement(src, planterIndex, plantIndex);
            gardens[planterIndex][plantIndex] = newPlant;
            document.getElementById(`planter${planterIndex + 1}`).parentElement.appendChild(newPlant);
        }
    }

});