(function(){
  window.UiModule={
    name:'ui',
    safeText(v){
      return typeof v==='string'?v:String(v??'');
    }
  };
})();
