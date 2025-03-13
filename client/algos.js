    const twoSum = (arr, target) => {
        for(let i = 0; i < arr.length; i++){
          for(let x = 1; x < arr.length; x++){
            if(arr[i] + arr[x] == target) return true;
          }
        }
        return false;
      };

    

const exObj = {0: twoSum};

export default exObj;