const allFuncs = {
  0: function twoSum (arr, target) {
    for(let i = 0; i < arr.length; i++){
      for(let x = 1; x < arr.length; x++){
        if(arr[i] + arr[x] == target) return true;
      }
    }
    return false;
  },
}
    

    

const exObj = allFuncs[0].toString();

export default exObj;