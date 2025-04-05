document.addEventListener("DOMContentLoaded", () => {
    const maxWaterings = 7;
    const maxPlantSize = window.innerHeight * 0.3;
    //const maxPlantSize = window.innerHeight * 0.18;
    
    let gardens = [[null, null, null], [null, null, null]];
    let selectedPlant = "img/plant1.png";
    
    document.querySelectorAll("#plant_choice img").forEach(img => {
        img.addEventListener("click", () => {
            document.querySelectorAll("#plant_choice img").forEach(item => {
                item.classList.remove("selected-plant");
            });
            
            img.classList.add("selected-plant");
    
            selectedPlant = img.src;
    
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
        let waterPerPlant = 1
        const thresholds = [1, 2, 3, 4, 5, 6, 7];
        const translateYValues = [9, 18, 25, 31.3, 37, 42.5, 48];
        //const translateYValues = [9, 18, 25, 32, 38, 43, 44];
        const translateXValues = [2, 5, 8, 12, 16, 20, 24];
        //const translateXValues = [2, 5, 8, 11, 14, 17, 18];
        allPlants.forEach(plant => {
            plant.waterCount = (plant.waterCount || 0) + waterPerPlant;
            if (plant.waterCount > maxWaterings) {
                plant.style.filter = "grayscale(80%)";
            } else {
                let newSize = Math.min(parseFloat(plant.style.height) * 1.1, maxPlantSize);
                plant.style.height = `${newSize}px`;

                let index = thresholds.indexOf(plant.waterCount);
                //alert(translateYValues[index])

                plant.style.transform = `translateY(-${translateYValues[index]}%) translateX(-${translateXValues[index]}%)`;
            }
        });

        let alertMessage = '';
        allPlants.flat().forEach((plant, index) => {
            if (plant.waterCount === maxWaterings) {
                const plantIndex = index + 1;
                alertMessage += `Roślina numer ${plantIndex} osiągneła maksymalną wysokość.\n`;
            }
        });
    
        if (alertMessage) {
            alert(alertMessage);
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
            plant.remove();

            let planterIndex = gardens.findIndex(planter => planter.includes(plant));
            if (planterIndex !== -1) {
                let plantIndexInPlanter = gardens[planterIndex].indexOf(plant);
                gardens[planterIndex][plantIndexInPlanter] = null;
            }
        }
    });

    function createPlantElement(src, planterIndex, plantIndex) {
        let plant = document.createElement("img");
        plant.src = src;
        plant.style.position = "absolute";
        plant.style.height = "100px";
        plant.style.top = "53%";
        //plant.style.top = "39.1%";
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