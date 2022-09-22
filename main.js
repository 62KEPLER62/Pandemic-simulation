console.log("+----------------------+");
console.log("| Made by Rüzgar Erçen |");
console.log("+----------------------+");
const canvas = document.getElementById('canvas');
const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
const ctx = canvas.getContext('2d');
const healthyPeopleNumberInput = document.getElementById('people');
const sickPeopleNumberInput = document.getElementById('sick-people');
const infectionRadiusInput = document.getElementById('infection-radius');
const infectionProbabilityInput = document.getElementById('infection-probability');
const infectionLethalityInput = document.getElementById('infection-lethality');
const infectionDurationInput = document.getElementById('infection-duration');
const socialDistanceInput = document.getElementById('social-distance');
let cWidth = window.innerWidth - 300;
let cHeight = window.innerHeight - 300;
let id = 0;
canvas.width = cWidth;
canvas.height = cHeight;
canvas2.width = cWidth;
canvas2.height = 500;
let first = true;
let paused = false;
let infectionLethality;
let healthyPeoplenumber;
let healthyValue;
let sickValue;
let sickPeopleNumber;
let infectionRadius;
let infectionProbability;
let infectionDuration;
let people = [];

class People {
    constructor(ozel, x, y, sick, radius, infectionRadius, infectionProbability,willDie,counter,socialDistance) {
        id++;
        this.id = ozel;
        this.infectionProbability = infectionProbability;
        this.lastmove;
        this.x = x;
        this.y = y;
        this.sick = sick;
        this.radius = radius;
        this.infectionRadius = infectionRadius;
        this.willDie = willDie;
        this.counter = counter;
        this.socialDistance = socialDistance;
    }



    move() {
        let min = Infinity;
        let minperson;
        let varmi = true;
        for (let i = 0; i < people.length; i++) {
            if(this.socialDistance){
                if(people[i].id!=this.id){
                    if(distance(this,people[i]) < min){
                        min = distance(this,people[i]);
                        minperson = people[i];
                        varmi = false;
                    }
                }
            }
            if (people[i] != this.id && getIntersection(this, people[i], people[i].infectionRadius)) {
                if (people[i].sick) {
                    if (makeSick(people[i].infectionProbability)) {
                        if(!this.sick){
                            this.sick = true;
                            let die;
                            if(Math.random()<infectionLethality){
                                die = true;
                            }
                            else {
                                die = false;
                            }
                            this.willDie = die;
                            this.counter = infectionDuration;
                            healthyPeoplenumber--;
                            sickPeopleNumber++;
                        }
                    }
                }
            }
        }
        let go;
        let last;
        let rand;
        if(varmi){
            if (this.lastmove) {
                last = this.lastmove;
                rand = Math.floor(Math.random() * 64 - 0.000001);
            }
            else {
                rand = Math.round(Math.random() * 3);
            }
            if (last != undefined) {
                if (rand < 60) {
                    go = last;
                }
                else {
                    rand -= 60;
                    if (rand == 0) {
                        go = 1;
                    }
                    if (rand == 1) {
                        go = 2;
                    }
                    if (rand == 2) {
                        go = 3;
                    }
                    if (rand == 3) {
                        go = 4;
                    }
                }
            }
            else {
                if (rand == 0) {
                    go = 1;
                }
                if (rand == 1) {
                    go = 2;
                }
                if (rand == 2) {
                    go = 3;
                }
                if (rand == 3) {
                    go = 4;
                }
            }
        }
        else {
            let vertical = this.y-minperson.y;
            let horizontal = this.x-minperson.x; 
            if(Math.abs(vertical) > Math.abs(horizontal)) {
                if(horizontal < 0){
                    go = 3;
                }
                else {
                    go = 1;
                }
            }
            else {
                if(vertical < 0){
                    go = 2;
                }
                else {
                    go = 4;
                }
            }
        }
        this.properGo(go);
    }


    properGo(dir) {
        switch (dir) {
            case 1:
                if (this.x + 1 < cWidth) {
                    this.x++;
                    this.lastmove = 1;
                }
                else {
                    this.x--;
                    this.lastmove = 3;
                }
                break;
            case 2:
                if (this.y - 1 > 0) {
                    this.y--;
                    this.lastmove = 2;
                }
                else {
                    this.y++;
                    this.lastmove = 4;
                }
                break;
            case 3:
                if (this.x - 1 > 0) {
                    this.x--;
                    this.lastmove = 3;
                }
                else {
                    this.x++;
                    this.lastmove = 1;
                }
                break;
            case 4:
                if (this.y + 1 < cHeight) {
                    this.y++;
                    this.lastmove = 4;
                }
                else {
                    this.y--;
                    this.lastmove = 2;
                }
                break;
        }
    }

    draw() {
        if (this.sick) {
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.infectionRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
        else {
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function start() {
    if (first) {
        first = false;
        infectionDuration = infectionDurationInput.value;
        infectionLethality = parseFloat(infectionLethalityInput.value);
        healthyPeoplenumber = parseInt(healthyPeopleNumberInput.value);
        sickPeopleNumber = parseInt(sickPeopleNumberInput.value);
        infectionRadius = parseFloat(infectionRadiusInput.value);
        infectionProbability = parseFloat(infectionProbabilityInput.value);
        socialDistance = parseFloat(socialDistanceInput.value);
        healthyValue = healthyPeoplenumber;
        sickValue = sickPeopleNumber;
        //değiş
        for (let i = 0; i < healthyPeoplenumber; i++) {
            let x = Math.floor(Math.random() * cWidth);
            let y = Math.floor(Math.random() * cHeight);
            let tempsocial = false;
            if(Math.random()<socialDistance){
                tempsocial = true;
            }
            let p = new People(id, x, y, false, infectionRadius+10, infectionRadius, infectionProbability,false,infectionDuration,tempsocial);
            people.push(p);
        }
        for (let i = 0; i < sickPeopleNumber; i++) {
            let die;
            if(Math.random()<infectionLethality){
                die = true;
            }
            else {
                die = false;
            }
            let x = Math.floor(Math.random() * cWidth);
            let y = Math.floor(Math.random() * cHeight);
            let tempsocial = false;
            if(Math.random()<socialDistance){
                tempsocial = true;
            }
            let p = new People(id, x, y, true, infectionRadius+10, infectionRadius, infectionProbability,die,infectionDuration,tempsocial);
            people.push(p);
        }
    }
    if (paused) {
        paused = false;
        return;
    }
    animate();
}

function pause() {
    paused = true;
}

function reset() {
    window.location.reload();
}

function animate() {
    if (!paused) {
        main();
    }
    requestAnimationFrame(animate);
}

function main() {
    canvas.width = cWidth;
    for (let i = 0;i<people.length;i++) {
        people[i].move();
        people[i].draw();
        if(people[i].sick){
            people[i].counter--;
            if(people[i].counter == 0){
                if(people[i].willDie){
                    people.splice(i,1);
                    sickPeopleNumber--;
                }
                else {
                    people[i].sick = false;
                    people[i].counter = infectionDuration;
                    sickPeopleNumber--;
                    healthyPeoplenumber++;
                }
            }
        }
    }
    drawGraph();
}
function drawGraph() {
    ctx2.fillStyle="green";
    ctx2.beginPath();
    ctx2.arc(cWidth/2,500-healthyPeoplenumber, 1, 0, 2 * Math.PI);
    ctx2.fill();
    ctx2.fillStyle = "red";
    ctx2.beginPath();
    ctx2.arc(cWidth/2,500-sickPeopleNumber, 1, 0, 2 * Math.PI);
    ctx2.fill();
    var imageData = ctx2.getImageData(1, 0, cWidth-1, 500);
    ctx2.putImageData(imageData, 0, 0);
    ctx2.clearRect(cWidth-1, 0, 1, 500);
}