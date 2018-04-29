/**
 * Created by zuce wei on 2017/4/3.
 */

export function index(array,key){
  for(let i=0;i<array.length;i++){
    if(array[i].key==key){
      return i;
    }
    return -1;
  }
}

export function ObjectItem(array,key) {
  for(let item of array){
    if(item.key==key){
      return item;
    }
  }
  return null;
}
