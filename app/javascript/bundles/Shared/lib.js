import merge from 'deepmerge';

const makeId = function(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 16; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const isObject = function (n) {
  if (n == null) return false;
  return Object.prototype.toString.call(n) === '[object Object]';
}

const addIds = function(obj) {
  if (isObject(obj) && !obj._id){
    obj._id = makeId()
  }

  for(var i in obj) {
    if(obj.hasOwnProperty(i)){
      if (isObject(obj[i])){
        obj[i] = addIds(obj[i]);
      } else if (Array.isArray(obj[i])) {
        obj[i] = obj[i].map(function(v){return addIds(v);})
      }
    }
  }
  return obj;
};

const removeIds = function(obj) {
  if (isObject(obj)){
    delete obj._id
    delete obj.id
  }

  for(var i in obj) {
    if(obj.hasOwnProperty(i)){
      if (isObject(obj[i])){
        obj[i] = removeIds(obj[i]);
      } else if (Array.isArray(obj[i])) {
        obj[i] = obj[i].map(function(v){return removeIds(v);})
      }
    }
  }
  return obj;
};


// Takes a collection of thing and updates one of them using _id as key
function updateThing(things, updateThing){
  var newThings = JSON.parse(JSON.stringify(things))

  var index = 0
  for(let thing of newThings){
    if (thing._id == updateThing._id){
      var locatedThingIndex = index
    }
    index++
  }

  newThings[locatedThingIndex] = merge(newThings[locatedThingIndex], updateThing)
  return newThings
}

// Takes a collection of things and returns the thing that contains the subthing with _id as key
function findThingBySubthing(things, subthings_name, _id){
  for (let thing of things){
    if (Array.isArray(subthings_name)) {
      var _thing = thing[subthings_name[0]]
      var name = subthings_name[subthings_name.length - 1]
    } else {
      var _thing = thing;
      var name = subthings_name;
    }

    if (Array.isArray(_thing[name])){
      for (let subthing of _thing[name]){
        if (subthing._id === _id){
          return thing
        }
      }
    } else {
      if (_thing[name]._id === _id){
        return thing
      }
    }
  }
}


export { addIds, removeIds, updateThing, findThingBySubthing };
