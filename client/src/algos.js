const allFuncs = {
  "twoSum" : function twoSum (arr, target) {
    for(let i = 0; i < arr.length; i++){
      for(let x = 1; x < arr.length; x++){
        if(arr[i] + arr[x] == target) return true;
      }
    }
    return false;
  },
  "addTwo": function addTwo (num) {
    return num + 2;
  },
  "toCelsius": function toCelsius(fahrenheit) {
    return (5/9) * (fahrenheit-32);
  },
}


const allTests = {
  "twoSum" : ["twoSum([1,2,3,4,5], 9)", "twoSum([1,1,1,1],3)"],
  "addTwo": ["addTwo(4)"],
  "toCelsius": ["toCelsius(251)"]
}
    

    

const exObj = allFuncs;

export {allFuncs, allTests};