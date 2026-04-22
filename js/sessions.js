(function(){
  window.SessionsModule={
    name:'sessions',
    setFilter(value,apply){
      if(typeof apply==='function')apply(value);
    }
  };
})();
