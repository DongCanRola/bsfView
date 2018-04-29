/**
 * Created by zuce wei on 2017/6/1.
 */

export  function objectToMap(object) {
  let v='';
  if(object.length>0){
    let item=object[0];
    v=v+"\""+item.name+"\""+":"+"\""+item.rollNum+"\"";
  }

  for(let i=1;i<object.length;i++){
    let item=object[i];
    v=v+","+"\""+item.name+"\""+":"+"\""+item.rollNum+"\"";
  }
  let map="{"+v+"}";

  console.log("要添加的卷数："+map);
  return map;
}
