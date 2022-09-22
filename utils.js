function getIntersection(person1,person2,radius){
    if(Math.sqrt((person1.x-person2.x)*(person1.x-person2.x)+(person1.y-person2.y)*(person1.y-person2.y))-radius<=0){
        return true;
    }
    return false;
}

function distance(person1,person2){
    return Math.sqrt((person1.x-person2.x)*(person1.x-person2.x)+(person1.y-person2.y)*(person1.y-person2.y));
}

function makeSick(probability){
    if(probability==1){
        return true;
    }
    let random = Math.random();
    if(probability/10 > random){
        return true;
    }
    return false;
}