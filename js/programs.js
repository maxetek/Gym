(function(){
  window.ProgramsModule={
    name:'programs',
    activate(id,apply){
      if(typeof apply==='function')apply(id);
    }
  };
})();
